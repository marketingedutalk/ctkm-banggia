// Giao diện công cụ tính giá KM. Nhúng vào portal bằng:
//   mountPromoTool(element, { role: 'admin' | 'sale', store, user })
import {
  quote, routeTable, coursesForLabel, termsFor, isFixedTerm, findProgram, findMethod, validateData,
  normalizeData, lktGroupsFor, lktFormatsFor,
} from '../engine/pricing.js';
import { icon } from './icons.js';
import { tableDefs, formatCell, parseCell } from './admin-tables.js';
import { importWorkbook } from './excel-import.js';
import { buildPromoDoc, defaultTitle, outputsFor, SECTIONS, scenariosFor, defaultScenarios } from '../doc/promo-doc.js';
import { monthOfDoc } from '../store.js';

const clone = (o) => JSON.parse(JSON.stringify(o));
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const vnd = (n) => `${Math.round(Number(n) || 0).toLocaleString('vi-VN')}đ`;
const pct = (n) => `${+(Number(n || 0) * 100).toFixed(2)}%`;
const fmtDate = (s) => (s ? s.split('-').reverse().join('/') : '');
const eq = (a, b) => String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase();
const thisMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};
const monthText = (m) => {
  const [y, mm] = String(m).split('-');
  return `Tháng ${Number(mm)}/${y}`;
};
// Ngày đầu / cuối tháng 'YYYY-MM'
const monthBounds = (m) => {
  const [y, mm] = m.split('-').map(Number);
  return [`${m}-01`, `${m}-${String(new Date(y, mm, 0).getDate()).padStart(2, '0')}`];
};

