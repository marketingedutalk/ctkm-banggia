// Ấn phẩm "Chương trình khuyến mãi" để in / gửi nhà trường — khổ A4 ngang, phong cách catalogue nhãn hàng
// (nền kem, sọc màu nhãn, thẻ be / màu nhãn / tối, bảng tiêu đề tối). Trình duyệt in ra PDF, chữ vector.
// Mọi nội dung lấy từ dữ liệu gốc admin nạp hằng tháng; con số tính lại bằng engine.
import { quote, findProgram, findMethod, coursesForLabel, lktFormatsFor, findLktGroup } from '../engine/pricing.js';

const eq = (a, b) => String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase();
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const num = (n) => Math.round(Number(n) || 0).toLocaleString('vi-VN');
const pct = (p) => `${+(Number(p || 0) * 100).toFixed(2)}%`;
const lines = (s) => esc(s).replace(/\n/g, '<br>');
const two = (i) => String(i).padStart(2, '0');

export const SECTIONS = [
  { id: 'cover', title: 'Trang bìa + điểm nổi bật' },
  { id: 'courses', title: 'Bảng giá khóa học' },
  { id: 'promo', title: 'Chương trình khuyến mại & voucher' },
  { id: 'gifts', title: 'Quà tặng theo hình thức thanh toán' },
  { id: 'giftSets', title: 'Bộ quà tặng' },
  { id: 'services', title: 'Gói bảo hành & dịch vụ học tập' },
  { id: 'routes', title: 'Bảng giá lộ trình gợi ý (theo đầu ra)' },
  { id: 'citime', title: 'Phụ lục thời hạn trả góp Citime' },
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
      label, brandName: String(label), bg: '#F0C030', bg2: '#FFFCF2', ink: '#161513', accent: '#C8102E', logoUrl: '', footer: '',
    }
  );
}

/** Đầu ra có lộ trình gợi ý của nhãn, theo thứ tự trong dữ liệu. */
export function outputsFor(data, label) {
  return [...new Set(data.routes.filter((r) => eq(r.label, label)).map((r) => r.output).filter(Boolean))];
}

const comboName = (n, max) => (n === 1 ? 'Khóa lẻ' : `Combo ${n} khóa${max && n >= max ? ' trở lên' : ''}`);

// ---------------------------------------------------------------- Bảng có gộp ô
// rows: mảng hàng; mỗi hàng là mảng ô (chuỗi HTML hoặc { html, key, cls }) hoặc { group: 'tiêu đề' }.
// merge: chỉ số cột gộp dọc khi các ô liền nhau giống nhau (không gộp qua hàng tiêu đề nhóm).
function table({ head, rows, merge = [], cls = '' }) {
  const width = head.at(-1).reduce((s, c) => s + (c.colspan ?? 1), 0) + (head.length > 1 ? head[0].filter((c) => c.rowspan > 1).length : 0);
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
    .map((hr) => `<tr>${hr.map((c) => `<th${c.colspan ? ` colspan="${c.colspan}"` : ''}${c.rowspan ? ` rowspan="${c.rowspan}"` : ''}${c.cls ? ` class="${c.cls}"` : ''}>${c.html}</th>`).join('')}</tr>`)
    .join('');
  const tb = norm
    .map((r) =>
      r.group != null
        ? `<tr class="grp"><td colspan="${width}">${esc(r.group)}</td></tr>`
        : `<tr>${r
            .filter((c) => !c.skip)
            .map((c) => `<td${c.rowspan > 1 ? ` rowspan="${c.rowspan}"` : ''}${c.cls ? ` class="${c.cls}"` : ''}>${c.html}</td>`)
            .join('')}</tr>`,
    )
    .join('');
  return `<table class="t ${cls}"><thead>${th}</thead><tbody>${tb}</tbody></table>`;
}
const H = (...cells) => cells.map((c) => (typeof c === 'string' ? { html: c } : c));

