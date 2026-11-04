// QA bagian 5+6: isi/copy. Kumpulkan teks semua rute (id & en), cek larangan, penanda CUPLIKAN, keselamatan.
import { chromium, serve, reporter, baseState, ROUTES, CATS } from './lib.mjs';
import fs from 'node:fs';
const { ok, fails } = reporter();
const srv = await serve(); const browser = await chromium.launch();
const ALL = ['earthquake', 'tsunami', 'flood_landslide', 'eruption', 'haze', 'drought', 'extreme_weather', 'power_outage', 'pandemic', 'conflict', 'nuclear'];
const st = (lang) => baseState({ profile: { ...baseState().profile, counts: { infant: 1, toddler: 1, child: 1, adult: 2, elderly: 1 }, pets: { dog: 1, cat: 1 }, has_electric_medical: true, meds: [{ label: 'x', doses_per_day: 1, stock_days: 3 }], scenarios: ALL }, scenarios: ALL, settings: { ...baseState().settings, lang } });
const texts = { id: {}, en: {} };
const expandAll = async (p) => { await p.evaluate(() => document.querySelectorAll('details').forEach((d) => (d.open = true))); };
for (const lang of ['id', 'en']) {
  const c = await browser.newContext({ viewport: { width: 360, height: 740 } });
  await c.addInitScript(([k, s]) => { if (!window.name.includes('s')) { localStorage.setItem(k, s); window.name = 's'; } }, ['survivalcheck.v1', JSON.stringify(st(lang))]);
  const p = await c.newPage();
  const routes = [...ROUTES, ...ALL.map((s) => '#/info/panduan/' + s)];
  for (const r of routes) { await p.goto(srv.base + r); await p.reload(); await p.waitForSelector('main h1, main h2').catch(() => {}); await p.waitForTimeout(150); await expandAll(p); texts[lang][r] = await p.evaluate(() => document.body.innerText + '\n' + [...document.querySelectorAll('input,textarea')].map((i) => i.placeholder || '').join(' ')); }
  // halaman inventaris: tombol "Mengapa dan sumber"
  await c.close();
}
fs.writeFileSync('/tmp/qa-shots/texts.json', JSON.stringify(texts));
const all = (l) => Object.values(texts[l]).join('\n');
for (const l of ['id', 'en']) {
  const T = all(l);
  ok(!/\bRp\.?\s?\d|\bRp\b|rupiah|\bIDR\b|\$\s?\d|USD/i.test(T), `[${l}] tanpa harga/Rp`, T.match(/.{20}(\bRp\b|rupiah|IDR|USD).{20}/i));
  ok(!/53 (negara|countries)/i.test(T), `[${l}] tanpa '53 negara'`);
  const brands = T.match(/\b(Indomie|Aqua|Bayclin|Pocari|Samsung|Xiaomi|Anker|Jackery|EcoFlow|Bluetti|Philips|ResMed|Dettol|Betadine|Panadol|Sanmol|Tolak Angin|Antangin|Sidomuncul|Pampers|MamyPoko|Lifebuoy|Rinso|SoKlin|Kapal Api|Energen|Milo|Ultra Milk|Sari Roti|Tupperware|Lazada|Tokopedia|Shopee|Amazon)\b/gi);
  ok(!brands, `[${l}] tanpa merek produk`, brands);
  ok(!/(antibiotik|antibiotic|amoxicillin|ivermectin|tamiflu|oseltamivir|morfin|morphine|tramadol|obat keras)/i.test(T.replace(/tanpa resep dokter|without a prescription/g, '')), `[${l}] tanpa saran obat keras/antibiotik`, T.match(/.{30}(antibiotik|antibiotic|amoxicillin|ivermectin|tamiflu|oseltamivir|obat keras).{30}/i));
  const shop = texts[l]['#/belanja'];
  ok(!/kalium iodida|potassium iodide|\bKI\b|iodide|yodium|iodine/i.test(shop), `[${l}] daftar belanja tanpa kalium iodida/yodium`, shop.match(/.{30}(kalium|iodide|yodium|iodine).{30}/i));
  ok(!/\b(undefined|NaN|\[object Object\]|null)\b/.test(T), `[${l}] tanpa undefined/NaN/null`, T.match(/.{30}\b(undefined|NaN|null)\b.{30}/));
}
// keselamatan / copy (id)
const ID = all('id'); const EN = all('en');
const need = [
  ['disclaimer tampil (home)', /bukan pengganti instruksi otoritas/i, texts.id['#/']],
  ['disclaimer tampil (hasil)', /bukan.{0,60}(pengganti|nasihat)|perkiraan|alat bantu/i, texts.id['#/hasil']],
  ['disclaimer halaman penuh', /bukan nasihat medis/i, texts.id['#/info/disclaimer']],
  ['CO genset (daya)', /(genset|generator).{0,160}(di dalam|dalam rumah|ruangan)|karbon monoksida|CO\b/i, texts.id['#/daya'] + texts.id['#/inventaris/power']],
  ['tsunami: jangan menunggu sirene', /jangan menunggu sirene/i, texts.id['#/info/panduan/tsunami'] + texts.id['#/info/panduan']],
  ['konflik rujukan internasional', /rujukan internasional/i, texts.id['#/info/panduan/conflict'] + texts.id['#/info/panduan']],
  ['nuklir rujukan internasional', /rujukan internasional/i, texts.id['#/info/panduan/nuclear'] + texts.id['#/info/panduan']],
  ['112 tergantung daerah', /112.{0,200}tergantung daerah/i, texts.id['#/info/darurat']],
  ['bleach cek kadar/label', /pemutih[\s\S]{0,400}(label|kadar)/i, texts.id['#/info/air']],
  ['bleach 5-9%', /5 sampai 9\s?%|5-9\s?%/i, texts.id['#/info/air']],
  ['KI hanya atas instruksi otoritas', /(kalium iodida|KI)[\s\S]{0,200}(otoritas|instruksi)/i, texts.id['#/info/panduan/nuclear'] + texts.id['#/info/panduan']],
  ['EN: tsunami do not wait for siren', /do not wait for (the )?siren|don.t wait for (the )?siren/i, texts.en['#/info/panduan/tsunami'] + texts.en['#/info/panduan']],
  ['EN: 112 depends on region', /112[\s\S]{0,200}(depends|varies)/i, texts.en['#/info/darurat']],
];
for (const [n, re, src] of need) ok(re.test(src), 'copy: ' + n, (src || '').slice(0, 200));
// CO warning terdekat dgn genset di #/daya: tampilkan potongan
const co = (texts.id['#/daya'].match(/.{0,100}(genset|CO\b).{0,200}/i) || [''])[0]; console.log('   CO daya:', co.replace(/\n/g, ' '));
// nada menakutkan
const scary = ID.match(/.{0,40}\b(mati|tewas|kematian|korban jiwa|fatal|mengerikan|panik!|bahaya besar|celaka)\b.{0,40}/gi) || [];
console.log('   kata menakutkan (id):', scary.slice(0, 15));
// tampilan hasil per lang
fs.writeFileSync('/tmp/qa-shots/hasil-id.txt', texts.id['#/hasil']);
console.log('FAILS', fails());
await browser.close(); srv.close();
