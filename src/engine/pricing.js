// Engine tính giá khuyến mại — chuyển 1:1 từ sheet 12_CALCULATOR_SALE.
// Thuần JavaScript, không phụ thuộc framework: dùng được trong Vue/React/Node (cả server để chống sửa giá).

const norm = (s) => String(s ?? '').trim().toLowerCase();
// Excel MATCH/COUNTIF không phân biệt hoa thường ("Vũ Đài Trí Tuệ" = "Vũ đài trí tuệ")
const eq = (a, b) => norm(a) === norm(b);
const money = (n) => Math.round(Number(n) || 0);

export const STATUS_OK = 'OK';

export function findProgram(data, name) {
  return data.settings.programs.find((p) => eq(p.name, name));
}

export function findMethod(data, name) {
  return data.settings.paymentMethods.find((m) => eq(m.name, name));
}

/** Kỳ hạn hợp lệ của 1 hình thức thanh toán ([0] = không kỳ hạn: Full, Giai đoạn). */
export function termsFor(data, method) {
  return findMethod(data, method)?.terms ?? [0];
}

export function isFixedTerm(data, method) {
  const t = termsFor(data, method);
  return t.length === 1 && Number(t[0]) === 0;
}

/** Danh sách mã khóa có trong danh mục của nhãn, theo thứ tự chuẩn. */
export function coursesForLabel(data, label) {
  const codes = data.settings.courseCodes.slice().sort((a, b) => a.order - b.order);
  return codes
    .filter((cc) => data.courses.some((c) => eq(c.label, label) && eq(c.code, cc.code)))
    .map((cc) => ({
      ...cc,
      name: data.courses.find((c) => eq(c.label, label) && eq(c.code, cc.code))?.name ?? cc.code,
      modes: data.courses.filter((c) => eq(c.label, label) && eq(c.code, cc.code)).map((c) => c.mode),
    }));
}

/** Mã combo theo thứ tự chuẩn, VD "BS_PRE_IE45" (12_CALCULATOR_SALE!K3). */
export function comboCode(data, items) {
  return data.settings.courseCodes
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter((cc) => items.some((i) => eq(i.code, cc.code)))
    .map((cc) => cc.short)
    .join('_');
}

export function findLktGroup(data, name) {
  return data.settings.lktGroups?.find((g) => eq(g.name, name));
}

/** Format LKT của 1 nhãn trong 1 nhóm LKT. */
export function lktFormatsFor(data, label, group) {
  return data.lkt.filter((r) => eq(r.label, label) && eq(r.group, group));
}

/** Nhóm LKT có chính sách cho nhãn này. */
export function lktGroupsFor(data, label) {
  return (data.settings.lktGroups ?? []).filter((g) => data.lkt.some((r) => eq(r.label, label) && eq(r.group, g.name)));
}

/** Bổ sung trường mới cho dữ liệu đã lưu theo cấu trúc cũ (trước khi có Nhóm LKT). */
export function normalizeData(data) {
  const s = data.settings;
  if (!Array.isArray(s.lktGroups) || !s.lktGroups.length)
    s.lktGroups = [{ name: 'LKT Toàn hệ thống', baseProgram: 'Định kỳ đặc biệt' }];
  data.lkt.forEach((r) => {
    if (!r.group) r.group = s.lktGroups[0].name;
  });
  return data;
}

