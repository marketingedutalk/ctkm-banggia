// Khai báo các bảng dữ liệu gốc admin được sửa — mỗi bảng ứng với 1 sheet trong file Excel cũ.
// Thêm cột / bảng mới chỉ cần sửa ở đây, UI tự sinh form.

const uniq = (arr) => [...new Set(arr.filter((v) => v !== '' && v != null))];
const MODES = ['Online', 'Offline'];

export function tableDefs(d) {
  const s = d.settings;
  const labels = s.labels.map((l) => l.name);
  const programs = s.programs.map((p) => p.name);
  const extPrograms = s.programs.filter((p) => p.type === 'MO_RONG').map((p) => p.name);
  const methods = s.paymentMethods.map((m) => m.name);
  const giftGroups = uniq(s.paymentMethods.map((m) => m.giftGroup));
  const codes = s.courseCodes.map((c) => c.code);
  const lktGroups = (s.lktGroups ?? []).map((g) => g.name);
  const basePrograms = s.programs.filter((p) => p.type !== 'LKT').map((p) => p.name);

  return [
    // ---- Danh mục ----
    {
      id: 'courses', group: 'Danh mục', icon: 'book', sheet: '01_DM_KHOA_HOC', title: 'Khóa học & giá gốc', path: ['courses'],
      desc: 'Giá gốc và voucher đặc biệt của từng khóa theo nhãn + hình thức học. Mỗi bộ Nhãn + Mã khóa + Hình thức chỉ 1 dòng.',
      byLabel: true,
      columns: [
        { key: 'label', label: 'Nhãn', type: 'select', options: labels },
        { key: 'code', label: 'Mã khóa', type: 'select', options: codes },
        { key: 'name', label: 'Tên khóa', type: 'text', wide: true },
        { key: 'mode', label: 'Hình thức', type: 'select', options: MODES },
        { key: 'price', label: 'Giá gốc', type: 'money' },
        { key: 'voucher', label: 'Voucher đặc biệt', type: 'money' },
      ],
      blank: (label) => ({ label, code: codes[0], name: '', mode: 'Online', price: 0, voucher: 0 }),
    },
    {
      id: 'warranty', group: 'Danh mục', icon: 'shield', sheet: '02_DM_BAO_HANH', title: 'Gói bảo hành', path: ['warranty'],
      desc: 'Phí bảo hành = Giá tính bảo hành × Tỷ lệ. Giá tính bảo hành không gồm các khóa bỏ tick "Tính BH" ở mục Mã khóa.',
      columns: [
        { key: 'name', label: 'Gói bảo hành', type: 'text' },
        { key: 'rate', label: 'Tỷ lệ (%)', type: 'pct' },
      ],
      blank: () => ({ name: '', rate: 0 }),
    },
    {
      id: 'routes', group: 'Danh mục', icon: 'route', sheet: '08_LO_TRINH', title: 'Lộ trình gợi ý', path: ['routes'],
      desc: 'Dùng cho Bảng giá lộ trình và nút "Chọn theo lộ trình". Cột Khóa học ghi dạng: IE6.5(M1)/Offline + BT5.5/Online',
      byLabel: true,
      columns: [
        { key: 'label', label: 'Nhãn', type: 'select', options: labels },
        { key: 'output', label: 'Đầu ra', type: 'text' },
        { key: 'code', label: 'Mã lộ trình', type: 'text' },
        { key: 'name', label: 'Tên lộ trình', type: 'text', wide: true },
        { key: 'items', label: 'Khóa học / Hình thức', type: 'items', wide: true },
      ],
      blank: (label) => ({ label, output: '', code: '', name: '', items: [] }),
    },

    // ---- Chương trình khuyến mại ----
    {
      id: 'periodic', group: 'Chương trình KM', icon: 'percent', sheet: '03_CTKM_DINH_KY', title: 'CTKM định kỳ', path: ['periodic'],
      desc: 'Chương trình "Định kỳ": % giảm và hoàn tiền theo số khóa đăng ký (từ – đến).',
      byLabel: true,
      columns: [
        { key: 'label', label: 'Nhãn', type: 'select', options: labels },
        { key: 'from', label: 'Số khóa từ', type: 'int' },
        { key: 'to', label: 'Số khóa đến', type: 'int' },
        { key: 'pct', label: '% giảm', type: 'pct' },
        { key: 'cashback', label: 'Hoàn tiền', type: 'money' },
      ],
      blank: (label) => ({ label, from: 1, to: 1, pct: 0, cashback: 0 }),
    },
    {
      id: 'special', group: 'Chương trình KM', icon: 'card', sheet: '04_CTKM_DAC_BIET', title: 'CTKM đặc biệt', path: ['special'],
      desc: 'Chương trình "Định kỳ đặc biệt" (và nền cho Liên kết trường): % giảm theo hình thức thanh toán + kỳ hạn. Full/Giai đoạn để kỳ hạn = 0.',
      byLabel: true,
      columns: [
        { key: 'label', label: 'Nhãn', type: 'select', options: labels },
        { key: 'method', label: 'Hình thức TT', type: 'select', options: methods },
        { key: 'term', label: 'Kỳ hạn', type: 'int' },
        { key: 'pct', label: '% giảm', type: 'pct' },
        { key: 'applyType', label: 'Loại áp dụng', type: 'select', options: ['TOAN_BO', 'COMBO', 'LO_TRINH_CU_THE'] },
        { key: 'minCourses', label: 'Số khóa tối thiểu', type: 'int' },
        { key: 'note', label: 'Ghi chú', type: 'text' },
      ],
      blank: (label) => ({ label, method: methods[0], term: 0, pct: 0, applyType: 'COMBO', minCourses: 2, note: '' }),
    },
    {
      id: 'lkt', group: 'Chương trình KM', icon: 'school', sheet: '04B_CTKM_LKT', title: 'Format liên kết trường', path: ['lkt'],
      desc: 'Chương trình "Liên kết trường": % giảm = % của chương trình nền (theo Nhóm LKT) − Mức cắt. Nhãn không có dòng cho nhóm → sale thấy "KHÔNG TÌM THẤY CHÍNH SÁCH LKT".',
      byLabel: true,
      columns: [
        { key: 'label', label: 'Nhãn', type: 'select', options: labels },
        { key: 'group', label: 'Nhóm LKT', type: 'select', options: lktGroups },
        { key: 'format', label: 'Format LKT', type: 'text' },
        { key: 'cut', label: 'Mức cắt (%)', type: 'pct' },
      ],
      blank: (label) => ({ label, group: lktGroups[0] ?? '', format: '', cut: 0 }),
    },
    {
      id: 'extended', group: 'Chương trình KM', icon: 'sparkle', sheet: '04C_CTKM_MO_RONG', title: 'CTKM mở rộng', path: ['extended'],
      desc: 'Các chương trình loại "Mở rộng" (Thấp điểm, Văn phòng mới, Vũ Đài Trí Tuệ...). Không có dòng khớp → sale thấy "KHÔNG ÁP DỤNG CHƯƠNG TRÌNH".',
      byLabel: true,
      columns: [
        { key: 'label', label: 'Nhãn', type: 'select', options: labels },
        { key: 'program', label: 'Chương trình', type: 'select', options: extPrograms },
        { key: 'method', label: 'Hình thức TT', type: 'select', options: methods },
        { key: 'term', label: 'Kỳ hạn', type: 'int' },
        { key: 'pct', label: '% giảm', type: 'pct' },
        { key: 'applyType', label: 'Loại áp dụng', type: 'select', options: ['TOAN_BO', 'COMBO', 'LO_TRINH_CU_THE'] },
        { key: 'minCourses', label: 'Số khóa tối thiểu', type: 'int' },
        { key: 'note', label: 'Ghi chú', type: 'text' },
      ],
      blank: (label) => ({ label, program: extPrograms[0] ?? '', method: methods[0], term: 0, pct: 0, applyType: 'COMBO', minCourses: 2, note: '' }),
    },
    {
      id: 'programVouchers', group: 'Chương trình KM', icon: 'tag', sheet: '01B_VOUCHER_CTKM', title: 'Voucher theo CTKM', path: ['programVouchers'],
      desc: 'Voucher riêng của chương trình mở rộng, thay cho voucher đặc biệt ở danh mục khóa học. Không có dòng → dùng voucher danh mục.',
      byLabel: true,
      columns: [
        { key: 'label', label: 'Nhãn', type: 'select', options: labels },
        { key: 'program', label: 'Chương trình', type: 'select', options: extPrograms },
        { key: 'code', label: 'Mã khóa', type: 'select', options: codes },
        { key: 'mode', label: 'Hình thức', type: 'select', options: MODES },
        { key: 'voucher', label: 'Voucher', type: 'money' },
      ],
      blank: (label) => ({ label, program: extPrograms[0] ?? '', code: codes[0], mode: 'Online', voucher: 0 }),
    },
    {
      id: 'gifts', group: 'Chương trình KM', icon: 'gift', sheet: '07_QUA_TANG', title: 'Quà tặng', path: ['gifts'],
      desc: 'Quà theo số khóa (mốc). Đăng ký nhiều khóa hơn mốc cao nhất → lấy quà của mốc cao nhất. Cột "Nhóm HTTT" khớp với "Nhóm quà" của hình thức thanh toán.',
      byLabel: true,
      columns: [
        { key: 'label', label: 'Nhãn', type: 'select', options: labels },
        { key: 'program', label: 'Chương trình', type: 'select', options: programs },
        { key: 'milestone', label: 'Mốc khóa', type: 'int' },
        { key: 'method', label: 'Nhóm HTTT', type: 'select', options: giftGroups },
        { key: 'content', label: 'Nội dung quà', type: 'text', wide: true },
        { key: 'value', label: 'Giá trị', type: 'money' },
      ],
      blank: (label) => ({ label, program: programs[0], milestone: 1, method: giftGroups[0], content: '', value: 0 }),
    },
    {
      id: 'citimeRoutes', group: 'Chương trình KM', icon: 'wallet', sheet: '05_CITIME_LO_TRINH', title: 'Lộ trình Citime', path: ['citimeRoutes'],
      desc: 'Combo nào được trả góp Citime và kỳ hạn tối đa. Mã lộ trình = mã rút gọn các khóa nối bằng "_" theo thứ tự chuẩn (VD BS_PRE_IE45).',
      byLabel: true,
      columns: [
        { key: 'label', label: 'Nhãn', type: 'select', options: labels },
        { key: 'group', label: 'Nhóm lộ trình', type: 'text' },
        { key: 'count', label: 'Số khóa', type: 'int' },
        { key: 'code', label: 'Mã lộ trình', type: 'text' },
        { key: 'name', label: 'Tên lộ trình', type: 'text', wide: true },
        { key: 'status', label: 'Trạng thái', type: 'select', options: ['Áp dụng', 'Không áp dụng'] },
        { key: 'maxTerm', label: 'Kỳ hạn tối đa', type: 'int' },
      ],
      blank: (label) => ({ label, group: '', count: 2, code: '', name: '', status: 'Áp dụng', maxTerm: 0 }),
    },

    // ---- Cấu hình ----
    {
      id: 'programs', group: 'Cấu hình', icon: 'layers', title: 'Danh sách chương trình', path: ['settings', 'programs'],
      desc: 'Loại quyết định cách tính: DINH_KY (theo số khóa), DAC_BIET (theo HTTT + kỳ hạn), LKT (đặc biệt − mức cắt), MO_RONG (bảng CTKM mở rộng + voucher riêng).',
      columns: [
        { key: 'name', label: 'Tên chương trình', type: 'text', wide: true },
        { key: 'type', label: 'Loại', type: 'select', options: ['DINH_KY', 'DAC_BIET', 'LKT', 'MO_RONG'] },
      ],
      blank: () => ({ name: '', type: 'MO_RONG' }),
    },
    {
      id: 'lktGroups', group: 'Cấu hình', icon: 'school', title: 'Nhóm LKT', path: ['settings', 'lktGroups'],
      desc: 'Mỗi nhóm LKT lấy % giảm và voucher từ 1 chương trình nền, VD "LKT Thấp điểm" → Thấp điểm, "LKT Toàn hệ thống" → Định kỳ đặc biệt.',
      columns: [
        { key: 'name', label: 'Nhóm LKT', type: 'text', wide: true },
        { key: 'baseProgram', label: 'Chương trình nền', type: 'select', options: basePrograms },
      ],
      blank: () => ({ name: '', baseProgram: basePrograms[0] ?? '' }),
    },
    {
      id: 'paymentMethods', group: 'Cấu hình', icon: 'card', title: 'Hình thức thanh toán', path: ['settings', 'paymentMethods'],
      desc: 'Kỳ hạn hợp lệ ghi cách nhau dấu phẩy (0 = không kỳ hạn). "Citime" = kiểm tra lộ trình Citime + kỳ hạn tối đa. "Cho khóa lẻ" = được đăng ký 1 khóa.',
      columns: [
        { key: 'name', label: 'Tên', type: 'text' },
        { key: 'terms', label: 'Kỳ hạn hợp lệ', type: 'numlist' },
        { key: 'giftGroup', label: 'Nhóm quà', type: 'text' },
        { key: 'citime', label: 'Citime', type: 'bool' },
        { key: 'allowSingle', label: 'Cho khóa lẻ', type: 'bool' },
      ],
      blank: () => ({ name: '', terms: [0], giftGroup: '', citime: false, allowSingle: false }),
    },
    {
      id: 'labels', group: 'Cấu hình', icon: 'tag', title: 'Nhãn & giới hạn', path: ['settings', 'labels'],
      desc: 'HTTT bị chặn ghi cách nhau dấu phẩy, VD CLASSUP 1-1 không áp dụng Sacombank, Citime.',
      columns: [
        { key: 'name', label: 'Nhãn', type: 'text' },
        { key: 'blockedMethods', label: 'HTTT không áp dụng', type: 'strlist', wide: true },
      ],
      blank: () => ({ name: '', blockedMethods: [] }),
    },
    {
      id: 'courseCodes', group: 'Cấu hình', icon: 'sheet', title: 'Mã khóa & bảo hành', path: ['settings', 'courseCodes'],
      desc: 'Thứ tự + mã rút gọn dùng để ghép mã lộ trình Citime. Bỏ tick "Tính BH" với khóa không tính vào giá bảo hành (Module A, Module B, BT5.5).',
      columns: [
        { key: 'order', label: 'Thứ tự', type: 'int' },
        { key: 'code', label: 'Mã khóa', type: 'text' },
        { key: 'short', label: 'Mã rút gọn', type: 'text' },
        { key: 'warranty', label: 'Tính BH', type: 'bool' },
      ],
      blank: () => ({ order: 99, code: '', short: '', warranty: true }),
    },
  ];
}

