// Lớp lưu trữ dữ liệu gốc THEO THÁNG. Mỗi tháng ('YYYY-MM') là 1 tài liệu JSON riêng (~100KB):
// tháng cũ được giữ nguyên làm lưu trữ, tháng chưa tạo thì trống. UI chỉ gọi các hàm dưới nên thay backend tùy portal:
//   listMonths() → ['2026-11', '2026-10', ...] (mới nhất trước)
//   load(month)  → tài liệu hoặc null nếu tháng đó chưa có chương trình
//   save(month, doc)
//   seed()       → dữ liệu gốc ban đầu (từ file Excel) để tạo tháng đầu tiên

const clone = (o) => JSON.parse(JSON.stringify(o));
const MONTH_RE = /^\d{4}-\d{2}$/;
const sortDesc = (a) => [...new Set(a)].filter((m) => MONTH_RE.test(m)).sort().reverse();

/** Tháng của tài liệu theo ngày bắt đầu áp dụng (dùng khi chuyển dữ liệu cũ chưa chia tháng). */
export const monthOfDoc = (doc) => String(doc?.settings?.validFrom ?? '').slice(0, 7);

/** Bản demo: lưu trong trình duyệt (mỗi máy một bản). Không dùng cho production. */
export function localStore(seed) {
  const key = (m) => `edutalk-promo-tool:month:${m}`;
  const INDEX = 'edutalk-promo-tool:months';
  const get = (k) => {
    try {
      const raw = localStorage.getItem(k);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };
  const set = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  };
  const months = () => sortDesc(get(INDEX) ?? []);
  // Lần đầu: chuyển bản cũ (1 tài liệu chung) hoặc dữ liệu từ Excel thành tháng đầu tiên
  if (!months().length) {
    const legacy = get('edutalk-promo-tool:data');
    const first = legacy ?? clone(seed);
    const m = monthOfDoc(first);
    if (MONTH_RE.test(m)) {
      set(key(m), first);
      set(INDEX, [m]);
    }
  }
  return {
    kind: 'local',
    async listMonths() {
      return months();
    },
    async load(month) {
      return get(key(month));
    },
    async save(month, doc) {
      set(key(month), doc);
      set(INDEX, sortDesc([...months(), month]));
    },
    async seed() {
      return clone(seed);
    },
  };
}

/** Supabase: bảng promo_config, mỗi tháng 1 dòng key = 'YYYY-MM' (xem supabase/schema.sql). */
export function supabaseStore(supabase, seed) {
  return {
    kind: 'supabase',
    async listMonths() {
      const { data, error } = await supabase.from('promo_config').select('key');
      if (error) throw error;
      return sortDesc((data ?? []).map((r) => r.key));
    },
    async load(month) {
      const { data, error } = await supabase.from('promo_config').select('data').eq('key', month).maybeSingle();
      if (error) throw error;
      return data?.data ?? null;
    },
    async save(month, doc) {
      const { error } = await supabase.from('promo_config').upsert({ key: month, data: doc });
      if (error) throw error;
    },
    async seed() {
      return clone(seed);
    },
  };
}

/** REST bất kỳ: GET {url} → ['YYYY-MM', ...]; GET/PUT {url}/{YYYY-MM} → tài liệu (404 = chưa có). */
export function restStore(url, seed, { headers = {} } = {}) {
  const req = async (path, init = {}) => fetch(`${url}${path}`, { credentials: 'include', ...init, headers: { ...headers, ...init.headers } });
  return {
    kind: 'rest',
    async listMonths() {
      const res = await req('');
      if (!res.ok) throw new Error(`Tải danh sách tháng lỗi ${res.status}`);
      return sortDesc(await res.json());
    },
    async load(month) {
      const res = await req(`/${month}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Tải dữ liệu lỗi ${res.status}`);
      return res.json();
    },
    async save(month, doc) {
      const res = await req(`/${month}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(doc) });
      if (!res.ok) throw new Error(`Lưu dữ liệu lỗi ${res.status}`);
    },
    async seed() {
      return clone(seed);
    },
  };
}