function discount(data, { label, program, method, keyTerm, count, lktGroup, lktFormat }) {
  const prog = findProgram(data, program);
  switch (prog?.type) {
    case 'DINH_KY': {
      const tiers = data.periodic.filter((t) => eq(t.label, label) && t.from <= count && t.to >= count);
      return {
        pct: tiers.reduce((s, t) => s + t.pct, 0),
        cashback: tiers.reduce((s, t) => s + t.cashback, 0),
        found: tiers.length > 0,
      };
    }
    case 'DAC_BIET': {
      const row = data.special.find((r) => eq(r.label, label) && eq(r.method, method) && Number(r.term) === keyTerm);
      return { pct: row?.pct ?? 0, cashback: 0, found: !!row };
    }
    case 'LKT': {
      // % LKT = % chương trình nền của nhóm (VD "LKT Thấp điểm" → Thấp điểm) − mức cắt của format
      const group = findLktGroup(data, lktGroup);
      const cut = group && lktFormat
        ? data.lkt.find((r) => eq(r.label, label) && eq(r.group, group.name) && eq(r.format, lktFormat))
        : null;
      const baseProg = findProgram(data, group?.baseProgram);
      const base = baseProg && baseProg.type !== 'LKT'
        ? discount(data, { label, program: baseProg.name, method, keyTerm, count })
        : { pct: 0, found: false };
      return {
        pct: base.found && cut ? base.pct - cut.cut : 0,
        cashback: 0,
        found: base.found && !!cut,
        lkt: { group: group?.name ?? '', baseProgram: baseProg?.name ?? '', baseType: baseProg?.type ?? '',
          basePct: base.pct, baseFound: base.found, cut: cut ? cut.cut : null },
      };
    }
    case 'MO_RONG': {
      const row = data.extended.find(
        (r) => eq(r.label, label) && eq(r.program, program) && eq(r.method, method) && Number(r.term) === keyTerm,
      );
      return { pct: row?.pct ?? 0, cashback: 0, found: !!row };
    }
    default:
      return { pct: 0, cashback: 0, found: false };
  }
}

function gift(data, { label, program, method, count }) {
  const group = findMethod(data, method)?.giftGroup ?? method;
  const rows = data.gifts.filter((g) => eq(g.label, label) && eq(g.program, program) && eq(g.method, group));
  if (!rows.length) return null;
  // Excel: MIN(số khóa, 6) — mốc cao nhất trong bảng quà
  const cap = Math.max(...data.gifts.filter((g) => eq(g.label, label) && eq(g.program, program)).map((g) => g.milestone));
  const row = rows.find((g) => Number(g.milestone) === Math.min(count, cap));
  return row ? { content: row.content, value: row.value } : null;
}

/**
 * Báo giá.
 * @param {object} data   Dữ liệu gốc (xem src/data/seed.js)
 * @param {object} input  { label, program, method, term, warranty, lktGroup, lktFormat, items: [{ code, mode }] }
 */
