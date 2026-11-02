// Ấn phẩm "Chương trình khuyến mãi" để in / gửi nhà trường — dựng HTML khổ A4 từ dữ liệu gốc,
// trình duyệt in ra PDF (chữ vector, in sắc nét). Cấu trúc trang giữ cố định theo ấn phẩm IELTS Mentor;
// mọi con số tính lại bằng engine nên tháng sau chỉ cần admin cập nhật dữ liệu.
import { quote, findProgram, findMethod, coursesForLabel, lktFormatsFor, findLktGroup } from '../engine/pricing.js';

const eq = (a, b) => String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase();
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const num = (n) => Math.round(Number(n) || 0).toLocaleString('vi-VN');
const pct = (p) => `${+(Number(p || 0) * 100).toFixed(2)}%`;
const lines = (s) => esc(s).replace(/\n/g, '<br>');

export const SECTIONS = [
  { id: 'courses', title: 'Bảng giá khuyến mại lộ trình khóa học', page: 'A' },
  { id: 'warranty', title: 'Gói bảo hành', page: 'A' },
  { id: 'services', title: 'Dịch vụ học tập', page: 'A' },
  { id: 'promo', title: 'Chương trình khuyến mại', page: 'B' },
  { id: 'vouchers', title: 'Quà tặng khóa học đặc biệt', page: 'B' },
  { id: 'gifts', title: 'Quà tặng theo hình thức thanh toán', page: 'C' },
  { id: 'giftSets', title: 'Bộ quà tặng giá trị dành cho học viên', page: 'C' },
  { id: 'routes', title: 'Bảng giá lộ trình gợi ý (theo đầu ra)', page: 'R' },
  { id: 'citime', title: 'Phụ lục thời hạn trả góp Citime', page: 'T' },
];

function monthOf(data) {
  const [y, m] = String(data.settings.validFrom ?? '').split('-');
  return y && m ? `${Number(m)}/${y}` : '';
}

const shortDate = (s) => {
  const [y, m, d] = String(s ?? '').split('-');
  return y ? `${Number(d)}/${Number(m)}/${y}` : '';
};

export function defaultTitle(data, label) {
  return `CHƯƠNG TRÌNH KHUYẾN MÃI ${String(label).toUpperCase()} - THÁNG ${monthOf(data)}`;
}

export function brandFor(data, label) {
  return (
    data.settings.brands?.find((b) => eq(b.label, label)) ?? {
      label, brandName: String(label).toUpperCase(), bg: '#FFD21F', bg2: '#FFE45C', ink: '#111111', accent: '#E3141B', logoUrl: '', footer: '',
    }
  );
}

/** Đầu ra có lộ trình gợi ý của nhãn, theo thứ tự trong dữ liệu. */
export function outputsFor(data, label) {
  return [...new Set(data.routes.filter((r) => eq(r.label, label)).map((r) => r.output).filter(Boolean))];
}

const comboName = (n, max) => (n === 1 ? 'Khóa lẻ' : `Combo ${n} khóa${max && n >= max ? ' trở lên' : ''}`);