// ---------------------------------------------------------------- Ngữ cảnh tính giá
function context(data, opts) {
  const prog = findProgram(data, opts.program);
  const periodic = prog?.type === 'DINH_KY';
  const methods = data.settings.paymentMethods;
  const method = periodic ? (methods.find((m) => m.allowSingle) ?? methods[0]).name : opts.method;
  const fixed = (findMethod(data, method)?.terms ?? [0]).every((t) => Number(t) === 0);
  const term = fixed ? 0 : Number(opts.term) || 0;
  return {
    label: opts.label,
    program: opts.program,
    prog,
    periodic,
    lktGroup: opts.lktGroup,
    lktFormat: opts.lktFormat,
    method,
    term,
    scope: periodic
      ? 'Áp dụng cho toàn bộ hình thức thanh toán'
      : `Tính cho hình thức ${method}${term ? ` ${term} tháng` : ''}${prog?.type === 'LKT' && opts.lktFormat ? ` · ${opts.lktGroup} – ${opts.lktFormat}` : ''}`,
    q(items, extra = {}) {
      return quote(data, { label: opts.label, program: opts.program, lktGroup: opts.lktGroup, lktFormat: opts.lktFormat,
        method, term, warranty: '', items, ...extra });
    },
  };
}

function giftFor(data, ctx, method, n) {
  const pm = findMethod(data, method);
  const rows = data.gifts.filter((g) => eq(g.label, ctx.label) && eq(g.program, ctx.program) && eq(g.method, pm?.giftGroup ?? method));
  const cap = Math.max(0, ...data.gifts.filter((g) => eq(g.label, ctx.label) && eq(g.program, ctx.program)).map((g) => g.milestone));
  return rows.find((g) => Number(g.milestone) === Math.min(n, cap)) ?? null;
}

// Thứ tự cột: Full → trả góp → hình thức có điều kiện nhận quà (trả giai đoạn) để cuối
function giftMethods(data, ctx) {
  const blocked = data.settings.labels.find((l) => eq(l.name, ctx.label))?.blockedMethods ?? [];
  const list = data.settings.paymentMethods.filter((m) => !blocked.some((b) => eq(b, m.name)));
  return [...list.filter((m) => !m.giftCondition), ...list.filter((m) => m.giftCondition)];
}

// Dòng CTKM của chương trình (đặc biệt / mở rộng) theo nhãn
function programRows(data, label, prog) {
  if (!prog) return [];
  const rows = prog.type === 'DAC_BIET' ? data.special : prog.type === 'MO_RONG' ? data.extended.filter((r) => eq(r.program, prog.name)) : [];
  return rows.filter((r) => eq(r.label, label));
}

/** Con số nổi bật cho trang bìa — tính từ dữ liệu, không nhập tay. */
function highlights(data, ctx) {
  const out = [];
  const type = ctx.prog?.type;
  let maxPct = 0;
  if (type === 'DINH_KY') maxPct = Math.max(0, ...data.periodic.filter((t) => eq(t.label, ctx.label)).map((t) => t.pct));
  else if (type === 'LKT') {
    const base = findProgram(data, findLktGroup(data, ctx.lktGroup)?.baseProgram);
    const cuts = lktFormatsFor(data, ctx.label, ctx.lktGroup).map((f) => f.cut);
    if (cuts.length) maxPct = Math.max(0, ...programRows(data, ctx.label, base).map((r) => r.pct)) - Math.min(...cuts);
  } else maxPct = Math.max(0, ...programRows(data, ctx.label, ctx.prog).map((r) => r.pct));
  if (maxPct > 0) out.push({ big: pct(maxPct), text: 'mức giảm học phí cao nhất' });
  if (type === 'DINH_KY') {
    const cb = Math.max(0, ...data.periodic.filter((t) => eq(t.label, ctx.label)).map((t) => t.cashback));
    if (cb) out.push({ big: num(cb), text: `đồng hoàn tiền — ${String(data.settings.docTexts?.cashbackLabel ?? '').toLowerCase()}` });
  }
  const gift = Math.max(0, ...data.gifts.filter((g) => eq(g.label, ctx.label) && eq(g.program, ctx.program)).map((g) => g.value));
  if (gift) out.push({ big: num(gift), text: 'đồng — bộ quà tặng giá trị nhất' });
  let voucher = 0;
  for (const cc of coursesForLabel(data, ctx.label))
    for (const mode of cc.modes) voucher = Math.max(voucher, ctx.q([{ code: cc.code, mode }]).lines[0]?.voucher ?? 0);
  if (voucher && out.length < 3) out.push({ big: num(voucher), text: 'đồng voucher khóa học đặc biệt' });
  return out.slice(0, 3);
}

