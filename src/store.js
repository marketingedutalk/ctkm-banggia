// Lớp lưu trữ dữ liệu gốc. UI chỉ gọi load() / save() / reset() nên có thể thay backend tùy portal.
// Dữ liệu gốc là 1 tài liệu JSON (~100KB) — đơn giản để version hóa và rollback.

const clone = (o) => JSON.parse(JSON.stringify(o));
const LOCAL_KEY = 'edutalk-promo-tool:data';

/** Bản demo: lưu trong trình duyệt (mỗi máy một bản). Không dùng cho production. */
export function localStore(seed) {
  return {
    kind: 'local',
    async load() {
      try {
        const raw = localStorage.getItem(LOCAL_KEY);
        if (raw) return JSON.parse(raw);
      } catch {}
      return clone(seed);
    },
    async save(doc) {
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(doc));
      } catch {}
    },
    async reset() {
      try {
        localStorage.removeItem(LOCAL_KEY);
      } catch {}
      return clone(seed);
    },
  };
}

/** Supabase: bảng promo_config (xem supabase/schema.sql). RLS: ai đăng nhập cũng đọc, chỉ admin ghi. */
export function supabaseStore(supabase, seed, { key = 'current' } = {}) {
  return {
    kind: 'supabase',
    async load() {
      const { data, error } = await supabase.from('promo_config').select('data').eq('key', key).maybeSingle();
      if (error) throw error;
      return data?.data ?? clone(seed);
    },
    async save(doc) {
      const { error } = await supabase.from('promo_config').upsert({ key, data: doc });
      if (error) throw error;
    },
    async reset() {
      return clone(seed);
    },
  };
}

/** REST bất kỳ: GET url → JSON, PUT url ← JSON. Dùng khi portal có backend riêng (Laravel/Node...). */
export function restStore(url, seed, { headers = {} } = {}) {
  return {
    kind: 'rest',
    async load() {
      const res = await fetch(url, { headers, credentials: 'include' });
      if (res.status === 404) return clone(seed);
      if (!res.ok) throw new Error(`Tải dữ liệu lỗi ${res.status}`);
      return res.json();
    },
    async save(doc) {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...headers },
        credentials: 'include',
        body: JSON.stringify(doc),
      });
      if (!res.ok) throw new Error(`Lưu dữ liệu lỗi ${res.status}`);
    },
    async reset() {
      return clone(seed);
    },
  };
}