// ---------------------------------------------------------------- Bảng có gộp ô
// rows: mảng hàng; mỗi hàng là mảng ô (chuỗi HTML hoặc { html, key, cls, colspan }) hoặc { group: 'tiêu đề' }.
// merge: chỉ số cột gộp dọc khi các ô liền nhau giống nhau (không gộp qua hàng tiêu đề nhóm).
function table({ head, rows, merge = [], cls = '', colgroup = '' }) {
  const width = head.at(-1).reduce((s, c) => s + (c.colspan ?? 1), 0);
  const norm = rows.map((r) => (r.group != null ? r : r.map((c) => (typeof c === 'object' && c ? { ...c } : { html: String(c ?? '') }))));
  for (const col of merge) {
    let start = -1;
    for (let i = 0; i <= norm.length; i++) {
      const r = norm[i];
      const key = r && r.group == null ? (r[col].key ?? r[col].html) : null;
      const prev = start >= 0 ? (norm[start][col].key ?? norm[start][col].html) : null;
      if (start >= 0 && key != null && key === prev) {
        norm[start][col].rowspan = (norm[start][col].rowspan ?? 1) + 1;
        r[col].skip = true;
      } else start = key != null ? i : -1;
    }
  }
  const th = head
    .map((hr) => `<tr>${hr.map((c) => `<th${c.colspan ? ` colspan="${c.colspan}"` : ''}${c.rowspan ? ` rowspan="${c.rowspan}"` : ''}>${c.html}</th>`).join('')}</tr>`)
    .join('');
  const tb = norm
    .map((r) =>
      r.group != null
        ? `<tr class="grp"><td colspan="${width}">${esc(r.group)}</td></tr>`
        : `<tr>${r
            .filter((c) => !c.skip)
            .map((c) => `<td${c.rowspan > 1 ? ` rowspan="${c.rowspan}"` : ''}${c.colspan ? ` colspan="${c.colspan}"` : ''}${c.cls ? ` class="${c.cls}"` : ''}>${c.html}</td>`)
            .join('')}</tr>`,
    )
    .join('');
  return `<table class="t ${cls}">${colgroup}<thead>${th}</thead><tbody>${tb}</tbody></table>`;
}
const H = (...cells) => cells.map((c) => (typeof c === 'string' ? { html: c } : c));

// ---------------------------------------------------------------- Ngữ cảnh tính giá
function context(data, opts) {
  const prog = findProgram(data, opts.program);
  const periodic = prog?.type === 'DINH_KY';
  const methods = data.settings.paymentMethods;
  const method = periodic ? (methods.find((m) => m.allowSingle) ?? methods[0]).name : opts.method;
  const fixed = (findMethod(data, method)?.terms ?? [0]).every((t) => Number(t) === 0);
  return {
    label: opts.label,
    program: opts.program,
    prog,
    periodic,
    lktGroup: opts.lktGroup,
    lktFormat: opts.lktFormat,
    method,
    term: fixed ? 0 : Number(opts.term) || 0,
    q(items, extra = {}) {
      return quote(data, { label: opts.label, program: opts.program, lktGroup: opts.lktGroup, lktFormat: opts.lktFormat,
        method, term: fixed ? 0 : Number(opts.term) || 0, warranty: '', items, ...extra });
    },
  };
}

// ---------------------------------------------------------------- Các mục
function secCourses(data, ctx) {
  const codes = coursesForLabel(data, ctx.label);
  const rows = codes.map((cc) => {
    const off = data.courses.find((c) => eq(c.label, ctx.label) && eq(c.code, cc.code) && eq(c.mode, 'Offline'));
    const on = data.courses.find((c) => eq(c.label, ctx.label) && eq(c.code, cc.code) && eq(c.mode, 'Online'));
    const row = off ?? on; // ấn phẩm tính theo khóa Offline nếu có
    const q = ctx.q([{ code: cc.code, mode: row.mode }]);
    return [cc.name, cc.code, row.sessions || (off ?? on)?.sessions || '', off?.classSize || 'x', on?.classSize || 'x',
      num(row.price), q.ok ? num(q.afterPromo) : '—'];
  });
  return table({
    head: [H('Khóa học', 'Mã khoá học', 'Thời lượng', 'Sĩ số Offline', 'Sĩ số Online', 'Giá gốc', 'Giá sau khuyến mại')],
    rows,
    merge: [3, 4],
    cls: 't-courses',
  });
}