export async function mountPromoTool(root, opts = {}) {
  // preview: bản xem thử (VD trang chia sẻ để duyệt) — môi trường không có hộp thoại in / xác nhận / tải file
  const { store, allowRoleSwitch = false, user = null, preview = false } = opts;
  const ask = (msg) => (preview ? true : confirm(msg));
  // Dữ liệu lưu theo tháng: sale xem tháng hiện tại (trống nếu admin chưa tạo), admin sửa từng tháng, PDF chọn tháng + năm
  const docs = new Map();
  async function getDoc(m) {
    if (!docs.has(m)) {
      const d = await store.load(m);
      docs.set(m, d ? normalizeData(d) : null);
    }
    return docs.get(m);
  }
  const S = {
    role: opts.role === 'admin' ? 'admin' : 'sale',
    view: 'calc',
    months: await store.listMonths(),
    month: thisMonth(),
    data: null,
    calc: null,
    table: null,
    pdf: null,
    admin: { tab: 'courses', label: '', q: '', draft: null, dirty: false, issues: [], month: '', newMonth: '', copyFrom: '' },
  };
  S.data = await getDoc(S.month);
  S.admin.month = S.months.includes(S.month) ? S.month : (S.months[0] ?? S.month);
  await getDoc(S.admin.month);
  const resetViews = () => {
    S.calc = defaultCalc(S.data);
    S.table = { ...defaultCalc(S.data), output: '' };
  };
  resetViews();
  S.pdf = { ...defaultCalc(S.data), month: S.month, title: '', sections: SECTIONS.map((x) => x.id), outputs: [], scenarios: [] };

  root.classList.add('pt-root');
  root.innerHTML = '';
  const band = document.createElement('div');
  const body = document.createElement('div');
  body.className = 'pt-body';
  root.append(band, body);

  // ---------------------------------------------------------------- Render
  function render() {
    const tabs = [
      ['calc', 'calc', 'Tính giá'],
      ['table', 'table', 'Bảng giá lộ trình'],
      ['pdf', 'download', 'Xuất PDF'],
      ...(S.role === 'admin' ? [['admin', 'db', 'Quản trị dữ liệu gốc']] : []),
    ];
    if (S.view === 'admin' && S.role !== 'admin') S.view = 'calc';
    band.className = 'pt-band';
    band.innerHTML =
      tabs
        .map(([v, ic, t]) => `<button class="pt-tab ${S.view === v ? 'is-active' : ''}" data-act="view" data-v="${v}">${icon(ic)}${t}</button>`)
        .join('') +
      `<span class="pt-band-spacer"></span>` +
      (allowRoleSwitch
        ? `<div class="pt-role" title="Chỉ có ở bản demo — trên portal vai trò lấy từ tài khoản đăng nhập">
            <button class="${S.role === 'sale' ? 'is-active' : ''}" data-act="role" data-v="sale">Sale / TVV</button>
            <button class="${S.role === 'admin' ? 'is-active' : ''}" data-act="role" data-v="admin">Admin</button></div>`
        : '');
    body.innerHTML = `<div class="pt-container">${
      S.view === 'pdf' ? viewPdf() : S.view === 'admin' ? viewAdmin() : !S.data ? viewEmptyMonth() : S.view === 'calc' ? viewCalc() : viewTable()
    }</div>`;
    if (S.view === 'admin') renderAdminTable();
    if (S.view === 'pdf') loadPdfPreview();
  }

  // ---------------------------------------------------------------- Tính giá (sale)
  function defaultCalc(d) {
    if (!d) return { label: '', program: '', method: '', term: 0, warranty: '', lktGroup: '', lktFormat: '', selected: {} };
    const label = d.settings.labels[0]?.name ?? '';
    return {
      label,
      program: d.settings.programs[0]?.name ?? '',
      method: d.settings.paymentMethods[0]?.name ?? '',
      term: 0,
      warranty: d.warranty[0]?.name ?? '',
      lktGroup: '',
      lktFormat: '',
      selected: {},
    };
  }

  const calcInput = (c) => ({
    ...c,
    items: S.data.settings.courseCodes
      .slice()
      .sort((a, b) => a.order - b.order)
      .filter((cc) => c.selected[cc.code])
      .map((cc) => ({ code: cc.code, mode: c.selected[cc.code] })),
  });

  function head({ ic, title, sub, actions = '', stats = '' }) {
    return `<div class="pt-page-head">
      <div class="pt-title-row">
        <div class="pt-title-icon">${icon(ic, 20)}</div>
        <div><h2 class="pt-title">${title}</h2><p class="pt-sub">${sub}</p></div>
        <div class="pt-title-actions">${actions}</div>
      </div>
      ${stats ? `<div class="pt-stats">${stats}</div>` : ''}
    </div>`;
  }

  const stat = (variant, label, value, ic, small = false) =>
    `<div class="pt-stat pt-stat--${variant}"><div style="min-width:0"><div class="pt-stat-label">${label}</div>
      <div class="pt-stat-value ${small ? 'is-small' : ''}">${value}</div></div><div class="pt-stat-icon">${icon(ic)}</div></div>`;

  const chips = (field, options, current, { disabled = () => false, hint = () => '', fmt = (o) => o } = {}) =>
    `<div class="pt-chips">${options
      .map((o) => {
        const dis = disabled(o);
        const h = hint(o);
        return `<button class="pt-chip ${eq(o, current) ? 'is-active' : ''}" data-act="calc" data-f="${field}" data-v="${esc(o)}" ${dis ? 'disabled' : ''}
          ${dis && typeof dis === 'string' ? `title="${esc(dis)}"` : ''}>${esc(fmt(o))}${h ? ` <small>${esc(h)}</small>` : ''}</button>`;
      })
      .join('')}</div>`;

  // Chọn tháng xem (sale): các tháng đã có chương trình + tháng hiện tại
  function monthPicker() {
    const list = [...new Set([thisMonth(), ...S.months])].sort().reverse();
    return `<select class="pt-select" style="height:36px;width:150px" data-act="view-month" title="Tháng chương trình">${list
      .map((m) => `<option value="${m}" ${m === S.month ? 'selected' : ''}>${monthText(m)}${S.months.includes(m) ? '' : ' (trống)'}</option>`)
      .join('')}</select>`;
  }

  function viewEmptyMonth() {
    return (
      head({ ic: 'calendar', title: `Chương trình khuyến mại ${monthText(S.month).toLowerCase()}`, sub: 'Chưa có dữ liệu', actions: monthPicker() }) +
      `<div class="pt-section"><div class="pt-empty" style="padding:56px 24px">
        <div style="font-size:16px;font-weight:600;color:var(--pt-ink);margin-bottom:6px">Chưa có chương trình khuyến mại ${monthText(S.month).toLowerCase()}</div>
        Admin chưa cập nhật chương trình cho tháng này. Bạn có thể chọn xem lại các tháng trước ở ô chọn tháng phía trên.
        ${S.role === 'admin' ? `<div style="margin-top:16px"><button class="pt-btn pt-btn--primary" data-act="goto-create" data-v="${S.month}">${icon('plus', 16)}Tạo chương trình ${monthText(S.month).toLowerCase()}</button></div>` : ''}
      </div></div>`
    );
  }

  function viewCalc() {
    const d = S.data;
    const c = S.calc;
    const q = quote(d, calcInput(c));
    const s = d.settings;
    const prog = findProgram(d, c.program);
    const labelCfg = s.labels.find((l) => eq(l.name, c.label));
    const terms = termsFor(d, c.method);
    const fixed = isFixedTerm(d, c.method);
    const pm = findMethod(d, c.method);
    const totalOff = q.discountAmt + q.cashback + q.voucherTotal;
    const courses = coursesForLabel(d, c.label);
    const routes = d.routes.filter((r) => eq(r.label, c.label));

    const stats =
      stat('grey', 'Tổng giá gốc', vnd(q.gross), 'tag') +
      stat('white', `Tổng ưu đãi ${q.pct ? `(${pct(q.pct)})` : ''}`, totalOff ? `-${vnd(totalOff)}` : '0đ', 'percent') +
      stat(q.ok ? 'green' : 'purple', 'Học phí cuối cùng', q.count ? vnd(q.final) : '—', 'wallet') +
      stat(q.ok ? 'green' : 'red', 'Trạng thái', q.ok ? 'Hợp lệ' : esc(q.status), q.ok ? 'checkCircle' : 'alert', !q.ok);

    const form = `<div class="pt-form">
      <div class="pt-form-row"><div class="pt-label">Nhãn</div>${chips('label', s.labels.map((l) => l.name), c.label)}</div>
      <div class="pt-form-row"><div class="pt-label">Chương trình</div>${chips('program', s.programs.map((p) => p.name), c.program)}</div>
      ${prog?.type === 'LKT'
        ? `<div class="pt-form-row"><div class="pt-label">Nhóm LKT<small>${
            q.lkt?.baseProgram ? `Theo chương trình ${esc(q.lkt.baseProgram)}` : ''}</small></div>${
            lktGroupsFor(d, c.label).length
              ? chips('lktGroup', lktGroupsFor(d, c.label).map((g) => g.name), c.lktGroup)
              : '<span class="pt-section-sub">Nhãn này chưa có chính sách liên kết trường</span>'}</div>
          ${c.lktGroup
            ? `<div class="pt-form-row"><div class="pt-label">Format LKT</div>${chips(
                'lktFormat', lktFormatsFor(d, c.label, c.lktGroup).map((r) => r.format), c.lktFormat,
                {
                  hint: (f) => {
                    const cut = lktFormatsFor(d, c.label, c.lktGroup).find((r) => eq(r.format, f))?.cut;
                    return cut ? `-${pct(cut)}` : '';
                  },
                },
              )}</div>`
            : ''}`
        : ''}
      <div class="pt-form-row"><div class="pt-label">Hình thức thanh toán</div>${chips(
        'method', s.paymentMethods.map((m) => m.name), c.method,
        { disabled: (m) => (labelCfg?.blockedMethods?.some((b) => eq(b, m)) ? `${c.label} không áp dụng ${m}` : false) },
      )}</div>
      <div class="pt-form-row"><div class="pt-label">Kỳ hạn<small>${pm?.citime && q.combo.citimeMax ? `Tối đa ${q.combo.citimeMax} tháng` : ''}</small></div>${
        fixed
          ? '<div class="pt-chips"><span class="pt-chip is-active">Không kỳ hạn</span></div>'
          : chips('term', terms.map(String), String(c.term), {
              fmt: (t) => `${t} tháng`,
              disabled: (t) => (pm?.citime && q.combo.citimeMax != null && Number(t) > q.combo.citimeMax ? 'Vượt kỳ hạn Citime tối đa của lộ trình' : false),
            })
      }</div>
      <div class="pt-form-row"><div class="pt-label">Gói bảo hành</div>${chips('warranty', d.warranty.map((w) => w.name), c.warranty, {
        hint: (w) => {
          const r = d.warranty.find((x) => eq(x.name, w))?.rate;
          return r ? `+${pct(r)}` : '';
        },
      })}</div>
    </div>`;

    const courseCards = courses
      .map((cc) => {
        const on = !!c.selected[cc.code];
        const mode = c.selected[cc.code] ?? cc.modes[0];
        // Tính qua engine để voucher theo đúng CTKM đang chọn (VD Văn phòng mới dùng voucher riêng)
        const row = quote(d, { ...c, items: [{ code: cc.code, mode }] }).lines[0];
        return `<div class="pt-course ${on ? 'is-on' : ''}" data-act="toggle" data-code="${esc(cc.code)}" role="checkbox" aria-checked="${on}" tabindex="0">
          <div class="pt-course-top"><span class="pt-check">${on ? icon('check', 14) : ''}</span>
            <div style="min-width:0"><div class="pt-course-name">${esc(cc.name)}</div><div class="pt-course-code">${esc(cc.code)}</div></div></div>
          ${cc.modes.length > 1
            ? `<div class="pt-seg">${cc.modes
                .map((m) => `<button class="${eq(m, mode) ? 'is-active' : ''}" data-act="mode" data-code="${esc(cc.code)}" data-v="${esc(m)}">${esc(m)}</button>`)
                .join('')}</div>`
            : `<span class="pt-seg-single">${esc(cc.modes[0])}</span>`}
          <div class="pt-course-price"><span>Giá gốc <b>${vnd(row?.price)}</b></span>${row?.voucher ? `<span>VC -${vnd(row.voucher)}</span>` : ''}</div>
        </div>`;
      })
      .join('');

    const lines = q.lines
      .map((l) => `<tr><td>${esc(l.name)} <span style="color:var(--pt-faint)">· ${esc(l.mode)}</span></td><td>${vnd(l.price)}</td></tr>`)
      .join('');

    const result = `<div class="pt-section pt-result">
      <div class="pt-section-head"><div class="pt-section-icon">${icon('calc', 16)}</div>
        <div><div class="pt-section-title">Kết quả báo giá</div><div class="pt-section-sub">${q.count} khóa · ${esc(c.program)} · ${esc(c.method)}${c.term ? ` ${c.term} tháng` : ''}</div></div></div>
      <div class="pt-section-body">
        <div class="pt-status ${q.ok ? 'is-ok' : 'is-bad'}">${icon(q.ok ? 'checkCircle' : 'alert', 16)}${q.ok ? 'Báo giá hợp lệ' : esc(q.status)}</div>
        ${lines ? `<table class="pt-lines">${lines}</table>` : ''}
        <ul class="pt-rows">
          <li><span>Tổng giá gốc</span><b>${vnd(q.gross)}</b></li>
          <li class="is-minus"><span>Ưu đãi ${pct(q.pct)}${q.lkt?.cut != null && q.lkt.baseFound
            ? `<br><small style="color:var(--pt-faint)">${esc(q.lkt.baseProgram)} ${pct(q.lkt.basePct)} − cắt ${esc(c.lktFormat)} ${pct(q.lkt.cut)}</small>`
            : ''}</span><b>-${vnd(q.discountAmt)}</b></li>
          ${q.cashback ? `<li class="is-minus"><span>Hoàn tiền (Định kỳ)</span><b>-${vnd(q.cashback)}</b></li>` : ''}
          <li class="is-minus"><span>Voucher đặc biệt</span><b>-${vnd(q.voucherTotal)}</b></li>
          <li><span>Giá sau khuyến mại</span><b>${vnd(q.afterPromo)}</b></li>
          <li class="is-plus"><span>Bảo hành ${esc(c.warranty)} (${pct(q.warrantyRate)} × ${vnd(q.warrantyBase)})</span><b>+${vnd(q.warrantyFee)}</b></li>
        </ul>
        <div class="pt-final ${q.ok ? '' : 'is-dim'}"><small>HỌC PHÍ CUỐI CÙNG</small><div>${q.count ? vnd(q.final) : '—'}</div></div>
        ${q.gift ? `<div class="pt-gift">${icon('gift', 18)}<div><b>Quà tặng:</b> ${esc(q.gift.content)}</div></div>` : ''}
        ${q.combo.code
          ? `<div class="pt-combo">Mã lộ trình: <b>${esc(q.combo.code)}</b>${q.combo.routeName ? ` · ${esc(q.combo.group)}` : ''}<br>
             Citime: <b>${esc(q.combo.citimeStatus)}</b>${q.combo.citimeMax ? ` · tối đa ${q.combo.citimeMax} tháng` : ''}</div>`
          : ''}
        <div style="display:flex;gap:8px;margin-top:14px">
          <button class="pt-btn pt-btn--primary" style="flex:1;justify-content:center" data-act="copy" ${q.count ? '' : 'disabled'}>${icon('copy', 16)}Sao chép báo giá</button>
          <button class="pt-btn pt-btn--ghost" data-act="reset-calc" title="Làm mới">${icon('refresh', 16)}</button>
        </div>
      </div></div>`;

    return (
      head({
        ic: 'calc',
        title: 'Tính giá khuyến mại',
        actions: monthPicker(),
        sub: `${esc(s.campaignName)} · Áp dụng ${fmtDate(s.validFrom)} – ${fmtDate(s.validTo)}`,
        stats,
      }) +
      `<div class="pt-grid pt-grid-calc" style="margin-top:14px">
        <div>
          <div class="pt-section" style="margin-top:0">
            <div class="pt-section-head"><div class="pt-section-icon">${icon('filter', 16)}</div>
              <div><div class="pt-section-title">Thông tin chung</div><div class="pt-section-sub">Bấm chọn — kết quả tự cập nhật</div></div></div>
            <div class="pt-section-body">${form}</div>
          </div>
          <div class="pt-section">
            <div class="pt-section-head"><div class="pt-section-icon">${icon('book', 16)}</div>
              <div><div class="pt-section-title">Khóa học đăng ký</div><div class="pt-section-sub">Tích chọn khóa và hình thức học · ${esc(s.note ?? '')}</div></div>
              <div class="pt-section-actions">
                <select class="pt-select" style="height:34px;max-width:260px" data-act="pick-route">
                  <option value="">Chọn nhanh theo lộ trình…</option>
                  ${routes.map((r) => `<option value="${esc(r.code)}">${esc(r.output ? `[${r.output}] ` : '')}${esc(r.name)}</option>`).join('')}
                </select>
                <button class="pt-btn pt-btn--link" data-act="clear-courses">Bỏ chọn</button>
              </div></div>
            <div class="pt-section-body"><div class="pt-courses">${courseCards || '<div class="pt-empty">Nhãn này chưa có khóa học</div>'}</div></div>
          </div>
        </div>
        ${result}
      </div>`
    );
  }

  function setCalc(c, field, value, d = S.data) {
    if (field === 'term') value = Number(value);
    c[field] = value;
    if (field === 'label') {
      const avail = coursesForLabel(d, value);
      for (const code of Object.keys(c.selected)) {
        const cc = avail.find((a) => eq(a.code, code));
        if (!cc) delete c.selected[code];
        else if (!cc.modes.some((m) => eq(m, c.selected[code]))) c.selected[code] = cc.modes[0];
      }
      const blocked = d.settings.labels.find((l) => eq(l.name, value))?.blockedMethods ?? [];
      if (blocked.some((b) => eq(b, c.method)))
        c.method = d.settings.paymentMethods.find((m) => !blocked.some((b) => eq(b, m.name)))?.name ?? '';
    }
    if (field === 'method' || field === 'label') {
      const terms = termsFor(d, c.method).map(Number);
      if (!terms.includes(Number(c.term))) c.term = terms[0] ?? 0;
    }
    // Giữ Nhóm/Format LKT hợp lệ với nhãn đang chọn; mặc định lấy nhóm/format đầu tiên
    if (['label', 'program', 'lktGroup'].includes(field) && findProgram(d, c.program)?.type === 'LKT') {
      const groups = lktGroupsFor(d, c.label);
      if (!groups.some((g) => eq(g.name, c.lktGroup))) c.lktGroup = groups[0]?.name ?? '';
      const formats = lktFormatsFor(d, c.label, c.lktGroup);
      if (!formats.some((r) => eq(r.format, c.lktFormat))) c.lktFormat = formats[0]?.format ?? '';
    }
  }

  function quoteText() {
    const c = S.calc;
    const q = quote(S.data, calcInput(c));
    const L = [
      `BÁO GIÁ HỌC PHÍ – ${c.label.toUpperCase()}`,
      `Chương trình: ${c.program}${findProgram(S.data, c.program)?.type === 'LKT' ? ` (${[c.lktGroup, c.lktFormat].filter(Boolean).join(' – ')})` : ''}`,
      `Thanh toán: ${c.method}${c.term ? ` – ${c.term} tháng` : ''}`,
      'Khóa học:',
      ...q.lines.map((l) => `  • ${l.name} (${l.mode}): ${vnd(l.price)}`),
      `Tổng giá gốc: ${vnd(q.gross)}`,
      `Ưu đãi ${pct(q.pct)}: -${vnd(q.discountAmt)}`,
      ...(q.cashback ? [`Hoàn tiền: -${vnd(q.cashback)}`] : []),
      ...(q.voucherTotal ? [`Voucher: -${vnd(q.voucherTotal)}`] : []),
      ...(q.warrantyFee ? [`Bảo hành ${c.warranty}: +${vnd(q.warrantyFee)}`] : []),
      `HỌC PHÍ CUỐI CÙNG: ${vnd(q.final)}`,
      ...(q.gift ? [`Quà tặng: ${q.gift.content}`] : []),
      `(${S.data.settings.campaignName}, áp dụng đến ${fmtDate(S.data.settings.validTo)})`,
    ];
    if (!q.ok) L.unshift(`⚠ CHƯA HỢP LỆ: ${q.status}`);
    return L.join('\n');
  }

  // ---------------------------------------------------------------- Bảng giá lộ trình
  function viewTable() {
    const d = S.data;
    const t = S.table;
    const outputs = [...new Set(d.routes.filter((r) => eq(r.label, t.label)).map((r) => r.output).filter(Boolean))];
    const rows = routeTable(d, t);
    const ok = rows.filter((r) => r.quote.ok);
    const avgPct = ok.length ? ok.reduce((s, r) => s + r.quote.pct, 0) / ok.length : 0;
    const prog = findProgram(d, t.program);
    const sel = (f, options, cur, fmt = (o) => o, allLabel = null) =>
      `<select class="pt-select" data-act="tbl" data-f="${f}">${allLabel != null ? `<option value="">${allLabel}</option>` : ''}${options
        .map((o) => `<option value="${esc(o)}" ${eq(o, cur) ? 'selected' : ''}>${esc(fmt(o))}</option>`)
        .join('')}</select>`;

    const filters = `<div class="pt-section">
      <div class="pt-section-head no-line"><div class="pt-section-icon">${icon('filter', 16)}</div>
        <div><div class="pt-section-title">Bộ lọc thông minh</div><div class="pt-section-sub">Bảng giá tự tính lại từ dữ liệu gốc khi đổi bộ lọc</div></div>
        <div class="pt-section-actions"><button class="pt-btn pt-btn--link" data-act="tbl-reset">${icon('filter', 14)}Xóa bộ lọc</button></div></div>
      <div class="pt-section-body"><div class="pt-grid pt-grid-3">
        <div class="pt-field"><label>Nhãn</label>${sel('label', d.settings.labels.map((l) => l.name), t.label)}</div>
        <div class="pt-field"><label>Đầu ra</label>${sel('output', outputs, t.output, (o) => o, 'Tất cả đầu ra')}</div>
        <div class="pt-field"><label>Chương trình</label>${sel('program', d.settings.programs.map((p) => p.name), t.program)}</div>
        ${prog?.type === 'LKT'
          ? `<div class="pt-field"><label>Nhóm LKT</label>${sel('lktGroup', lktGroupsFor(d, t.label).map((g) => g.name), t.lktGroup, (o) => o, 'Chọn nhóm')}</div>
             <div class="pt-field"><label>Format LKT</label>${sel('lktFormat', lktFormatsFor(d, t.label, t.lktGroup).map((r) => r.format), t.lktFormat, (o) => o, 'Chọn format')}</div>`
          : ''}
        <div class="pt-field"><label>Hình thức thanh toán</label>${sel('method', d.settings.paymentMethods.map((m) => m.name), t.method)}</div>
        <div class="pt-field"><label>Kỳ hạn</label>${sel('term', termsFor(d, t.method).map(String), String(t.term), (x) => (Number(x) ? `${x} tháng` : 'Không kỳ hạn'))}</div>
        <div class="pt-field"><label>Gói bảo hành</label>${sel('warranty', d.warranty.map((w) => w.name), t.warranty)}</div>
      </div></div></div>`;

    const body = rows
      .map(({ route, quote: q }) => `<tr>
        <td><div style="font-weight:500">${esc(route.name)}</div><div class="muted">${esc(route.code)}</div></td>
        <td>${route.output ? `<span class="pt-pill pt-pill--purple">${esc(route.output)}</span>` : ''}</td>
        <td class="num">${q.count}</td>
        <td class="num">${vnd(q.gross)}</td>
        <td class="num">${q.ok ? `<span class="pt-pill pt-pill--orange">-${pct(q.pct)}</span>` : '—'}</td>
        <td class="num">${q.ok ? vnd(q.afterPromo) : '—'}</td>
        <td class="num"><b>${q.ok ? vnd(q.final) : '—'}</b></td>
        <td class="muted">${q.ok && q.gift ? esc(q.gift.content) : ''}</td>
        <td>${q.ok
          ? `<span class="pt-pill pt-pill--green"><span class="pt-dot"></span>Hợp lệ</span>`
          : `<span class="pt-pill pt-pill--red"><span class="pt-dot"></span>${esc(q.status)}</span>`}</td>
        <td><button class="pt-icon-btn" title="Mở trong công cụ tính giá" data-act="open-route" data-code="${esc(route.code)}">${icon('eye', 16)}</button></td>
      </tr>`)
      .join('');

    return (
      head({
        ic: 'table',
        title: 'Bảng giá lộ trình gợi ý',
        actions: monthPicker(),
        sub: `Học phí đã gồm ưu đãi theo bộ lọc · ${esc(d.settings.campaignName)}`,
        stats:
          stat('grey', 'Tổng lộ trình', rows.length, 'route') +
          stat('white', 'Mức giảm trung bình', ok.length ? pct(avgPct) : '—', 'percent') +
          stat('green', 'Hợp lệ', ok.length, 'checkCircle') +
          stat('red', 'Không áp dụng', rows.length - ok.length, 'xCircle'),
      }) +
      filters +
      `<div class="pt-section">
        <div class="pt-section-head"><div><div class="pt-section-title">Danh sách lộ trình</div>
          <div class="pt-section-sub">Tổng <b style="color:var(--pt-purple)">${rows.length}</b> lộ trình · Bấm biểu tượng mắt để xem chi tiết & sao chép báo giá</div></div></div>
        <div class="pt-table-wrap"><table class="pt-table">
          <thead><tr><th>Lộ trình</th><th>Đầu ra</th><th class="num">Số khóa</th><th class="num">Giá gốc</th><th class="num">Ưu đãi</th>
            <th class="num">Giá sau KM</th><th class="num">Học phí cuối</th><th>Quà tặng</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
          <tbody>${body || '<tr><td colspan="10" class="pt-empty">Không có lộ trình phù hợp</td></tr>'}</tbody>
        </table></div>
      </div>`
    );
  }

  // ---------------------------------------------------------------- Xuất PDF (ấn phẩm in / gửi nhà trường)
  let pdfDoc = null;

  function viewPdf() {
    const p = S.pdf;
    const d = docs.get(p.month) ?? null;
    const [py, pm] = p.month.split('-');
    const years = [...new Set([...S.months.map((m) => m.slice(0, 4)), py, String(new Date().getFullYear() + 1)])].sort();
    const monthSel = `<div class="pt-grid" style="grid-template-columns:1fr 1fr;gap:8px">
        <select class="pt-select" data-act="pdf-month" data-part="m">${Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
          .map((m) => `<option value="${m}" ${m === pm ? 'selected' : ''}>Tháng ${Number(m)}${S.months.includes(`${py}-${m}`) ? '' : ' · trống'}</option>`).join('')}</select>
        <select class="pt-select" data-act="pdf-month" data-part="y">${years.map((y) => `<option ${y === py ? 'selected' : ''}>${y}</option>`).join('')}</select></div>`;
    pdfDoc = d ? buildPromoDoc(d, p) : null;
    const prog = d ? findProgram(d, p.program) : null;
    const sel = (f, options, cur, fmt = (o) => o) =>
      `<select class="pt-select" data-act="pdf" data-f="${f}">${options
        .map((o) => `<option value="${esc(o)}" ${eq(o, cur) ? 'selected' : ''}>${esc(fmt(o))}</option>`)
        .join('')}</select>`;
    const check = (act, v, on, text) =>
      `<label style="display:flex;gap:8px;align-items:center;cursor:pointer;font-size:13px">
        <input type="checkbox" data-act="${act}" value="${esc(v)}" ${on ? 'checked' : ''} style="width:16px;height:16px;accent-color:var(--pt-purple)">${text}</label>`;
    const outputs = d ? outputsFor(d, p.label) : [];
    const scen = d && prog?.type !== 'DINH_KY' ? scenariosFor(d, p) : [];
    const scenOn = p.scenarios.length ? p.scenarios : d ? defaultScenarios(d, p) : [];

    const options = `<div class="pt-section" style="margin-top:0">
      <div class="pt-section-head"><div class="pt-section-icon">${icon('settings', 16)}</div>
        <div><div class="pt-section-title">Tùy chọn ấn phẩm</div><div class="pt-section-sub">Khổ A4 ngang · số liệu lấy từ dữ liệu gốc của tháng đã chọn</div></div></div>
      <div class="pt-section-body"><div class="pt-form" style="gap:12px">
        <div class="pt-field"><label>Thời gian (tháng + năm)</label>${monthSel}</div>
        ${d
          ? `<div class="pt-field"><label>Nhãn</label>${sel('label', d.settings.labels.map((l) => l.name), p.label)}</div>
        <div class="pt-field"><label>Chương trình khuyến mại</label>${sel('program', d.settings.programs.map((x) => x.name), p.program)}</div>
        ${prog?.type === 'LKT'
          ? `<div class="pt-field"><label>Nhóm LKT</label>${sel('lktGroup', lktGroupsFor(d, p.label).map((g) => g.name), p.lktGroup)}</div>
             <div class="pt-field"><label>Format LKT (cho bảng giá)</label>${sel('lktFormat', lktFormatsFor(d, p.label, p.lktGroup).map((r) => r.format), p.lktFormat)}</div>`
          : ''}
        <div class="pt-field"><label>Tên chương trình (tiêu đề)</label>
          <input class="pt-input" data-act="pdf-title" value="${esc(p.title)}" placeholder="${esc(defaultTitle(d, p.label))}"></div>
        <div class="pt-field"><label>Nội dung xuất</label><div style="display:grid;gap:7px">${SECTIONS.map((x) =>
          check('pdf-sec', x.id, p.sections.includes(x.id), esc(x.title))).join('')}</div></div>
        ${p.sections.includes('routes') && outputs.length > 1
          ? `<div class="pt-field"><label>Đầu ra trong bảng giá lộ trình</label><div class="pt-chips">${outputs
              .map((o) => check('pdf-out', o, !p.outputs.length || p.outputs.includes(o), esc(o))).join('')}</div></div>`
          : ''}
        ${p.sections.includes('routes') && scen.length
          ? `<div class="pt-field"><label>Kịch bản thanh toán trong bảng giá lộ trình <small>(2 kịch bản / trang)</small></label><div style="display:grid;gap:7px">${scen
              .map((x) => check('pdf-scen', x.id, scenOn.includes(x.id), `${esc(x.title)} · <b>${+(x.pct * 100).toFixed(2)}%</b>`)).join('')}</div></div>`
          : ''}`
          : ''}
      </div></div></div>`;

    const preview = !d
      ? `<div class="pt-empty" style="padding:56px 24px"><div style="font-size:16px;font-weight:600;color:var(--pt-ink);margin-bottom:6px">${monthText(p.month)} chưa có chương trình khuyến mại</div>
          Admin chưa tạo / cập nhật chương trình cho tháng này nên chưa có ấn phẩm để xuất.</div>`
      : pdfDoc.pages
        ? '<iframe id="pt-pdf-frame" title="Xem trước ấn phẩm" style="width:100%;height:78vh;border:0;border-radius:0 0 14px 14px;background:#8a8a8a;display:block"></iframe>'
        : '<div class="pt-empty">Chưa chọn nội dung nào hoặc chương trình chưa có dữ liệu</div>';

    return (
      head({
        ic: 'download',
        title: 'Xuất ấn phẩm chương trình khuyến mại',
        sub: preview
          ? 'Dùng để in ấn, gửi nhà trường. Bản xem thử cho xem trước toàn bộ ấn phẩm; trên portal bấm “Xuất PDF” để lưu file.'
          : 'Dùng để in ấn, gửi nhà trường. Bấm “Xuất PDF” rồi chọn Lưu dưới dạng PDF (Save as PDF).',
        actions: preview
          ? `<span class="pt-pill pt-pill--purple" style="padding:8px 14px">${icon('eye', 14)}Bản xem thử: chỉ xem trước ấn phẩm, xuất PDF trên portal</span>`
          : `<button class="pt-btn pt-btn--primary" data-act="pdf-print" ${pdfDoc?.pages ? '' : 'disabled'}>${icon('download', 16)}Xuất PDF</button>`,
      }) +
      `<div class="pt-grid" style="grid-template-columns:320px minmax(0,1fr);margin-top:14px;align-items:start" id="pt-pdf-grid">
        ${options}
        <div class="pt-section" style="margin-top:0">
          <div class="pt-section-head"><div class="pt-section-icon">${icon('eye', 16)}</div>
            <div><div class="pt-section-title">Xem trước</div><div class="pt-section-sub">${pdfDoc ? `${pdfDoc.pages} trang A4 ngang · ${esc(pdfDoc.title)}` : monthText(p.month)}</div></div></div>
          ${preview}
        </div>
      </div>`
    );
  }

  // Đổi tháng xuất PDF: giữ nhãn / chương trình nếu tháng đó vẫn có, không thì về mặc định
  async function setPdfMonth(m) {
    const d = await getDoc(m);
    const keep = d && d.settings.labels.some((l) => eq(l.name, S.pdf.label)) && d.settings.programs.some((x) => eq(x.name, S.pdf.program));
    S.pdf = { ...(keep ? S.pdf : { ...S.pdf, ...defaultCalc(d) }), month: m, outputs: [], scenarios: [] };
  }

  function loadPdfPreview() {
    const frame = body.querySelector('#pt-pdf-frame');
    if (!frame || !pdfDoc) return;
    frame.addEventListener('load', () => {
      const doc = frame.contentDocument;
      // Thu nhỏ để trang ngang A4 (1123px) vừa khung xem trước; khi in vẫn đúng 100%
      const z = Math.min(1, (frame.clientWidth - 28) / 1123);
      const st = doc.createElement('style');
      st.textContent = `@media screen { body { zoom: ${z}; padding: 14px 0; } }`;
      doc.head.appendChild(st);
    }, { once: true });
    frame.srcdoc = pdfDoc.html;
  }

  async function printPdf() {
    const frame = body.querySelector('#pt-pdf-frame');
    if (!frame?.contentWindow) return;
    try {
      await frame.contentDocument.fonts?.ready;
    } catch {}
    frame.contentWindow.focus();
    frame.contentWindow.print();
  }

  // ---------------------------------------------------------------- Quản trị (admin)
  const draft = () => (S.admin.draft ??= clone(docs.get(S.admin.month)));

  // Thanh tháng: chọn tháng đang sửa + tạo chương trình tháng mới (sao chép từ tháng trước hoặc dữ liệu Excel gốc)
  function monthBar() {
    const A = S.admin;
    const list = [...new Set([...S.months, ...(A.draft ? [A.month] : [])])].sort().reverse();
    const latest = S.months[0];
    const next = (() => {
      const [y, m] = (latest ?? thisMonth()).split('-').map(Number);
      return latest ? `${m === 12 ? y + 1 : y}-${String(m === 12 ? 1 : m + 1).padStart(2, '0')}` : thisMonth();
    })();
    return `<div class="pt-section" style="margin-top:14px"><div class="pt-section-head" style="flex-wrap:wrap">
      <div class="pt-section-icon">${icon('calendar', 16)}</div>
      <div><div class="pt-section-title">Chương trình theo tháng</div><div class="pt-section-sub">Mỗi tháng lưu riêng — tháng cũ giữ nguyên làm lưu trữ, tháng chưa tạo thì sale thấy trống</div></div>
      <div class="pt-section-actions">
        <label class="pt-label" style="margin-right:2px">Đang sửa</label>
        <select class="pt-select" style="height:36px;width:190px" data-act="admin-month">${list.length
          ? list.map((m) => `<option value="${m}" ${m === A.month ? 'selected' : ''}>${monthText(m)}${S.months.includes(m) ? '' : ' (chưa lưu)'}</option>`).join('')
          : '<option>Chưa có tháng nào</option>'}</select>
        <span style="width:1px;height:26px;background:var(--pt-line);margin:0 4px"></span>
        <input class="pt-input" type="month" style="height:36px;width:160px" value="${esc(A.newMonth || next)}" data-act="new-month" title="Tháng cần tạo">
        <select class="pt-select" style="height:36px;width:220px" data-act="copy-from" title="Dữ liệu ban đầu">
          ${S.months.map((m) => `<option value="${m}" ${m === (A.copyFrom || latest) ? 'selected' : ''}>Sao chép từ ${monthText(m).toLowerCase()}</option>`).join('')}
          <option value="seed" ${A.copyFrom === 'seed' || !latest ? 'selected' : ''}>Từ dữ liệu Excel gốc</option></select>
        <button class="pt-btn pt-btn--primary pt-btn--sm" data-act="create-month">${icon('plus', 15)}Tạo tháng mới</button>
      </div></div></div>`;
  }

  async function createMonth() {
    const A = S.admin;
    const bar = body.querySelector('[data-act="new-month"]');
    const m = (bar?.value || A.newMonth || '').slice(0, 7);
    if (!/^\d{4}-\d{2}$/.test(m)) return toast('Chọn tháng cần tạo');
    if (S.months.includes(m)) {
      A.month = m;
      A.draft = null;
      toast(`${monthText(m)} đã có — chuyển sang sửa tháng này`);
      return;
    }
    if (A.dirty && !ask('Đang có thay đổi chưa lưu. Bỏ thay đổi để tạo tháng mới?')) return;
    const src = A.copyFrom || S.months[0] || 'seed';
    const doc = normalizeData(src === 'seed' ? await store.seed() : clone(await getDoc(src)));
    [doc.settings.validFrom, doc.settings.validTo] = monthBounds(m);
    doc.settings.campaignName = '';
    A.month = m;
    A.draft = doc;
    A.dirty = true;
    A.issues = [];
    toast(`Đã tạo ${monthText(m).toLowerCase()} (chưa lưu) — cập nhật giá, CTKM rồi bấm Lưu & áp dụng`);
  }
  const getRows = (def) => def.path.reduce((o, k) => o[k], draft());

  function viewAdmin() {
    const A = S.admin;
    if (!docs.get(A.month) && !A.draft)
      return (
        head({ ic: 'db', title: 'Quản trị dữ liệu gốc', sub: 'Chưa có chương trình nào — tạo tháng đầu tiên để bắt đầu.' }) +
        monthBar() +
        `<div class="pt-section"><div class="pt-empty" style="padding:48px 24px">${monthText(A.month)} chưa có chương trình. Chọn tháng và nguồn dữ liệu ở trên rồi bấm <b>Tạo tháng mới</b>.</div></div>`
      );
    const d = draft();
    const defs = tableDefs(d);
    const def = defs.find((x) => x.id === A.tab);
    const groups = [...new Set(defs.map((x) => x.group))];
    const menu = groups
      .map(
        (g) =>
          `<div class="pt-menu-group">${g}</div>` +
          defs
            .filter((x) => x.group === g)
            .map(
              (x) => `<button class="${x.id === A.tab ? 'is-active' : ''}" data-act="admin-tab" data-v="${x.id}">
                <span class="pt-menu-ic">${icon(x.icon, 15)}</span>${x.title}<span class="pt-count">${getRows(x).length}</span></button>`,
            )
            .join(''),
      )
      .join('') +
      `<div class="pt-menu-group">Chung</div>
       <button class="${A.tab === 'general' ? 'is-active' : ''}" data-act="admin-tab" data-v="general"><span class="pt-menu-ic">${icon('settings', 15)}</span>Thông tin chương trình</button>`;

    const totalPromo = d.periodic.length + d.special.length + d.extended.length + d.lkt.length;
    const issueCount = validateData(d).length;
    const stats =
      stat('grey', 'Khóa học', d.courses.length, 'book') +
      stat('white', 'Dòng CTKM', totalPromo, 'percent') +
      stat('green', 'Lộ trình gợi ý', d.routes.length, 'route') +
      stat(issueCount ? 'red' : 'green', 'Cảnh báo dữ liệu', issueCount, issueCount ? 'alert' : 'checkCircle');

    const content =
      A.tab === 'general'
        ? generalForm(d)
        : `<div class="pt-section" style="margin-top:0">
            <div class="pt-section-head"><div class="pt-section-icon">${icon(def.icon, 16)}</div>
              <div><div class="pt-section-title">${def.title}</div><div class="pt-section-sub">${def.sheet ? `Thay cho sheet ${def.sheet}` : 'Cấu hình chung'}</div></div>
              <div class="pt-section-actions">
                ${def.byLabel ? `<select class="pt-select" style="height:36px;width:170px" data-act="admin-label"><option value="">Tất cả nhãn</option>${d.settings.labels
                  .map((l) => `<option ${eq(l.name, A.label) ? 'selected' : ''}>${esc(l.name)}</option>`)
                  .join('')}</select>` : ''}
                <input class="pt-input" style="height:36px;width:180px" placeholder="Tìm…" value="${esc(A.q)}" data-act="admin-q">
                <button class="pt-btn pt-btn--primary" data-act="row-add">${icon('plus', 16)}Thêm mới</button>
              </div></div>
            <p class="pt-help" style="margin-top:14px">${esc(def.desc)}</p>
            <div id="pt-issues"></div>
            <div class="pt-table-wrap" id="pt-admin-table"></div>
          </div>`;

    return (
      head({
        ic: 'db',
        title: 'Quản trị dữ liệu gốc',
        sub: `Đang sửa chương trình ${monthText(A.month).toLowerCase()} (${fmtDate(d.settings.validFrom)} – ${fmtDate(d.settings.validTo)}). Sale chỉ xem kết quả tính theo dữ liệu này.`,
        actions: `
          <label class="pt-btn pt-btn--ghost pt-btn--sm" style="cursor:pointer">${icon('sheet', 15)}Nhập từ Excel<input type="file" accept=".xlsx" hidden data-act="import-xlsx"></label>
          <label class="pt-btn pt-btn--ghost pt-btn--sm" style="cursor:pointer">${icon('upload', 15)}Nhập JSON<input type="file" accept=".json" hidden data-act="import-json"></label>
          ${preview ? '' : `<button class="pt-btn pt-btn--ghost pt-btn--sm" data-act="export-json">${icon('download', 15)}Xuất JSON</button>`}`,
        stats,
      }) +
      monthBar() +
      `<div class="pt-admin"><nav class="pt-menu">${menu}</nav><div>${content}</div></div>
       <div class="pt-savebar" id="pt-savebar" ${A.dirty ? '' : 'hidden'}>${savebar()}</div>`
    );
  }

  const savebar = () => `${icon('alert', 18)}<span>Có thay đổi chưa lưu cho ${monthText(S.admin.month).toLowerCase()} — sale vẫn đang dùng dữ liệu cũ.</span>
    <span class="pt-band-spacer"></span>
    <button class="pt-btn pt-btn--ghost pt-btn--sm" data-act="discard">Hủy thay đổi</button>
    <button class="pt-btn pt-btn--primary pt-btn--sm" data-act="save" style="background:#fff;color:var(--pt-purple)">${icon('save', 15)}Lưu & áp dụng</button>`;

  function markDirty() {
    S.admin.dirty = true;
    const bar = body.querySelector('#pt-savebar');
    if (bar) bar.hidden = false;
  }

  function generalForm(d) {
    const s = d.settings;
    const f = (key, label, type = 'text') =>
      `<div class="pt-field"><label>${label}</label><input class="pt-input" type="${type}" value="${esc(s[key])}" data-act="setting" data-k="${key}"></div>`;
    return `<div class="pt-section" style="margin-top:0">
      <div class="pt-section-head"><div class="pt-section-icon">${icon('settings', 16)}</div>
        <div><div class="pt-section-title">Thông tin chương trình</div><div class="pt-section-sub">Hiển thị trên trang Tính giá và trong báo giá sao chép</div></div></div>
      <div class="pt-section-body"><div class="pt-grid pt-grid-3">
        ${f('campaignName', 'Tên đợt khuyến mại')}${f('validFrom', 'Áp dụng từ ngày', 'date')}${f('validTo', 'Đến ngày', 'date')}
      </div><div class="pt-field" style="margin-top:14px"><label>Lưu ý hiển thị cho sale</label>
        <input class="pt-input" value="${esc(s.note)}" data-act="setting" data-k="note"></div>
      <div class="pt-section-title" style="margin-top:22px">Câu chữ trên ấn phẩm PDF</div>
      ${[
        ['cashbackLabel', 'Tiêu đề cột hoàn tiền (CTKM định kỳ)'],
        ['warrantyDuration', 'Thời lượng gói bảo hành'],
        ['warrantyForm', 'Hình thức gói bảo hành'],
        ['routeNote', 'Lưu ý dưới bảng giá lộ trình'],
        ['citimeNote', 'Lưu ý phụ lục Citime'],
      ].map(([k, l]) => `<div class="pt-field" style="margin-top:12px"><label>${l}</label>
        <textarea class="pt-input" rows="2" style="height:auto;padding:8px 12px;resize:vertical" data-act="doc-text" data-k="${k}">${esc(s.docTexts?.[k])}</textarea></div>`).join('')}
      <div style="display:flex;gap:8px;margin-top:20px;flex-wrap:wrap">
        <button class="pt-btn pt-btn--ghost pt-btn--sm" data-act="reset-seed">${icon('refresh', 15)}Khôi phục dữ liệu gốc từ file Excel ban đầu</button>
      </div></div></div>`;
  }

  // Bảng chỉnh sửa vẽ riêng để gõ tìm kiếm không làm mất focus ô nhập
  function renderAdminTable() {
    const host = body.querySelector('#pt-admin-table');
    if (!host) return;
    const A = S.admin;
    const def = tableDefs(draft()).find((x) => x.id === A.tab);
    const rows = getRows(def);
    const q = A.q.trim().toLowerCase();
    const issues = A.issues.filter((i) => i.table === def.id);
    const bad = new Set(issues.map((i) => i.row));
    const shown = rows
      .map((r, i) => ({ r, i }))
      .filter(({ r }) => !def.byLabel || !A.label || eq(r.label, A.label))
      .filter(({ r }) => !q || def.columns.some((c) => String(formatCell(c, r[c.key])).toLowerCase().includes(q)));

    const cell = (col, r, i) => {
      const v = r[col.key];
      const attrs = `data-edit="${i}" data-k="${col.key}"`;
      if (col.type === 'bool') return `<input type="checkbox" ${v ? 'checked' : ''} ${attrs} style="width:18px;height:18px;accent-color:var(--pt-purple)">`;
      if (col.type === 'select') {
        const opts = col.options.includes(v) || v === '' ? col.options : [v, ...col.options];
        return `<select class="pt-select" ${attrs}>${opts.map((o) => `<option ${o === v ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
      }
      // Ô nhập có gợi ý (VD khóa logo có sẵn) nhưng vẫn gõ được link tùy ý
      if (col.type === 'combo')
        return `<input class="pt-input w-wide" list="pt-dl-${col.key}" value="${esc(v)}" ${attrs} placeholder="Chọn logo có sẵn hoặc dán link ảnh">
          <datalist id="pt-dl-${col.key}">${col.options.map((o) => `<option value="${esc(o)}"></option>`).join('')}</datalist>`;
      if (col.type === 'color')
        return `<input type="color" value="${esc(v || '#000000')}" ${attrs} style="width:44px;height:30px;border:0;background:none;cursor:pointer">`;
      if (col.type === 'multiline')
        return `<textarea class="pt-input w-wide" rows="${Math.max(2, Math.min(4, String(v ?? '').split('\n').length))}" ${attrs}
          style="height:auto;padding:6px 8px;resize:vertical;line-height:1.4">${esc(v)}</textarea>`;
      const numeric = ['money', 'pct', 'int'].includes(col.type);
      return `<input class="pt-input ${numeric ? 'num' : ''} ${col.wide ? 'w-wide' : ''}" ${numeric ? 'inputmode="decimal"' : ''} value="${esc(formatCell(col, v))}" ${attrs}>`;
    };

    body.querySelector('#pt-issues').innerHTML = issues.length
      ? `<ul class="pt-issues">${issues.map((i) => `<li>Dòng ${i.row + 1}: ${esc(i.message)}</li>`).join('')}</ul>`
      : '';
    host.innerHTML = `<table class="pt-table pt-table--edit">
      <thead><tr><th class="pt-rowno">#</th>${def.columns.map((c) => `<th class="${['money', 'pct', 'int'].includes(c.type) ? 'num' : ''}">${c.label}</th>`).join('')}<th></th></tr></thead>
      <tbody>${shown
        .map(({ r, i }) => `<tr class="${bad.has(i) ? 'has-issue' : ''}"><td class="pt-rowno">${i + 1}</td>${def.columns.map((c) => `<td>${cell(c, r, i)}</td>`).join('')}
          <td><button class="pt-icon-btn is-danger" title="Xóa dòng" data-act="row-del" data-i="${i}">${icon('trash', 15)}</button></td></tr>`)
        .join('') || `<tr><td colspan="${def.columns.length + 2}" class="pt-empty">Chưa có dữ liệu</td></tr>`}</tbody></table>`;
  }

  async function saveAdmin() {
    const d = draft();
    const issues = validateData(d);
    S.admin.issues = issues;
    if (issues.length && !ask(`Có ${issues.length} cảnh báo dữ liệu (trùng khóa, giá ≤ 0...). Vẫn lưu?`)) {
      const first = issues[0];
      S.admin.tab = first.table;
      render();
      return;
    }
    try {
      d.updatedAt = new Date().toISOString();
      if (user) d.updatedBy = user.email ?? user.name ?? '';
      const m = S.admin.month;
      await store.save(m, d);
      docs.set(m, normalizeData(clone(d)));
      S.months = [...new Set([...S.months, m])].sort().reverse();
      if (m === S.month) {
        S.data = docs.get(m);
        resetViews();
      }
      S.admin.draft = null;
      S.admin.dirty = false;
      S.admin.issues = [];
      toast(`Đã lưu ${monthText(m).toLowerCase()}${m === S.month ? ' — sale thấy giá mới ngay' : ''}`);
      render();
    } catch (e) {
      toast(`Lưu thất bại: ${e.message}`);
    }
  }

  // ---------------------------------------------------------------- Sự kiện
  let toastTimer;
  function toast(msg) {
    let el = document.querySelector('.pt-root .pt-toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'pt-toast';
      root.appendChild(el);
    }
    el.textContent = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.remove(), 2600);
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
  }

  function download(name, text) {
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([text], { type: 'application/json' })),
      download: name,
    });
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  root.addEventListener('click', async (e) => {
    const el = e.target.closest('[data-act]');
    if (!el || !root.contains(el) || el.disabled) return;
    const act = el.dataset.act;
    const A = S.admin;
    switch (act) {
      case 'pdf-print':
        await printPdf();
        return;
      case 'view':
        S.view = el.dataset.v;
        break;
      case 'role':
        S.role = el.dataset.v;
        break;
      case 'calc':
        setCalc(S.calc, el.dataset.f, el.dataset.v);
        break;
      case 'toggle': {
        const code = el.dataset.code;
        if (S.calc.selected[code]) delete S.calc.selected[code];
        else S.calc.selected[code] = coursesForLabel(S.data, S.calc.label).find((c) => eq(c.code, code))?.modes[0];
        break;
      }
      case 'mode':
        e.stopPropagation();
        S.calc.selected[el.dataset.code] = el.dataset.v;
        break;
      case 'clear-courses':
        S.calc.selected = {};
        break;
      case 'reset-calc':
        S.calc = defaultCalc(S.data);
        break;
      case 'copy':
        await copy(quoteText());
        toast('Đã sao chép báo giá — dán vào Zalo/Messenger để gửi khách');
        return;
      case 'tbl-reset':
        S.table = { ...defaultCalc(S.data), output: '' };
        break;
      case 'open-route': {
        const t = S.table;
        const r = S.data.routes.find((x) => eq(x.label, t.label) && eq(x.code, el.dataset.code));
        S.calc = { ...t, selected: Object.fromEntries(r.items.map((i) => [i.code, i.mode])) };
        delete S.calc.output;
        S.view = 'calc';
        break;
      }
      case 'admin-tab':
        A.tab = el.dataset.v;
        A.q = '';
        break;
      case 'row-add': {
        const def = tableDefs(draft()).find((x) => x.id === A.tab);
        getRows(def).push(def.blank(A.label || draft().settings.labels[0]?.name || ''));
        A.q = '';
        markDirty();
        renderAdminTable();
        const last = body.querySelector('#pt-admin-table tbody tr:last-child');
        last?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        last?.querySelector('input,select')?.focus();
        return;
      }
      case 'row-del': {
        const def = tableDefs(draft()).find((x) => x.id === A.tab);
        getRows(def).splice(Number(el.dataset.i), 1);
        A.issues = [];
        markDirty();
        renderAdminTable();
        return;
      }
      case 'save':
        await saveAdmin();
        return;
      case 'discard':
        A.draft = null;
        A.dirty = false;
        A.issues = [];
        // Tháng mới tạo mà chưa lưu → quay về tháng đã có
        if (!S.months.includes(A.month)) A.month = S.months[0] ?? S.month;
        break;
      case 'create-month':
        await createMonth();
        break;
      case 'goto-create':
        S.view = 'admin';
        A.newMonth = el.dataset.v;
        if (!S.months.length) A.month = el.dataset.v;
        break;
      case 'export-json':
        download(`du-lieu-khuyen-mai-${A.month}.json`, JSON.stringify(draft(), null, 1));
        return;
      case 'reset-seed':
        if (!ask(`Thay dữ liệu ${monthText(A.month).toLowerCase()} bằng bản gốc nhập từ file Excel ban đầu? (chưa lưu cho tới khi bấm Lưu)`)) return;
        A.draft = normalizeData(await store.seed());
        [A.draft.settings.validFrom, A.draft.settings.validTo] = monthBounds(A.month);
        markDirty();
        A.dirty = true;
        break;
      default:
        return;
    }
    render();
  });

  root.addEventListener('keydown', (e) => {
    const el = e.target.closest('[data-act="toggle"]');
    if (el && (e.key === ' ' || e.key === 'Enter') && e.target === el) {
      e.preventDefault();
      el.click();
    }
  });

  root.addEventListener('change', async (e) => {
    const el = e.target;
    const A = S.admin;
    if (el.dataset.edit != null) {
      const def = tableDefs(draft()).find((x) => x.id === A.tab);
      const col = def.columns.find((c) => c.key === el.dataset.k);
      getRows(def)[Number(el.dataset.edit)][col.key] = col.type === 'bool' ? el.checked : parseCell(col, el.value);
      if (col.type !== 'bool' && col.type !== 'select') el.value = formatCell(col, getRows(def)[Number(el.dataset.edit)][col.key]);
      markDirty();
      return;
    }
    switch (el.dataset.act) {
      case 'setting':
        draft().settings[el.dataset.k] = el.value;
        markDirty();
        return;
      case 'doc-text':
        (draft().settings.docTexts ??= {})[el.dataset.k] = el.value;
        markDirty();
        return;
      case 'pdf':
        setCalc(S.pdf, el.dataset.f, el.value, docs.get(S.pdf.month));
        if (el.dataset.f === 'label') S.pdf.outputs = [];
        S.pdf.scenarios = [];
        break;
      case 'pdf-month': {
        const [y, m] = S.pdf.month.split('-');
        await setPdfMonth(el.dataset.part === 'y' ? `${el.value}-${m}` : `${y}-${el.value}`);
        break;
      }
      case 'pdf-scen': {
        const d = docs.get(S.pdf.month);
        const all = scenariosFor(d, S.pdf).map((x) => x.id);
        const cur = new Set(S.pdf.scenarios.length ? S.pdf.scenarios : defaultScenarios(d, S.pdf));
        if (el.checked) cur.add(el.value);
        else cur.delete(el.value);
        // Bỏ chọn hết → giữ lại 1 kịch bản để bảng giá không rỗng
        S.pdf.scenarios = all.filter((x) => cur.has(x));
        if (!S.pdf.scenarios.length) S.pdf.scenarios = [all[0]];
        break;
      }
      case 'view-month':
        S.month = el.value;
        S.data = await getDoc(S.month);
        resetViews();
        break;
      case 'admin-month':
        if (S.admin.dirty && !ask('Đang có thay đổi chưa lưu. Bỏ thay đổi để chuyển tháng?')) {
          el.value = S.admin.month;
          return;
        }
        S.admin.month = el.value;
        S.admin.draft = null;
        S.admin.dirty = false;
        S.admin.issues = [];
        await getDoc(el.value);
        break;
      case 'new-month':
        S.admin.newMonth = el.value;
        return;
      case 'copy-from':
        S.admin.copyFrom = el.value;
        return;
      case 'pdf-title':
        S.pdf.title = el.value.trim();
        break;
      case 'pdf-sec':
      case 'pdf-out': {
        const key = el.dataset.act === 'pdf-sec' ? 'sections' : 'outputs';
        const all = key === 'sections' ? SECTIONS.map((x) => x.id) : outputsFor(docs.get(S.pdf.month), S.pdf.label);
        const cur = new Set(S.pdf[key].length || key === 'sections' ? S.pdf[key] : all);
        if (el.checked) cur.add(el.value);
        else cur.delete(el.value);
        S.pdf[key] = all.filter((x) => cur.has(x));
        break;
      }
      case 'tbl':
        setCalc(S.table, el.dataset.f, el.value);
        if (el.dataset.f === 'label') S.table.output = '';
        break;
      case 'pick-route': {
        const r = S.data.routes.find((x) => eq(x.label, S.calc.label) && eq(x.code, el.value));
        if (r) S.calc.selected = Object.fromEntries(r.items.map((i) => [i.code, i.mode]));
        break;
      }
      case 'admin-label':
        A.label = el.value;
        renderAdminTable();
        return;
      case 'import-json':
      case 'import-xlsx': {
        const file = el.files?.[0];
        if (!file) return;
        try {
          const next = el.dataset.act === 'import-json' ? JSON.parse(await file.text()) : await importWorkbook(file, draft());
          if (!next?.settings || !Array.isArray(next.courses)) throw new Error('File không đúng cấu trúc');
          // File JSON của tháng khác → giữ khung ngày của tháng đang sửa
          if (monthOfDoc(next) !== A.month) [next.settings.validFrom, next.settings.validTo] = monthBounds(A.month);
          A.draft = normalizeData(next);
          A.issues = validateData(next);
          markDirty();
          A.dirty = true;
          toast(`Đã nạp ${file.name} — kiểm tra rồi bấm Lưu & áp dụng`);
        } catch (err) {
          toast(`Không nhập được: ${err.message}`);
        }
        break;
      }
      default:
        return;
    }
    render();
  });

  root.addEventListener('input', (e) => {
    if (e.target.dataset.act === 'admin-q') {
      S.admin.q = e.target.value;
      renderAdminTable();
    }
  });

  window.addEventListener('beforeunload', (e) => {
    if (S.admin.dirty) e.preventDefault();
  });

  render();
  return {
    setRole(role) {
      S.role = role;
      render();
    },
    async reload() {
      docs.clear();
      S.months = await store.listMonths();
      S.data = await getDoc(S.month);
      await getDoc(S.admin.month);
      await getDoc(S.pdf.month);
      resetViews();
      render();
    },
  };
}
