// Penyimpanan lokal: localStorage dibungkus try/catch, fallback memori.
export const STORAGE_KEY = 'survivalcheck.v1';
export const SCHEMA = 1;

let memory = null; // fallback bila localStorage tak tersedia
let available = null;

export function defaultState() {
  return {
    profile: null,
    target: null,
    scenarios: [],
    inventory: {},
    bag_checklist: {},
    indicators: {},
    power_inventory: null,
    power_devices: null,
    settings: { lang: 'id', theme: 'system', reminders: { check: true, water: true, drill: true, power: true }, reminderDone: {}, disclaimerAccepted: false },
    family_plan: {},
    shopping: { checked: {}, hide_bought: false },
    createdAt: null,
    updatedAt: null,
  };
}

function ls() {
  try { return window.localStorage; } catch (e) { return null; }
}

export function isAvailable() {
  if (available !== null) return available;
  try {
    const s = ls();
    if (!s) throw new Error('none');
    s.setItem('__sc_test', '1');
    s.removeItem('__sc_test');
    available = true;
  } catch (e) { available = false; }
  return available;
}

function normalize(raw) {
  const base = defaultState();
  const s = Object.assign(base, raw && typeof raw === 'object' ? raw : {});
  s.settings = Object.assign(base.settings, (raw && raw.settings) || {});
  s.settings.reminders = Object.assign(defaultState().settings.reminders, s.settings.reminders || {});
  return s;
}

/** Muat state. Mengembalikan {state, error} ; error='read' bila data rusak. */
export function load() {
  let text = null;
  try {
    if (isAvailable()) text = ls().getItem(STORAGE_KEY);
    else if (memory) text = memory;
  } catch (e) { text = null; }
  if (!text) return { state: defaultState(), error: null };
  try {
    return { state: normalize(JSON.parse(text)), error: null };
  } catch (e) {
    return { state: defaultState(), error: 'read' };
  }
}

/** Simpan state. Mengembalikan true bila tersimpan permanen. */
export function save(state) {
  const text = JSON.stringify(state);
  memory = text;
  if (!isAvailable()) return false;
  try { ls().setItem(STORAGE_KEY, text); return true; } catch (e) { return false; }
}

export function clearAll() {
  memory = null;
  try { if (isAvailable()) ls().removeItem(STORAGE_KEY); } catch (e) { /* abaikan */ }
}

export function exportJSON(state) {
  return JSON.stringify({ app: 'survivalcheck', schema: SCHEMA, exportedAt: new Date().toISOString(), state }, null, 2);
}

/** Validasi file impor. Lempar Error dgn message 'format' | 'version' | 'read'. */
export function parseImport(text) {
  let obj;
  try { obj = JSON.parse(text); } catch (e) { throw new Error('read'); }
  if (!obj || obj.app !== 'survivalcheck' || typeof obj.state !== 'object' || obj.state === null) throw new Error('format');
  if (obj.schema !== SCHEMA) throw new Error('version');
  return normalize(obj.state);
}