function secWarranty(data, ctx) {
  const list = data.warranty.filter((w) => w.rate > 0);
  if (!list.length) return '';
  const t = data.settings.docTexts;
  const excluded = coursesForLabel(data, ctx.label).filter((c) => c.warranty === false).map((c) => c.name);
  const unit = `Giá gốc của khóa học/combo khóa học${excluded.length ? `<br><i>Lưu ý: không áp dụng tính phí với các khoá ${esc(excluded.join(', '))}</i>` : ''}`;
  return table({
    head: [H('Sản phẩm', 'Thời lượng', 'Hình thức', 'Giá khuyến mại', 'Đơn vị tính')],
    rows: list.map((w) => [`Gói bảo hành ${esc(w.name)}`, esc(t.warrantyDuration), esc(t.warrantyForm), pct(w.rate), unit]),
    merge: [1, 2, 4],
  });
}

function secServices(data, ctx) {
  const list = (data.settings.services ?? []).filter((s) => eq(s.label, ctx.label));
  if (!list.length) return '';
  return table({
    head: [H('Sản phẩm', 'Thời lượng', 'Hình thức', 'Giá gốc')],
    rows: list.map((s) => [esc(s.name), esc(s.duration), esc(s.mode), num(s.price)]),
  });
}

function secPromo(data, ctx) {
  const type = ctx.prog?.type;
  if (type === 'DINH_KY') {
    const tiers = data.periodic.filter((t) => eq(t.label, ctx.label)).sort((a, b) => a.from - b.from);
    if (!tiers.length) return '';
    const max = Math.max(...tiers.map((t) => t.from));
    const rows = [];
    for (let n = 1; n <= max; n++) {
      const t = tiers.find((x) => x.from <= n && x.to >= n);
      rows.push([comboName(n, t?.to >= 99 ? n : null), t ? pct(t.pct) : '—', t?.cashback ? `Hoàn tiền ${num(t.cashback)}đ` : '']);
    }
    return table({
      head: [H('Khóa học', 'Giảm giá', esc(data.settings.docTexts.cashbackLabel))],
      // ô hoàn tiền trống không gộp với nhau
      rows: rows.map((r, n) => r.map((c, i) => (i === 2 && !c ? { html: '', key: `blank-${n}` } : c))),
      merge: [1, 2],
    });
  }
  const methodTerm = (r) => [esc(r.method), Number(r.term) ? `${r.term} tháng` : 'Không kỳ hạn'];
  if (type === 'DAC_BIET' || type === 'MO_RONG') {
    const rows = (type === 'DAC_BIET' ? data.special : data.extended.filter((r) => eq(r.program, ctx.program))).filter((r) => eq(r.label, ctx.label));
    if (!rows.length) return '';
    return table({
      head: [H('Hình thức thanh toán', 'Kỳ hạn', 'Giảm giá', 'Áp dụng')],
      rows: rows.map((r) => [...methodTerm(r), pct(r.pct), esc(r.note)]),
      merge: [0, 3],
    });
  }
  if (type === 'LKT') {
    const group = findLktGroup(data, ctx.lktGroup);
    const base = findProgram(data, group?.baseProgram);
    const formats = lktFormatsFor(data, ctx.label, ctx.lktGroup);
    if (!group || !base || !formats.length) return '';
    const rows = (base.type === 'DAC_BIET' ? data.special : data.extended.filter((r) => eq(r.program, base.name))).filter((r) => eq(r.label, ctx.label));
    return (
      `<p class="cap">${esc(group.name)} — % giảm = % ${esc(base.name)} trừ mức cắt theo format</p>` +
      table({
        head: [H('Hình thức thanh toán', 'Kỳ hạn', `% ${esc(base.name)}`, ...formats.map((f) => `${esc(f.format)}<br><small>(-${pct(f.cut)})</small>`))],
        rows: rows.map((r) => [...methodTerm(r), pct(r.pct), ...formats.map((f) => pct(r.pct - f.cut))]),
        merge: [0],
        cls: 't-small',
      })
    );
  }
  return '';
}