// ---- Định dạng / phân tích giá trị ô ----
export function formatCell(col, v) {
  switch (col.type) {
    case 'money':
      return v === '' || v == null ? '' : Number(v).toLocaleString('vi-VN');
    case 'pct':
      return v === '' || v == null ? '' : String(+(Number(v) * 100).toFixed(4));
    case 'numlist':
    case 'strlist':
      return (v ?? []).join(', ');
    case 'items':
      return (v ?? []).map((i) => `${i.code}/${i.mode}`).join(' + ');
    default:
      return v ?? '';
  }
}

export function parseCell(col, raw) {
  const s = String(raw ?? '').trim();
  switch (col.type) {
    case 'money': {
      const n = Number(s.replace(/[^\d-]/g, ''));
      return Number.isFinite(n) ? n : 0;
    }
    case 'pct': {
      const n = Number(s.replace(',', '.').replace('%', ''));
      return Number.isFinite(n) ? +(n / 100).toFixed(6) : 0;
    }
    case 'int': {
      const n = Number(s.replace(',', '.'));
      return Number.isFinite(n) ? n : 0;
    }
    case 'numlist':
      return s.split(/[,;\s]+/).filter(Boolean).map(Number).filter(Number.isFinite);
    case 'strlist':
      return s.split(',').map((x) => x.trim()).filter(Boolean);
    case 'items':
      return s
        .split('+')
        .map((x) => x.trim())
        .filter(Boolean)
        .map((x) => {
          const k = x.lastIndexOf('/');
          return k > 0 ? { code: x.slice(0, k).trim(), mode: x.slice(k + 1).trim() } : { code: x, mode: 'Online' };
        });
    default:
      return s;
  }
}
