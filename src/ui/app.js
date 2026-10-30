// Giao diện công cụ tính giá KM. Nhúng vào portal bằng:
//   mountPromoTool(element, { role: 'admin' | 'sale', store, user })
import {
  quote, routeTable, coursesForLabel, termsFor, isFixedTerm, findProgram, findMethod, validateData,
  normalizeData, lktGroupsFor, lktFormatsFor,
} from '../engine/pricing.js';
import { icon } from './icons.js';
import { tableDefs, formatCell, parseCell } from './admin-tables.js';
import { importWorkbook } from './excel-import.js';

const clone = (o) => JSON.parse(JSON.stringify(o));
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const vnd = (n) => `${Math.round(Number(n) || 0).toLocaleString('vi-VN')}đ`;
const pct = (n) => `${+(Number(n || 0) * 100).toFixed(2)}%`;
const fmtDate = (s) => (s ? s.split('-').reverse().join('/') : '');
const eq = (a, b) => String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase();

export async function mountPromoTool(root, opts = {}) {
  const { store, allowRoleSwitch = false, user = null } = opts;
  const S = {
    role: opts.role === 'admin' ? 'admin' : 'sale',
    view: 'calc',
    data: normalizeData(await store.load()),
    calc: null,
    table: null,
    admin: { tab: 'courses', label: '', q: '', draft: null, dirty: false, issues: [] },
  };
  S.calc = defaultCalc(S.data);
  S.table = { ...defaultCalc(S.data), output: '' };

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
      S.view === 'calc' ? viewCalc() : S.view === 'table' ? viewTable() : viewAdmin()
    }</div>`;
    if (S.view === 'admin') renderAdminTable();
  }

  // ---------------------------------------------------------------- Tính giá (sale)
  function defaultCalc(d) {
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

  function setCalc(c, field, value) {
    const d = S.data;
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

  // ---------------------------------------------------------------- Quản trị (admin)
  const draft = () => (S.admin.draft ??= clone(S.data));
  const getRows = (def) => def.path.reduce((o, k) => o[k], draft());

  function viewAdmin() {
    const d = draft();
    const A = S.admin;
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
        sub: 'Nhập giá gốc, CTKM, quà tặng… Sale chỉ xem kết quả tính theo dữ liệu này.',
        actions: `
          <label class="pt-btn pt-btn--ghost pt-btn--sm" style="cursor:pointer">${icon('sheet', 15)}Nhập từ Excel<input type="file" accept=".xlsx" hidden data-act="import-xlsx"></label>
          <label class="pt-btn pt-btn--ghost pt-btn--sm" style="cursor:pointer">${icon('upload', 15)}Nhập JSON<input type="file" accept=".json" hidden data-act="import-json"></label>
          <button class="pt-btn pt-btn--ghost pt-btn--sm" data-act="export-json">${icon('download', 15)}Xuất JSON</button>`,
        stats,
      }) +
      `<div class="pt-admin"><nav class="pt-menu">${menu}</nav><div>${content}</div></div>
       <div class="pt-savebar" id="pt-savebar" ${A.dirty ? '' : 'hidden'}>${savebar()}</div>`
    );
  }

  const savebar = () => `${icon('alert', 18)}<span>Có thay đổi chưa lưu — sale vẫn đang dùng dữ liệu cũ.</span>
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
    if (issues.length && !confirm(`Có ${issues.length} cảnh báo dữ liệu (trùng khóa, giá ≤ 0...). Vẫn lưu?`)) {
      const first = issues[0];
      S.admin.tab = first.table;
      render();
      return;
    }
    try {
      d.updatedAt = new Date().toISOString();
      if (user) d.updatedBy = user.email ?? user.name ?? '';
      await store.save(d);
      S.data = normalizeData(clone(d));
      S.admin.draft = null;
      S.admin.dirty = false;
      S.admin.issues = [];
      toast('Đã lưu — sale sẽ thấy giá mới ngay');
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
        break;
      case 'export-json':
        download(`du-lieu-khuyen-mai-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(draft(), null, 1));
        return;
      case 'reset-seed':
        if (!confirm('Thay toàn bộ dữ liệu bằng bản gốc nhập từ file Excel ban đầu? (chưa lưu cho tới khi bấm Lưu)')) return;
        A.draft = await store.reset();
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
      S.data = normalizeData(await store.load());
      render();
    },
  };
}