function secVouchers(data, ctx) {
  const rows = [];
  for (const cc of coursesForLabel(data, ctx.label))
    for (const mode of cc.modes) {
      const v = ctx.q([{ code: cc.code, mode }]).lines[0]?.voucher ?? 0;
      if (v > 0) rows.push([`${esc(cc.name)}${cc.modes.length > 1 ? ` ${esc(mode)}` : ''}`, `Voucher giảm học phí ${num(v)}đ`]);
    }
  if (!rows.length) return '';
  return table({ head: [H('Khóa học', 'Voucher giảm thêm')], rows });
}

function giftFor(data, ctx, method, n) {
  const pm = findMethod(data, method);
  const rows = data.gifts.filter((g) => eq(g.label, ctx.label) && eq(g.program, ctx.program) && eq(g.method, pm?.giftGroup ?? method));
  const cap = Math.max(0, ...data.gifts.filter((g) => eq(g.label, ctx.label) && eq(g.program, ctx.program)).map((g) => g.milestone));
  return rows.find((g) => Number(g.milestone) === Math.min(n, cap)) ?? null;
}

// Thứ tự cột như ấn phẩm: Full → trả góp → hình thức có điều kiện nhận quà (trả giai đoạn) để cuối
function giftMethods(data, ctx) {
  const blocked = data.settings.labels.find((l) => eq(l.name, ctx.label))?.blockedMethods ?? [];
  const list = data.settings.paymentMethods.filter((m) => !blocked.some((b) => eq(b, m.name)));
  return [...list.filter((m) => !m.giftCondition), ...list.filter((m) => m.giftCondition)];
}

function secGifts(data, ctx) {
  const all = data.gifts.filter((g) => eq(g.label, ctx.label) && eq(g.program, ctx.program));
  if (!all.length) return '';
  const max = Math.max(...all.map((g) => g.milestone));
  const methods = giftMethods(data, ctx);
  const head1 = [{ html: 'Khóa học', rowspan: 2 }];
  const head2 = [];
  methods.forEach((m) => {
    if (m.giftCondition) {
      head1.push({ html: esc(m.docLabel), colspan: 2 });
      head2.push({ html: 'Quà tặng' }, { html: 'Điều kiện' });
    } else head1.push({ html: esc(m.docLabel), rowspan: 2 });
  });
  const rows = [];
  for (let n = 1; n <= max; n++) {
    const r = [comboName(n, max)];
    for (const m of methods) {
      const g = giftFor(data, ctx, m.name, n);
      const text = n === 1 && !m.allowSingle ? 'Không áp dụng' : g ? esc(g.content) : 'x';
      r.push(text);
      if (m.giftCondition) r.push(g ? esc(m.giftCondition) : 'x');
    }
    rows.push(r);
  }
  const merge = rows[0].map((_, i) => i).slice(1);
  return table({ head: head2.length ? [head1, head2] : [head1], rows, merge, cls: 't-gifts' });
}

function secGiftSets(data, ctx) {
  const sets = (data.settings.giftSets ?? []).filter((s) => eq(s.label, ctx.label)).sort((a, b) => a.value - b.value);
  if (!sets.length) return '';
  return table({
    head: [H('STT', 'Bộ quà tặng', 'Quà tặng bao gồm')],
    rows: sets.map((s, i) => [String(i + 1), `Bộ quà tặng trị giá ${num(s.value)}đ`, { html: lines(s.items), cls: 'left' }]),
    cls: 't-sets',
  });
}