export function quote(data, input) {
  const { label, program, method, warranty, lktGroup, lktFormat } = input;
  const term = Number(input.term) || 0;
  const items = (input.items ?? []).filter((i) => i && i.code);
  const prog = findProgram(data, program);
  const pm = findMethod(data, method);
  const fixedTerm = isFixedTerm(data, method);
  const keyTerm = fixedTerm ? 0 : term;
  // Voucher riêng theo CTKM mở rộng; với LKT thì theo chương trình nền của nhóm (12_CALCULATOR_SALE!H3)
  const voucherProgram = prog?.type === 'LKT' ? findLktGroup(data, lktGroup)?.baseProgram : program;
  const isExtended = findProgram(data, voucherProgram)?.type === 'MO_RONG';

  const lines = items.map((it) => {
    const course = data.courses.find((c) => eq(c.label, label) && eq(c.code, it.code) && eq(c.mode, it.mode));
    let voucher = course?.voucher ?? 0;
    if (isExtended) {
      const pv = data.programVouchers.find(
        (v) => eq(v.label, label) && eq(v.program, voucherProgram) && eq(v.code, it.code) && eq(v.mode, it.mode),
      );
      if (pv) voucher = pv.voucher;
    }
    const info = data.settings.courseCodes.find((cc) => eq(cc.code, it.code));
    return {
      code: it.code,
      mode: it.mode,
      name: course?.name ?? it.code,
      price: course?.price ?? 0,
      voucher,
      found: !!course,
      warranty: info?.warranty !== false,
    };
  });

  const count = lines.length;
  const gross = lines.reduce((s, l) => s + l.price, 0);
  const voucherTotal = lines.reduce((s, l) => s + l.voucher, 0);
  const warrantyBase = lines.filter((l) => l.warranty).reduce((s, l) => s + l.price, 0);

  const combo = comboCode(data, items);
  const citimeRoute = combo ? data.citimeRoutes.find((r) => eq(r.label, label) && eq(r.code, combo)) : null;
  const citimeStatus = citimeRoute ? citimeRoute.status : combo ? 'KHÔNG CÓ' : '';
  const citimeMax = citimeRoute?.maxTerm ?? null;

  const d = discount(data, { label, program, method, keyTerm, count, lktGroup, lktFormat });
  const discountAmt = gross * d.pct;
  const afterPromo = gross - discountAmt - d.cashback - voucherTotal;
  const warrantyRate = data.warranty.find((w) => eq(w.name, warranty))?.rate ?? 0;
  const warrantyFee = warrantyBase * warrantyRate;

  const result = {
    lines,
    count,
    gross: money(gross),
    voucherTotal: money(voucherTotal),
    pct: d.pct,
    cashback: money(d.cashback),
    discountAmt: money(discountAmt),
    afterPromo: money(afterPromo),
    warrantyRate,
    warrantyBase: money(warrantyBase),
    warrantyFee: money(warrantyFee),
    final: money(afterPromo + warrantyFee),
    gift: gift(data, { label, program, method, count }),
    lkt: d.lkt ?? null,
    combo: { code: combo, routeName: citimeRoute?.name ?? '', group: citimeRoute?.group ?? '', citimeStatus, citimeMax },
  };
  result.status = status(data, { input, term, prog, pm, fixedTerm, count, lines, combo, citimeStatus, citimeMax, d, result });
  result.ok = result.status === STATUS_OK;
  return result;
}

// Thứ tự kiểm tra giữ nguyên như hàm IFS ở 12_CALCULATOR_SALE!B23, bổ sung vài kiểm tra Excel đang bỏ sót.
function status(data, ctx) {
  const { input, term, prog, pm, fixedTerm, count, lines, combo, citimeStatus, citimeMax, d, result } = ctx;
  const methodName = String(pm?.name ?? input.method ?? '').toUpperCase();
  const labelCfg = data.settings.labels.find((l) => eq(l.name, input.label));

  if (!input.label) return 'CHƯA CHỌN NHÃN';
  if (!input.program) return 'CHƯA CHỌN CHƯƠNG TRÌNH';
  if (!input.method) return 'CHƯA CHỌN HÌNH THỨC THANH TOÁN';
  if (count === 0) return 'CHƯA CHỌN KHÓA HỌC';
  const missing = lines.find((l) => !l.found);
  if (missing) return `KHÔNG CÓ KHÓA ${missing.code} - ${missing.mode || '?'}`;
  if (prog?.type === 'LKT') {
    if (!input.lktGroup) return 'CHƯA CHỌN NHÓM LIÊN KẾT TRƯỜNG';
    if (!input.lktFormat) return 'CHƯA CHỌN FORMAT LIÊN KẾT TRƯỜNG';
    if (d.lkt?.cut == null) return 'KHÔNG TÌM THẤY CHÍNH SÁCH LKT';
  }
  if (prog?.type === 'MO_RONG' && !d.found) return 'KHÔNG ÁP DỤNG CHƯƠNG TRÌNH';
  if (prog?.type === 'LKT' && d.lkt?.baseType === 'MO_RONG' && !d.lkt.baseFound) return 'KHÔNG ÁP DỤNG HTTT CHO NHÓM LKT';
  if (count === 1 && pm && !pm.allowSingle) return 'KHÓA LẺ CHỈ ÁP DỤNG ĐÓNG FULL';
  if (fixedTerm && term !== 0) return `${methodName} PHẢI CÓ KỲ HẠN = 0`;
  if (labelCfg?.blockedMethods?.some((m) => eq(m, input.method)))
    return `${String(input.label).toUpperCase()} KHÔNG ÁP DỤNG HTTT NÀY`;
  if (count >= 2 && !combo) return 'KHÔNG TÌM THẤY LỘ TRÌNH';
  if (pm && !pm.citime && !fixedTerm && !pm.terms.map(Number).includes(term)) return `KỲ HẠN ${methodName} KHÔNG HỢP LỆ`;
  if (pm?.citime) {
    if (!eq(citimeStatus, 'Áp dụng')) return `KHÔNG ÁP DỤNG ${methodName}`;
    if (!pm.terms.map(Number).includes(term)) return `KỲ HẠN ${methodName} KHÔNG HỢP LỆ`;
    if (citimeMax != null && term > citimeMax) return `VƯỢT KỲ HẠN ${methodName} TỐI ĐA`;
  }
  // Bổ sung so với Excel: Excel trả 0% âm thầm khi không có dòng CTKM khớp
  if (!d.found) return 'KHÔNG ÁP DỤNG CHƯƠNG TRÌNH';
  if (result.afterPromo < 0) return 'LỖI GIÁ';
  return STATUS_OK;
}