// ---------------------------------------------------------------- Trang
function pageCover(data, ctx, brand, title) {
  const s = data.settings;
  const hl = highlights(data, ctx);
  return {
    cls: 'cover',
    html: `<div class="cv-l">
        <div class="kick">${brand.logoUrl ? `<img src="${esc(brand.logoUrl)}" alt="">` : 'Chương trình khuyến mãi'}</div>
        <div class="cv-main">
          <div class="cv-brand">${esc(brand.brandName)}</div>
          <div class="cv-title">${esc(title)}</div>
          <div class="cv-date">Áp dụng từ ${shortDate(s.validFrom)} đến ${shortDate(s.validTo)}</div>
        </div>
      </div>
      <div class="cv-r">
        <div class="cv-prog">${esc(ctx.program)}</div>
        <div class="cv-scope">${esc(ctx.scope)}</div>
        <div class="cv-hl">${hl.map((h) => `<div><b>${esc(h.big)}</b><span>${esc(h.text)}</span></div>`).join('')}</div>
      </div>`,
  };
}

function pageCourses(data, ctx) {
  const codes = coursesForLabel(data, ctx.label);
  if (!codes.length) return null;
  const rows = codes.map((cc) => {
    const off = data.courses.find((c) => eq(c.label, ctx.label) && eq(c.code, cc.code) && eq(c.mode, 'Offline'));
    const on = data.courses.find((c) => eq(c.label, ctx.label) && eq(c.code, cc.code) && eq(c.mode, 'Online'));
    const row = off ?? on; // tính theo khóa Offline nếu có
    const q = ctx.q([{ code: cc.code, mode: row.mode }]);
    return [{ html: `<b>${esc(cc.name)}</b>`, cls: 'left' }, esc(cc.code), esc(row.sessions || on?.sessions || ''), esc(off?.classSize || '—'),
      esc(on?.classSize || '—'), num(row.price), q.lines[0]?.voucher ? `-${num(q.lines[0].voucher)}` : '—',
      { html: q.ok ? num(q.afterPromo) : 'Không áp dụng', cls: 'hot' }];
  });
  return {
    kick: 'Bảng giá',
    h: 'Học phí từng khóa học',
    sub: `${ctx.program} · ${ctx.scope.toLowerCase()} · giá đăng ký 1 khóa, tính theo lớp Offline nếu có`,
    html: table({
      head: [H({ html: 'Khóa học', cls: 'left' }, 'Mã khóa', 'Thời lượng', 'Sĩ số Offline', 'Sĩ số Online', 'Giá gốc', 'Voucher', { html: 'Giá sau khuyến mại', cls: 'hot' })],
      rows,
      merge: [3, 4],
    }),
  };
}