function routePage(data, ctx, output) {
  const routes = data.routes.filter((r) => eq(r.label, ctx.label) && eq(r.output, output));
  if (!routes.length) return '';
  const warranties = data.warranty.filter((w) => w.rate > 0);
  const methods = giftMethods(data, ctx).filter((m) => !m.citime);
  const showGifts = methods.some((m) => routes.some((r) => giftFor(data, ctx, m.name, r.items.length)));
  const head = [H('Lộ trình', 'Giá gốc', 'Giá sau ưu đãi', ...warranties.map((w) => `+ BH ${esc(w.name)} ${pct(w.rate)}`),
    ...(showGifts ? methods.map((m) => lines(m.docShort)) : []))];
  const rows = [];
  const counts = [...new Set(routes.map((r) => r.items.length))].sort((a, b) => a - b);
  for (const n of counts) {
    rows.push({ group: comboName(n) });
    for (const r of routes.filter((x) => x.items.length === n)) {
      const q = ctx.q(r.items);
      const finals = warranties.map((w) => ctx.q(r.items, { warranty: w.name }).final);
      rows.push([
        esc(r.name), num(q.gross),
        q.ok ? { html: num(q.afterPromo), cls: 'hot' } : { html: 'Không áp dụng', cls: 'muted' },
        ...finals.map((f) => (q.ok ? num(f) : '—')),
        ...(showGifts
          ? methods.map((m) => {
              const g = giftFor(data, ctx, m.name, n);
              return { html: g ? esc(g.content) : 'x', key: `${n}|${m.name}|${g?.content ?? 'x'}` };
            })
          : []),
      ]);
    }
  }
  const giftCols = showGifts ? methods.map((_, i) => 3 + warranties.length + i) : [];
  const sub = ctx.periodic
    ? 'Áp dụng cho toàn bộ hình thức thanh toán'
    : `Áp dụng cho hình thức ${esc(ctx.method)}${ctx.term ? ` ${ctx.term} tháng` : ''}${ctx.lktFormat ? ` · ${esc(ctx.lktGroup)} – ${esc(ctx.lktFormat)}` : ''}`;
  return `<div class="ttl"><div>ĐẦU RA IELTS ${esc(output)}</div><div>BẢNG GIÁ LỘ TRÌNH GỢI Ý - CHƯƠNG TRÌNH ${esc(String(ctx.program).toUpperCase())} THÁNG ${monthOf(data)}</div></div>
    <p class="cap">${sub}</p>
    ${table({ head, rows, merge: giftCols, cls: 't-routes' })}
    <div class="note"><b>*Lưu ý:</b><ul><li>${esc(data.settings.docTexts.routeNote)}</li></ul></div>`;
}

function citimePage(data, ctx, brand) {
  const citime = data.settings.paymentMethods.find((m) => m.citime);
  const blocked = data.settings.labels.find((l) => eq(l.name, ctx.label))?.blockedMethods ?? [];
  if (!citime || blocked.some((b) => eq(b, citime.name))) return '';
  const skip = new Set(data.settings.courseCodes.filter((c) => /^M[AB]$/.test(c.short)).map((c) => c.short));
  const list = data.citimeRoutes.filter(
    (r) => eq(r.label, ctx.label) && eq(r.status, 'Áp dụng') && !String(r.code).split('_').some((s) => skip.has(s)),
  );
  if (!list.length) return '';
  const groups = [...new Set(list.map((r) => r.group))];
  const cols = groups.map((g) => {
    const rows = [];
    const items = list.filter((r) => r.group === g);
    for (const n of [...new Set(items.map((r) => r.count))].sort((a, b) => a - b)) {
      rows.push({ group: comboName(n) });
      items.filter((r) => r.count === n).forEach((r) => rows.push([esc(r.name), String(r.maxTerm)]));
    }
    return `<div>${table({ head: [H('Lộ trình', 'Thời gian tối đa trả góp Citime (tháng)')], rows, cls: 't-citime' })}</div>`;
  });
  return `<div class="pill">PHỤ LỤC DANH SÁCH THỜI HẠN TRẢ GÓP CITIME NHÃN HÀNG ${esc(brand.brandName)}</div>
    <div class="cols">${cols.join('')}</div>
    <p class="warn"><b>Lưu ý:</b> ${esc(data.settings.docTexts.citimeNote)}</p>`;
}

// ---------------------------------------------------------------- Lắp trang
/**
 * @param opts { label, program, lktGroup, lktFormat, method, term, title, sections: string[], outputs: string[] }
 * @returns { html, pages: number, title }
 */
