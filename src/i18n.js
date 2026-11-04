// i18n id/en dengan fallback: bahasa aktif -> id -> teks kunci.
const dicts = {};
let current = 'id';

export async function loadDicts() {
  await Promise.all(['id', 'en'].map(async (l) => {
    const r = await fetch(`i18n/${l}.json`);
    if (!r.ok) throw new Error(`i18n ${l}: ${r.status}`);
    dicts[l] = await r.json();
  }));
}

export function setLang(l) { current = dicts[l] ? l : 'id'; return current; }
export function getLang() { return current; }

function lookup(dict, key) {
  let v = dict;
  for (const part of key.split('.')) {
    if (v == null || typeof v !== 'object') return undefined;
    v = v[part];
  }
  return v;
}

export function raw(key, lang = current) {
  let v = dicts[lang] && lookup(dicts[lang], key);
  if (v === undefined) v = dicts.id && lookup(dicts.id, key);
  return v;
}

export function t(key, vars) {
  let v = raw(key);
  if (typeof v !== 'string') return typeof v === 'undefined' ? key : v;
  if (vars) v = v.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
  return v;
}

export function has(key) { return typeof raw(key) === 'string'; }