function pagePromo(data, ctx) {
  const type = ctx.prog?.type;
  let main = '';
  let note = '';
  if (type === 'DINH_KY') {
    const tiers = data.periodic.filter((t) => eq(t.label, ctx.label)).sort((a, b) => a.from - b.from);
    if (tiers.length) {
      const max = Math.max(...tiers.map((t) => t.from));
      const cards = [];
      for (let n = 1; n <= max; n++) {
        const t = tiers.find((x) => x.from <= n && x.to >= n);
        const tone = n === max ? 'k' : n > max / 2 ? 'y' : '';
        cards.push(`<div class="card ${tone}"><div class="no">${two(n)}</div><div class="nm">${comboName(n, t?.to >= 99 ? n : null)}</div>
          <div class="big">${t ? pct(t.pct) : '—'}</div><div class="sm">${t?.cashback ? `Hoàn tiền ${num(t.cashback)}đ` : 'Giảm trực tiếp học phí'}</div></div>`);
      }
      main = `<div class="cards" style="grid-template-columns:repeat(${max},1fr)">${cards.join('')}</div>`;
      if (tiers.some((t) => t.cashback)) note = `Hoàn tiền: ${esc(data.settings.docTexts?.cashbackLabel ?? '')}.`;
    }
  } else if (type === 'LKT') {
    const group = findLktGroup(data, ctx.lktGroup);
    const base = findProgram(data, group?.baseProgram);
    const formats = lktFormatsFor(data, ctx.label, ctx.lktGroup);
    const rows = programRows(data, ctx.label, base);
    if (group && formats.length && rows.length) {
      main = table({
        head: [H('Hình thức thanh toán', 'Kỳ hạn', `% ${esc(base.name)}`, ...formats.map((f) => ({ html: `${esc(f.format)}<br><small>cắt ${pct(f.cut)}</small>`, cls: 'hot' })))],
        rows: rows.map((r) => [esc(r.method), Number(r.term) ? `${r.term} tháng` : 'Không kỳ hạn', pct(r.pct), ...formats.map((f) => ({ html: pct(r.pct - f.cut), cls: 'hot' }))]),
        merge: [0],
      });
      note = `${esc(group.name)}: % giảm = % chương trình ${esc(base.name)} trừ mức cắt của format liên kết trường.`;
    }
  } else {
    const rows = programRows(data, ctx.label, ctx.prog);
    if (rows.length)
      main = table({
        head: [H('Hình thức thanh toán', 'Kỳ hạn', { html: 'Giảm giá', cls: 'hot' }, 'Áp dụng')],
        rows: rows.map((r) => [esc(r.method), Number(r.term) ? `${r.term} tháng` : 'Không kỳ hạn', { html: pct(r.pct), cls: 'hot' }, esc(r.note)]),
        merge: [0, 3],
      });
  }
  // Voucher khóa học đặc biệt — chia 2 cột cho gọn
  const vouchers = [];
  for (const cc of coursesForLabel(data, ctx.label))
    for (const mode of cc.modes) {
      const v = ctx.q([{ code: cc.code, mode }]).lines[0]?.voucher ?? 0;
      if (v > 0) vouchers.push([{ html: `${esc(cc.name)}${cc.modes.length > 1 ? ` <span class="muted">${esc(mode)}</span>` : ''}`, cls: 'left' }, { html: `${num(v)}đ`, cls: 'hot' }]);
    }
  const half = Math.ceil(vouchers.length / 2);
  const vt = (rows) => table({ head: [H({ html: 'Khóa học', cls: 'left' }, { html: 'Voucher giảm thêm', cls: 'hot' })], rows });
  const voucherHtml = vouchers.length
    ? `<div class="sec">Quà tặng khóa học đặc biệt</div><div class="cols2">${vt(vouchers.slice(0, half))}${vt(vouchers.slice(half))}</div>`
    : '';
  if (!main && !voucherHtml) return null;
  return {
    kick: 'Chương trình khuyến mại',
    h: `Ưu đãi ${ctx.program}${type === 'DINH_KY' ? ' theo số khóa đăng ký' : ''}`,
    sub: ctx.scope,
    html: `${main}${note ? `<p class="note">${note}</p>` : ''}${voucherHtml}`,
  };
}

function pageGifts(data, ctx) {
  const all = data.gifts.filter((g) => eq(g.label, ctx.label) && eq(g.program, ctx.program));
  if (!all.length) return null;
  const max = Math.max(...all.map((g) => g.milestone));
  const methods = giftMethods(data, ctx);
  const head1 = [{ html: 'Khóa học', rowspan: 2, cls: 'left' }];
  const head2 = [];
  methods.forEach((m) => {
    if (m.giftCondition) {
      head1.push({ html: esc(m.docLabel), colspan: 2 });
      head2.push({ html: 'Quà tặng' }, { html: 'Điều kiện' });
    } else head1.push({ html: esc(m.docLabel), rowspan: 2 });
  });
  const rows = [];
  for (let n = 1; n <= max; n++) {
    const r = [{ html: `<b>${comboName(n, max)}</b>`, cls: 'left' }];
    for (const m of methods) {
      const g = giftFor(data, ctx, m.name, n);
      r.push(n === 1 && !m.allowSingle ? { html: 'Không áp dụng', cls: 'muted' } : g ? esc(g.content) : { html: '—', cls: 'muted' });
      if (m.giftCondition) r.push(g ? esc(m.giftCondition) : { html: '—', cls: 'muted' });
    }
    rows.push(r);
  }
  return {
    kick: 'Quà tặng',
    h: 'Quà tặng theo hình thức thanh toán',
    sub: `${ctx.program} · quà theo số khóa đăng ký`,
    html: table({ head: head2.length ? [head1, head2] : [head1], rows, merge: rows[0].map((_, i) => i).slice(1), cls: 't-tall' }),
  };
}