export function buildPromoDoc(data, opts) {
  const ctx = context(data, opts);
  const brand = brandFor(data, opts.label);
  const on = new Set(opts.sections ?? SECTIONS.map((s) => s.id));
  const title = opts.title || defaultTitle(data, opts.label);
  const pages = [];
  const block = (id, html) => (on.has(id) && html ? `<div class="pill">${esc(SECTIONS.find((s) => s.id === id).title.replace(/ \(.*\)$/, '').toUpperCase())}</div>${html}` : '');

  const page = (body, land = false, footer = true) =>
    body.trim() && pages.push({ body, land, footer });

  page(block('courses', secCourses(data, ctx)) + block('warranty', secWarranty(data, ctx)) + block('services', secServices(data, ctx)));
  page(block('promo', secPromo(data, ctx)) + block('vouchers', secVouchers(data, ctx)));
  // Bộ quà tặng chỉ có nghĩa khi chương trình có quà theo hình thức thanh toán
  const gifts = secGifts(data, ctx);
  page(block('gifts', gifts) + (gifts ? block('giftSets', secGiftSets(data, ctx)) : ''));
  if (on.has('routes'))
    for (const o of opts.outputs?.length ? opts.outputs : outputsFor(data, opts.label)) page(routePage(data, ctx, o), true);
  if (on.has('citime')) page(citimePage(data, ctx, brand), true, false);

  const html = renderDocument({ data, brand, title, pages });
  return { html, pages: pages.length, title };
}

// Chữ trên nền nhãn: đen nếu nền sáng, trắng nếu nền tối
function onBg(hex) {
  const h = String(hex).replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55 ? '#111111' : '#FFFFFF';
}

const STAR = `<svg viewBox="0 0 24 24" width="30" height="30"><path d="M12 1.5l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.6 5.6 21.1 7 14 1.7 9l7.2-.9z" fill="#FFC21A" stroke="#E89B00" stroke-width="1"/></svg>`;

