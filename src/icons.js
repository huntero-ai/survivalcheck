// SurvivalCheck - glyph status kecil (SVG stroke 2 px, satu keluarga dengan ikon navigasi).
// Dekoratif: selalu aria-hidden, artinya dibawa teks di sebelahnya.
const PATHS = {
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  tri: '<path d="M12 5l8.5 14.5h-17z"/>',
  circle: '<circle cx="12" cy="12" r="7"/>',
  half: '<circle cx="12" cy="12" r="7"/><path d="M12 5a7 7 0 010 14z"/>',
  minus: '<path d="M6 12h12"/>',
  warn: '<path d="M12 3l10 18H2z"/><path d="M12 10v5"/><path d="M12 18v.01"/>',
};

export function glyph(name) {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('aria-hidden', 'true');
  s.setAttribute('class', 'glyph glyph-' + name);
  s.innerHTML = PATHS[name] || '';
  return s;
}
