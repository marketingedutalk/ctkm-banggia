// Đối chiếu engine JS với giá trị Excel đã tính sẵn. Chạy: node tests/engine.test.mjs
import { readFileSync } from 'node:fs';
import seed from '../src/data/seed.js';
import { quote, validateData } from '../src/engine/pricing.js';

const cases = JSON.parse(readFileSync(new URL('./fixtures/excel_cases.json', import.meta.url), 'utf8'));
const close = (a, b) => Math.abs(Number(a) - Number(b)) <= 1;
let pass = 0;
const fails = [];

for (const c of cases) {
  const base = { label: c.label, program: c.program, method: c.method, term: c.term, lktFormat: c.lktFormat, items: c.items };
  const q = quote(seed, { ...base, warranty: c.warranty ?? 'Tiêu chuẩn' });
  const e = c.expect;
  const checks = { gross: q.gross, voucher: q.voucherTotal, pct: q.pct, cashback: q.cashback, afterPromo: q.afterPromo };
  if (e.warrantyBase != null) checks.warrantyBase = q.warrantyBase;
  if (e.silver != null) {
    checks.silver = quote(seed, { ...base, warranty: 'Bạc' }).final;
    checks.gold = quote(seed, { ...base, warranty: 'Vàng' }).final;
    checks.diamond = quote(seed, { ...base, warranty: 'Kim Cương' }).final;
  }
  if (e.final != null) Object.assign(checks, { warrantyFee: q.warrantyFee, final: q.final });
  const bad = Object.entries(checks).filter(([k, v]) => !(k === 'pct' ? Math.abs(v - e[k]) < 1e-9 : close(v, e[k])));
  if (e.status && e.status !== q.status) bad.push(['status', q.status]);
  if (!bad.length) pass++;
  else fails.push({ src: c.source, key: `${c.label}|${c.program}|${c.route ?? ''}|${c.method}|${c.term}`, bad: bad.map(([k, v]) => `${k}: js=${v} excel=${e[k]}`) });
}

console.log(`Excel parity: ${pass}/${cases.length} ca khớp`);
fails.slice(0, 15).forEach((f) => console.log(' ✗', f.src, f.key, f.bad.join('; ')));

// ---- Liên kết trường theo Nhóm LKT (cấu trúc 04B mới, công thức 12_CALCULATOR_SALE!B15/K17/K18/H3) ----
const items8 = [
  ['Module A', 'Online'], ['Module B', 'Online'], ['BS', 'Offline'], ['PRE', 'Offline'],
  ['IE4.5', 'Offline'], ['IE6.5(M1)', 'Offline'], ['BT5.5', 'Online'], ['Ready', 'Offline'],
].map(([code, mode]) => ({ code, mode }));
const find = (rows, f) => rows.find(f);
const cut = (label, group, format) => find(seed.lkt, (r) => r.label === label && r.group === group && r.format === format).cut;
const courseVoucher = (label, it) => find(seed.courses, (c) => c.label === label && c.code === it.code && c.mode === it.mode).voucher;
const progVoucher = (label, program, it) =>
  find(seed.programVouchers, (v) => v.label === label && v.program.toLowerCase() === program.toLowerCase() && v.code === it.code && v.mode === it.mode)?.voucher ??
  courseVoucher(label, it);
const extPct = (label, program, method, term) =>
  find(seed.extended, (r) => r.label === label && r.program.toLowerCase() === program.toLowerCase() && r.method === method && r.term === term).pct;
const spPct = (label, method, term) => find(seed.special, (r) => r.label === label && r.method === method && r.term === term).pct;
const sum = (arr) => arr.reduce((s, x) => s + x, 0);

const lktCases = [
  {
    name: 'LKT Thấp điểm · Sacombank 12 · Format 1',
    input: { label: 'IELTS Mentor', program: 'Liên kết trường', lktGroup: 'LKT Thấp điểm', lktFormat: 'Format 1', method: 'Sacombank', term: 12, warranty: 'Kim Cương', items: items8 },
    expect: {
      status: 'OK',
      pct: extPct('IELTS Mentor', 'Thấp điểm', 'Sacombank', 12) - cut('IELTS Mentor', 'LKT Thấp điểm', 'Format 1'),
      voucherTotal: sum(items8.map((it) => progVoucher('IELTS Mentor', 'Thấp điểm', it))),
    },
  },
  {
    name: 'LKT Toàn hệ thống · Full · Format 2 (nền = Định kỳ đặc biệt, voucher danh mục)',
    input: { label: 'IELTS Mentor', program: 'Liên kết trường', lktGroup: 'LKT Toàn hệ thống', lktFormat: 'Format 2', method: 'Full', term: 0, warranty: 'Tiêu chuẩn', items: items8 },
    expect: {
      status: 'OK',
      pct: spPct('IELTS Mentor', 'Full', 0) - cut('IELTS Mentor', 'LKT Toàn hệ thống', 'Format 2'),
      voucherTotal: sum(items8.map((it) => courseVoucher('IELTS Mentor', it))),
    },
  },
  {
    name: 'LKT Vũ Đài Trí Tuệ · Citime 6 · Format 7',
    input: { label: 'IELTS Mentor', program: 'Liên kết trường', lktGroup: 'LKT Vũ Đài Trí Tuệ', lktFormat: 'Format 7', method: 'Citime', term: 6, warranty: 'Bạc', items: items8 },
    expect: {
      status: 'OK',
      pct: extPct('IELTS Mentor', 'Vũ Đài Trí Tuệ', 'Citime', 6) - cut('IELTS Mentor', 'LKT Vũ Đài Trí Tuệ', 'Format 7'),
      voucherTotal: sum(items8.map((it) => progVoucher('IELTS Mentor', 'Vũ Đài Trí Tuệ', it))),
    },
  },
  {
    name: 'Chưa chọn nhóm',
    input: { label: 'IELTS Mentor', program: 'Liên kết trường', lktFormat: 'Format 1', method: 'Full', term: 0, items: items8 },
    expect: { status: 'CHƯA CHỌN NHÓM LIÊN KẾT TRƯỜNG' },
  },
  {
    name: 'CLASSUP 1-8 không có LKT Thấp điểm',
    input: { label: 'CLASSUP 1-8', program: 'Liên kết trường', lktGroup: 'LKT Thấp điểm', lktFormat: 'Format 1', method: 'Full', term: 0, items: [{ code: 'BS', mode: 'Online' }, { code: 'PRE', mode: 'Online' }] },
    expect: { status: 'KHÔNG TÌM THẤY CHÍNH SÁCH LKT' },
  },
];
for (const c of lktCases) {
  const q = quote(seed, c.input);
  const bad = Object.entries(c.expect).filter(([k, v]) => (typeof v === 'number' ? Math.abs(q[k] - v) > 1e-6 : q[k] !== v));
  if (bad.length) fails.push({ src: 'LKT', key: c.name, bad: bad.map(([k, v]) => `${k}: js=${q[k]} mong đợi=${v}`) });
  else pass++;
}
console.log(`LKT theo nhóm: ${lktCases.length} ca`);
if (fails.length) fails.filter((f) => f.src === 'LKT').forEach((f) => console.log(' ✗', f.key, f.bad.join('; ')));

const issues = validateData(seed);
console.log(`validateData(seed): ${issues.length} cảnh báo`);
issues.slice(0, 10).forEach((i) => console.log('  ⚠', i.table, i.row + 1, i.message));
process.exit(fails.length ? 1 : 0);