function renderDocument({ data, brand, title, pages }) {
  const s = data.settings;
  const fg = onBg(brand.bg);
  const range = `Từ ${shortDate(s.validFrom)} - ${shortDate(s.validTo)}`;
  const header = `<header class="hd">
      <div class="brand">${brand.logoUrl ? `<img src="${esc(brand.logoUrl)}" alt="">` : `<span>${esc(brand.brandName)}</span>`}</div>
      <h1>${esc(title)}</h1>
      <div class="ribbon-wrap">${STAR}<div class="ribbon">${esc(range)}</div>${STAR}</div>
    </header>`;
  const body = pages
    .map(
      (p) => `<section class="page${p.land ? ' land' : ''}"><div class="inner">${header}<main>${p.body}</main>${
        p.footer && brand.footer ? `<footer>${lines(brand.footer)}</footer>` : ''}</div></section>`,
    )
    .join('');
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500;1,700;1,800&display=swap" rel="stylesheet">
<style>
@page { size: A4 portrait; margin: 0; }
@page land { size: A4 landscape; margin: 0; }
:root { --bg: ${brand.bg}; --bg2: ${brand.bg2 || brand.bg}; --ink: ${brand.ink}; --accent: ${brand.accent}; --fg: ${fg}; }
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
html, body { margin: 0; }
body { font-family: 'Be Vietnam Pro', system-ui, sans-serif; color: var(--ink); background: #8a8a8a; }
.page { width: 210mm; height: 296.5mm; margin: 0 auto 14px; position: relative; overflow: hidden;
  background:
    repeating-conic-gradient(from -90deg at 50% -8%, rgba(255,255,255,.16) 0 4deg, transparent 4deg 9deg),
    radial-gradient(120% 70% at 50% 0%, var(--bg2), var(--bg) 65%);
  break-after: page; page-break-after: always; box-shadow: 0 6px 24px rgba(0,0,0,.25); }
.page.land { width: 297mm; height: 209.5mm; page: land; }
.page:last-child { break-after: auto; page-break-after: auto; }
.inner { padding: 9mm 11mm 8mm; display: flex; flex-direction: column; min-height: 100%; }
.land .inner { padding: 7mm 10mm 6mm; }
.hd { text-align: center; color: var(--fg); }
.brand { font-weight: 800; letter-spacing: .14em; font-size: 13px; }
.brand img { height: 30px; }
h1 { margin: 4px 0 6px; font-size: 22px; font-weight: 800; font-style: italic; text-transform: uppercase; letter-spacing: -.01em; line-height: 1.15; }
.land h1 { font-size: 19px; }
.ribbon-wrap { display: flex; justify-content: center; align-items: center; gap: 6px; margin-bottom: 8px; }
.ribbon { background: #111; color: #fff; font-style: italic; font-weight: 700; font-size: 15px; padding: 5px 30px;
  clip-path: polygon(0 0, 100% 0, 96% 50%, 100% 100%, 0 100%, 4% 50%); }
main { flex: 1; }
.pill { display: table; margin: 12px auto 7px; background: #111; color: #fff; font-weight: 800; font-size: 13px; letter-spacing: .02em;
  padding: 6px 22px; border-radius: 999px; border: 2px solid #fff; text-transform: uppercase; text-align: center; }
.ttl { margin: 6px auto 4px; background: #111; color: #fff; border-radius: 999px; padding: 6px 34px; text-align: center; font-weight: 800;
  font-size: 13px; line-height: 1.35; width: fit-content; max-width: 92%; border: 2px solid #fff; }
.cap { text-align: center; font-style: italic; font-size: 11px; margin: 4px 0 5px; color: var(--fg); }
.t { width: 100%; border-collapse: collapse; background: #fff; font-size: 11px; line-height: 1.3; }
.t th, .t td { border: 1px solid #111; padding: 4px 6px; text-align: center; vertical-align: middle; }
.t th { font-weight: 700; }
.t td.left { text-align: left; }
.t tr.grp td { font-weight: 700; text-align: left; padding-left: 28px; background: #fff; }
.t td.hot { color: var(--accent); font-weight: 800; }
.t td.muted { color: #888; font-style: italic; }
.t i { font-weight: 400; }
.t-small { font-size: 10px; }
.t-routes { font-size: 10.5px; }
.t-routes th, .t-routes td { padding: 3px 5px; }
.land .pill, .land .ttl { margin-top: 4px; }
.land footer { margin-top: 4px; }
.t-routes td:first-child { min-width: 150px; }
.t-citime { font-size: 10.5px; }
.t-sets td:nth-child(2) { white-space: nowrap; }
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; align-items: start; }
.note { font-size: 10.5px; color: var(--fg); margin-top: 4px; }
.note ul { margin: 2px 0 0 18px; padding: 0; font-style: italic; }
.warn { font-size: 11px; color: #C8102E; font-style: italic; margin: 10px 0 0 52%; }
footer { text-align: center; font-style: italic; font-size: 11px; margin-top: 8px; color: var(--fg); line-height: 1.4; }
@media print { body { background: none; } .page { margin: 0; box-shadow: none; } }
</style>
<script>
// Trang có nhiều dòng hơn khổ giấy (VD admin thêm lộ trình) → tự co nội dung cho vừa 1 trang thay vì tràn sang trang mới
function fitPages() {
  document.querySelectorAll('.page').forEach(function (p) {
    var inner = p.querySelector('.inner');
    inner.style.zoom = ''; inner.style.width = '';
    var r = p.clientHeight / inner.scrollHeight;
    if (r < 1) { inner.style.zoom = r; inner.style.width = (100 / r) + '%'; }
  });
}
window.addEventListener('load', function () { (document.fonts ? document.fonts.ready : Promise.resolve()).then(fitPages); });
</script></head><body>${body}</body></html>`;
}