/** Bảng giá lộ trình gợi ý (thay sheet 11A–11F): tính sẵn mọi lộ trình của 1 nhãn. */
export function routeTable(data, { label, program, method, term, warranty, lktGroup, lktFormat, output }) {
  return data.routes
    .filter((r) => eq(r.label, label) && (!output || eq(r.output, output)))
    .map((r) => ({
      route: r,
      quote: quote(data, { label, program, method, term, warranty, lktGroup, lktFormat, items: r.items }),
    }));
}

/** Kiểm tra nhanh dữ liệu admin vừa nhập (khóa trùng, giá âm, ...). */
export function validateData(data) {
  const issues = [];
  const dup = (rows, keyFn, table) => {
    const seen = new Map();
    rows.forEach((r, i) => {
      const k = keyFn(r);
      if (seen.has(k)) issues.push({ table, row: i, message: `Trùng khóa với dòng ${seen.get(k) + 1}: ${k}` });
      else seen.set(k, i);
    });
  };
  dup(data.courses, (r) => norm(`${r.label}|${r.code}|${r.mode}`), 'courses');
  dup(data.programVouchers, (r) => norm(`${r.label}|${r.program}|${r.code}|${r.mode}`), 'programVouchers');
  dup(data.special, (r) => norm(`${r.label}|${r.method}|${r.term}`), 'special');
  dup(data.extended, (r) => norm(`${r.label}|${r.program}|${r.method}|${r.term}`), 'extended');
  dup(data.lkt, (r) => norm(`${r.label}|${r.group}|${r.format}`), 'lkt');
  data.lkt.forEach((r, i) => {
    if (!findLktGroup(data, r.group)) issues.push({ table: 'lkt', row: i, message: `Nhóm "${r.group}" chưa khai báo ở mục Nhóm LKT` });
  });
  dup(data.citimeRoutes, (r) => norm(`${r.label}|${r.code}`), 'citimeRoutes');
  dup(data.gifts, (r) => norm(`${r.label}|${r.program}|${r.milestone}|${r.method}`), 'gifts');
  data.courses.forEach((r, i) => {
    if (!(r.price > 0)) issues.push({ table: 'courses', row: i, message: 'Giá gốc phải > 0' });
    if (r.voucher < 0) issues.push({ table: 'courses', row: i, message: 'Voucher không được âm' });
  });
  for (const t of ['periodic', 'special', 'extended'])
    data[t].forEach((r, i) => {
      if (r.pct < 0 || r.pct >= 1) issues.push({ table: t, row: i, message: '% giảm phải trong khoảng 0–100%' });
    });
  return issues;
}
