// Admin tải file Excel mẫu (cùng cấu trúc "CÔNG CỤ TÍNH GIÁ KHUYẾN MẠI.xlsx") để cập nhật hàng loạt.
// Cùng logic với scripts/import_excel.py. SheetJS chỉ được tải khi admin bấm "Nhập từ Excel".

const SHEETJS = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';

function loadSheetJS() {
  if (window.XLSX) return Promise.resolve(window.XLSX);
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SHEETJS;
    s.onload = () => resolve(window.XLSX);
    s.onerror = () => reject(new Error('Không tải được thư viện đọc Excel'));
    document.head.appendChild(s);
  });
}

const num = (v, d = 0) => (v === '' || v == null || Number.isNaN(Number(v)) ? d : Number(v));
const str = (v) => (v == null ? '' : String(v).trim());

/** Trả về bản dữ liệu mới: các bảng lấy từ Excel, phần Cấu hình giữ nguyên của bản hiện tại. */
export async function importWorkbook(file, current) {
  const XLSX = await loadSheetJS();
  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  const rows = (name, n) => {
    const ws = wb.Sheets[name];
    if (!ws) throw new Error(`File thiếu sheet "${name}"`);
    return XLSX.utils
      .sheet_to_json(ws, { header: 1, defval: '' })
      .slice(1)
      .map((r) => Array.from({ length: n }, (_, i) => r[i] ?? ''))
      .filter((r) => str(r[0]) !== '');
  };

  const next = JSON.parse(JSON.stringify(current));
  next.courses = rows('01_DM_KHOA_HOC', 6).map((r) => ({
    label: str(r[0]), code: str(r[1]), name: str(r[2]), mode: str(r[3]), price: num(r[4]), voucher: num(r[5]),
  }));
  next.programVouchers = rows('01B_VOUCHER_CTKM', 5).map((r) => ({
    label: str(r[0]), program: str(r[1]), code: str(r[2]), mode: str(r[3]), voucher: num(r[4]),
  }));
  next.warranty = rows('02_DM_BAO_HANH', 2).map((r) => ({ name: str(r[0]), rate: num(r[1]) }));
  next.periodic = rows('03_CTKM_DINH_KY', 5).map((r) => ({
    label: str(r[0]), from: num(r[1]), to: num(r[2]), pct: num(r[3]), cashback: num(r[4]),
  }));
  next.special = rows('04_CTKM_DAC_BIET', 7).map((r) => ({
    label: str(r[0]), method: str(r[1]), term: num(r[2]), pct: num(r[3]), applyType: str(r[4]), minCourses: num(r[5], 1), note: str(r[6]),
  }));
  // 04B: Nhãn | Nhóm LKT | Format LKT | Mức cắt. File mẫu cũ (3 cột, chưa có nhóm) → gán "LKT Toàn hệ thống".
  const lktSheet = XLSX.utils.sheet_to_json(wb.Sheets['04B_CTKM_LKT'] ?? {}, { header: 1 })[0] ?? [];
  const hasGroup = lktSheet.some((h) => /nhóm/i.test(str(h)));
  next.lkt = hasGroup
    ? rows('04B_CTKM_LKT', 4).map((r) => ({ label: str(r[0]), group: str(r[1]), format: str(r[2]), cut: num(r[3]) }))
    : rows('04B_CTKM_LKT', 3).map((r) => ({ label: str(r[0]), group: 'LKT Toàn hệ thống', format: str(r[1]), cut: num(r[2]) }));
  // Nhóm mới xuất hiện trong file → tự thêm vào cấu hình, đoán chương trình nền từ tên ("LKT Thấp điểm" → Thấp điểm)
  const groups = (next.settings.lktGroups ??= []);
  for (const name of new Set(next.lkt.map((r) => r.group))) {
    if (groups.some((g) => g.name.toLowerCase() === name.toLowerCase())) continue;
    const rest = name.replace(/^LKT\s+/i, '').toLowerCase();
    const base = next.settings.programs.find((p) => p.type !== 'LKT' && p.name.toLowerCase() === rest);
    groups.push({ name, baseProgram: base?.name ?? 'Định kỳ đặc biệt' });
  }
  next.extended = rows('04C_CTKM_MO_RONG', 8).map((r) => ({
    label: str(r[0]), program: str(r[1]), method: str(r[2]), term: num(r[3]), pct: num(r[4]), applyType: str(r[5]),
    minCourses: num(r[6], 1), note: str(r[7]),
  }));
  next.citimeRoutes = rows('05_CITIME_LO_TRINH', 7).map((r) => ({
    label: str(r[0]), group: str(r[1]), count: num(r[2]), code: str(r[3]), name: str(r[4]), status: str(r[5]), maxTerm: num(r[6]),
  }));
  next.gifts = rows('07_QUA_TANG', 6).map((r) => ({
    label: str(r[0]), program: str(r[1]), milestone: num(r[2]), method: str(r[3]), content: str(r[4]), value: num(r[5]),
  }));
  next.routes = rows('08_LO_TRINH', 20).map((r) => {
    const items = [];
    for (let i = 4; i < 20; i += 2) if (str(r[i])) items.push({ code: str(r[i]), mode: str(r[i + 1]) });
    return { label: str(r[0]), output: str(r[1]), code: str(r[2]), name: str(r[3]), items };
  });
  const citimeTerms = wb.Sheets['06_DM_KY_HAN_CITIME'] ? rows('06_DM_KY_HAN_CITIME', 1).map((r) => num(r[0])) : null;
  if (citimeTerms?.length) next.settings.paymentMethods.filter((m) => m.citime).forEach((m) => (m.terms = citimeTerms));
  return next;
}