function pageGiftSets(data, ctx) {
  const used = new Set(data.gifts.filter((g) => eq(g.label, ctx.label) && eq(g.program, ctx.program)).map((g) => Number(g.value)));
  const sets = (data.settings.giftSets ?? []).filter((s) => eq(s.label, ctx.label) && (!used.size || used.has(Number(s.value))));
  if (!sets.length || !used.size) return null;
  sets.sort((a, b) => a.value - b.value);
  const cols = sets.length > 6 ? 4 : 3;
  return {
    kick: 'Quà tặng',
    h: 'Bộ quà tặng giá trị dành cho học viên',
    sub: 'Nội dung từng bộ quà trong bảng quà tặng theo hình thức thanh toán',
    html: `<div class="cards sets" style="grid-template-columns:repeat(${cols},1fr)">${sets
      .map((s, i) => `<div class="card ${i === sets.length - 1 ? 'k' : i % 3 === 1 ? 'y' : ''}"><div class="no">Bộ quà ${two(i + 1)}</div>
        <div class="big sm2">${num(s.value)}đ</div><ul>${String(s.items).split('\n').filter(Boolean).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`)
      .join('')}</div>`,
  };
}

function pageServices(data, ctx) {
  const t = data.settings.docTexts ?? {};
  const warranties = data.warranty.filter((w) => w.rate > 0);
  const services = (data.settings.services ?? []).filter((s) => eq(s.label, ctx.label));
  if (!warranties.length && !services.length) return null;
  const excluded = coursesForLabel(data, ctx.label).filter((c) => c.warranty === false).map((c) => c.name);
  const wHtml = warranties.length
    ? `<div class="sec">Gói bảo hành</div>
      <div class="cards" style="grid-template-columns:repeat(${warranties.length},1fr)">${warranties
        .map((w, i) => `<div class="card ${i === warranties.length - 1 ? 'k' : i ? 'y' : ''}"><div class="no">Bảo hành</div><div class="nm">${esc(w.name)}</div>
          <div class="big">${pct(w.rate)}</div><div class="sm">giá gốc khóa học / combo</div></div>`)
        .join('')}</div>
      <p class="note">Thời lượng: ${esc(t.warrantyDuration)} · Hình thức: ${esc(t.warrantyForm)}.${
        excluded.length ? `<br>Không tính phí bảo hành với các khóa ${esc(excluded.join(', '))}.` : ''}</p>`
    : '';
  const sHtml = services.length
    ? `<div class="sec">Dịch vụ học tập</div>${table({
        head: [H({ html: 'Sản phẩm', cls: 'left' }, 'Thời lượng', 'Hình thức', { html: 'Giá gốc', cls: 'hot' })],
        rows: services.map((s) => [{ html: esc(s.name), cls: 'left' }, esc(s.duration), esc(s.mode), { html: num(s.price), cls: 'hot' }]),
      })}`
    : '';
  return {
    kick: 'Dịch vụ cộng thêm',
    h: 'Gói bảo hành & dịch vụ học tập',
    sub: 'Bán kèm lộ trình khi khách có nhu cầu',
    html: `<div class="cols2 top"><div>${wHtml}</div><div>${sHtml}</div></div>`,
  };
}

function pageRoutes(data, ctx, output) {
  const routes = data.routes.filter((r) => eq(r.label, ctx.label) && eq(r.output, output));
  if (!routes.length) return null;
  const warranties = data.warranty.filter((w) => w.rate > 0);
  const methods = giftMethods(data, ctx).filter((m) => !m.citime);
  const showGifts = methods.some((m) => routes.some((r) => giftFor(data, ctx, m.name, r.items.length)));
  const head = [H({ html: 'Lộ trình', cls: 'left' }, 'Giá gốc', { html: 'Giá sau ưu đãi', cls: 'hot' },
    ...warranties.map((w) => `+ BH ${esc(w.name)}<br><small>${pct(w.rate)}</small>`),
    ...(showGifts ? methods.map((m) => `Quà ${lines(m.docShort.replace(/^Đóng |^Trả /, (x) => x.toLowerCase()))}`) : []))];
  const rows = [];
  for (const n of [...new Set(routes.map((r) => r.items.length))].sort((a, b) => a - b)) {
    rows.push({ group: comboName(n) });
    for (const r of routes.filter((x) => x.items.length === n)) {
      const q = ctx.q(r.items);
      rows.push([
        { html: esc(r.name), cls: 'left' }, num(q.gross),
        q.ok ? { html: num(q.afterPromo), cls: 'hot' } : { html: 'Không áp dụng', cls: 'muted' },
        ...warranties.map((w) => (q.ok ? num(ctx.q(r.items, { warranty: w.name }).final) : '—')),
        ...(showGifts
          ? methods.map((m) => {
              const g = giftFor(data, ctx, m.name, n);
              return g ? { html: esc(g.content), key: `${n}|${m.name}|${g.content}`, cls: 'gift' } : { html: '—', key: `${n}|${m.name}|-`, cls: 'muted' };
            })
          : []),
      ]);
    }
  }
  return {
    kick: `Lộ trình gợi ý · Đầu ra ${output}`,
    h: `Bảng giá lộ trình đầu ra IELTS ${output}`,
    sub: `${ctx.program} · ${ctx.scope.toLowerCase()}`,
    html: table({ head, rows, merge: showGifts ? methods.map((_, i) => 3 + warranties.length + i) : [], cls: 't-routes' }) +
      (data.settings.docTexts?.routeNote ? `<p class="note">* ${esc(data.settings.docTexts.routeNote)}</p>` : ''),
  };
}

function pageCitime(data, ctx) {
  const citime = data.settings.paymentMethods.find((m) => m.citime);
  const blocked = data.settings.labels.find((l) => eq(l.name, ctx.label))?.blockedMethods ?? [];
  if (!citime || blocked.some((b) => eq(b, citime.name))) return null;
  // Combo có Module A/B không cần tra (theo lưu ý) → bỏ khỏi bảng cho gọn
  const skip = new Set(data.settings.courseCodes.filter((c) => /^M[AB]$/.test(c.short)).map((c) => c.short));
  const list = data.citimeRoutes.filter(
    (r) => eq(r.label, ctx.label) && eq(r.status, 'Áp dụng') && !String(r.code).split('_').some((x) => skip.has(x)),
  );
  if (!list.length) return null;
  const groups = [...new Set(list.map((r) => r.group))];
  const cols = groups.map((g) => {
    const rows = [];
    const items = list.filter((r) => r.group === g);
    for (const n of [...new Set(items.map((r) => r.count))].sort((a, b) => a - b)) {
      rows.push({ group: comboName(n) });
      items.filter((r) => r.count === n).forEach((r) => rows.push([{ html: esc(r.name), cls: 'left' }, { html: `${r.maxTerm} tháng`, cls: 'hot' }]));
    }
    return `<div><div class="sec">${esc(g)}</div>${table({ head: [H({ html: 'Lộ trình', cls: 'left' }, { html: 'Kỳ hạn tối đa', cls: 'hot' })], rows, cls: 't-tight' })}</div>`;
  });
  return {
    kick: 'Phụ lục',
    h: 'Thời hạn trả góp Citime tối đa theo lộ trình',
    sub: `Kỳ hạn Citime: ${citime.terms.join(' / ')} tháng`,
    html: `<div class="cols2 top" style="grid-template-columns:repeat(${Math.min(groups.length, 3)},1fr)">${cols.join('')}</div>${
      data.settings.docTexts?.citimeNote ? `<p class="note warn">Lưu ý: ${esc(data.settings.docTexts.citimeNote)}</p>` : ''}`,
  };
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
  const add = (id, p) => on.has(id) && p && pages.push(p);
  add('cover', pageCover(data, ctx, brand, title));
  add('courses', pageCourses(data, ctx));
  add('promo', pagePromo(data, ctx));
  add('gifts', pageGifts(data, ctx));
  add('giftSets', pageGiftSets(data, ctx));
  add('services', pageServices(data, ctx));
  if (on.has('routes'))
    for (const o of opts.outputs?.length ? opts.outputs : outputsFor(data, opts.label)) add('routes', pageRoutes(data, ctx, o));
  add('citime', pageCitime(data, ctx));
  return { html: renderDocument({ data, brand, title, pages }), pages: pages.length, title };
}

// ---------------------------------------------------------------- Màu
const hex = (h) => String(h || '#000').replace('#', '').padEnd(6, '0');
const rgb = (h) => [0, 2, 4].map((i) => parseInt(hex(h).slice(i, i + 2), 16));
const lum = (h) => {
  const [r, g, b] = rgb(h).map((v) => v / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const mix = (a, b, t) => `#${rgb(a).map((v, i) => Math.round(v + (rgb(b)[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;

function renderDocument({ data, brand, title, pages }) {
  const s = data.settings;
  const main = brand.bg || '#F0C030';
  // bg2 cũ là nền tia sáng vàng → nếu đậm thì dùng nền kem mặc định
  const paper = brand.bg2 && lum(brand.bg2) > 0.9 ? brand.bg2 : '#FFFCF2';
  const ink = brand.ink || '#161513';
  const onMain = lum(main) > 0.55 ? ink : '#FFFFFF';
  const kick = lum(main) > 0.55 ? mix(main, '#000000', 0.5) : main;
  const footer = `${esc(brand.brandName)} · Chương trình khuyến mãi ${monthOf(data)} · ${shortDate(s.validFrom)} – ${shortDate(s.validTo)}`;
  const body = pages
    .map((p, i) =>
      p.cls === 'cover'
        ? `<section class="page cover">${p.html}</section>`
        : `<section class="page"><div class="inner">
            <div class="kick">${two(i)} · ${esc(p.kick)}</div>
            <h2>${esc(p.h)}</h2>${p.sub ? `<div class="sub">${esc(p.sub)}</div>` : ''}
            <main>${p.html}</main></div>
            <footer><span>${footer}</span><span>${String(brand.footer || '').split('\n').map(esc).join(' · ')}</span><b>${i + 1}</b></footer></section>`,
    )
    .join('');
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
@page { size: A4 landscape; margin: 0; }
:root { --main: ${main}; --paper: ${paper}; --ink: ${ink}; --on-main: ${onMain}; --kick: ${kick}; --accent: ${brand.accent || '#C8102E'};
  --beige: ${mix(paper, '#8a7f5c', 0.1)}; --line: ${mix(paper, '#000000', 0.16)}; --tint: ${mix(main, '#FFFFFF', 0.78)}; --muted: #8a8577; }
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
html, body { margin: 0; }
body { font-family: 'Be Vietnam Pro', system-ui, sans-serif; color: var(--ink); background: #77746c; }
.page { width: 297mm; height: 210mm; margin: 0 auto 14px; position: relative; overflow: hidden; background: var(--paper);
  break-after: page; page-break-after: always; box-shadow: 0 6px 24px rgba(0,0,0,.25); }
.page:last-child { break-after: auto; page-break-after: auto; }
.page:not(.cover)::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 5mm; background: var(--main); }
.inner { padding: 13mm 16mm 16mm 22mm; height: 100%; display: flex; flex-direction: column; }
.kick { font-size: 11px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: var(--kick); }
h2 { font-size: 30px; font-weight: 800; letter-spacing: -.015em; margin: 4px 0 2px; line-height: 1.15; }
.sub { font-size: 12.5px; color: var(--muted); margin-bottom: 12px; }
main { flex: 1; }
.sec { font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: var(--kick); margin: 16px 0 7px; }
main > .sec:first-child, .cols2 > div > .sec:first-child { margin-top: 2px; }
.note { font-size: 11px; color: #5d594f; margin: 9px 0 0; line-height: 1.5; }
.note.warn { color: var(--accent); }
.muted { color: var(--muted); }
.cols2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.cols2.top { align-items: start; gap: 22px; }

/* Bảng: tiêu đề nền tối, dòng xen kẽ, cột nhấn màu nhãn */
.t { width: 100%; border-collapse: collapse; font-size: 11.5px; line-height: 1.35; background: #fff; }
.t th { background: var(--ink); color: #fff; font-weight: 700; padding: 7px 9px; text-align: center; border: 1px solid var(--ink); }
.t th.hot { color: var(--main); }
.t th small { font-weight: 500; opacity: .8; }
.t td { padding: 6px 9px; border: 1px solid var(--line); text-align: center; vertical-align: middle; }
.t tbody tr:nth-child(even) td { background: var(--beige); }
.t .left { text-align: left; }
.t td.hot { background: var(--tint) !important; font-weight: 800; }
.t td.gift { font-size: 10.5px; }
.t tr.grp td { background: var(--ink) !important; color: var(--main); font-weight: 800; text-align: left; font-size: 10.5px;
  letter-spacing: .06em; text-transform: uppercase; padding: 4px 9px; }
.t-routes { font-size: 10.5px; }
.t-routes td, .t-routes th { padding: 4px 7px; }
.t-tight td { padding: 4px 8px; }
.t-tall td { padding: 11px 9px; }

/* Thẻ: be viền trên tối · màu nhãn · tối */
.cards { display: grid; gap: 10px; }
.card { background: var(--beige); border-top: 4px solid var(--ink); padding: 12px 13px 13px; min-height: 120px; display: flex; flex-direction: column; }
.card.y { background: var(--main); border-top-color: var(--main); color: var(--on-main); }
.card.k { background: var(--ink); border-top-color: var(--ink); color: #fff; }
.card .no { font-size: 11px; font-weight: 800; color: var(--kick); letter-spacing: .04em; }
.card.y .no { color: var(--on-main); opacity: .65; }
.card.k .no, .card.k .nm { color: var(--main); }
.card .nm { font-size: 15px; font-weight: 800; margin-top: 4px; }
.card .big { font-size: 38px; font-weight: 900; letter-spacing: -.02em; margin-top: auto; line-height: 1.05; }
.card .big.sm2 { font-size: 24px; margin-top: 6px; }
.card .sm { font-size: 11.5px; margin-top: 4px; opacity: .85; }
.card ul { margin: 8px 0 0; padding-left: 16px; font-size: 11.5px; line-height: 1.55; }
.sets .card { min-height: 0; }

/* Bìa: mảng tối + mảng màu nhãn */
.cover { display: grid; grid-template-columns: 68% 32%; }
.cv-l { background: var(--ink); color: var(--paper); padding: 20mm 18mm 18mm 20mm; display: flex; flex-direction: column; }
.cv-l .kick { color: var(--main); font-size: 13px; letter-spacing: .2em; }
.cv-l .kick img { height: 34px; }
.cv-main { margin-top: auto; }
.cv-brand { font-size: 64px; font-weight: 900; letter-spacing: -.02em; line-height: 1; }
.cv-title { font-size: 19px; font-weight: 700; margin-top: 16px; color: var(--main); text-transform: uppercase; line-height: 1.3; }
.cv-date { font-size: 15px; margin-top: 8px; opacity: .8; }
.cv-r { background: var(--main); color: var(--on-main); padding: 20mm 14mm 18mm; display: flex; flex-direction: column; }
.cv-prog { font-size: 34px; font-weight: 900; line-height: 1.05; letter-spacing: -.02em; }
.cv-scope { font-size: 12.5px; font-weight: 600; margin-top: 8px; opacity: .8; }
.cv-hl { margin-top: auto; display: grid; gap: 14px; }
.cv-hl div { border-top: 2px solid currentColor; padding-top: 8px; }
.cv-hl b { display: block; font-size: 30px; font-weight: 900; letter-spacing: -.02em; }
.cv-hl span { font-size: 12px; font-weight: 600; }

footer { position: absolute; left: 22mm; right: 16mm; bottom: 7mm; display: flex; gap: 18px; font-size: 10px; color: var(--muted); }
footer span:nth-child(2) { flex: 1; text-align: right; }
footer b { color: var(--ink); }
@media print { body { background: none; } .page { margin: 0; box-shadow: none; } }
</style>
<script>
// Trang nhiều dòng hơn khổ giấy (VD admin thêm lộ trình) → tự co nội dung cho vừa 1 trang thay vì tràn sang trang mới
function fitPages() {
  document.querySelectorAll('.page .inner').forEach(function (inner) {
    inner.style.zoom = ''; inner.style.width = '';
    var r = inner.clientHeight / inner.scrollHeight;
    if (r < 1) { inner.style.zoom = r; inner.style.width = (100 / r) + '%'; inner.style.height = (100 / r) + '%'; }
  });
}
window.addEventListener('load', function () { (document.fonts ? document.fonts.ready : Promise.resolve()).then(fitPages); });
</script></head><body>${body}</body></html>`;
}
