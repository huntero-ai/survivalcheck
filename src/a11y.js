// SurvivalCheck - pola ARIA radiogroup di atas tombol: roving tabindex + tombol panah.
// Panah memindahkan fokus dan memilih (klik), Home/End ke ujung. Mengembalikan sync() untuk
// dipanggil setelah aria-checked berubah.
export function rovingRadios(group) {
  const radios = () => [...group.querySelectorAll('[role="radio"]')];
  const sync = () => {
    const rs = radios();
    const cur = rs.find((r) => r.getAttribute('aria-checked') === 'true') || rs[0];
    rs.forEach((r) => { r.tabIndex = r === cur ? 0 : -1; });
  };
  group.addEventListener('keydown', (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    const rs = radios();
    const i = rs.indexOf(e.target.closest('[role="radio"]'));
    if (i < 0) return;
    let n;
    if (step) n = (i + step + rs.length) % rs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = rs.length - 1;
    else return;
    e.preventDefault();
    rs[n].focus();
    rs[n].click();
  });
  sync();
  return sync;
}
