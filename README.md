# Công cụ tính giá khuyến mại — Edutalk

Chuyển file Excel **"CÔNG CỤ TÍNH GIÁ KHUYẾN MẠI.xlsx"** thành module web 2 vai trò:

| Vai trò | Thấy gì | Làm gì |
|---|---|---|
| **Sale / TVV** | Tab *Tính giá*, *Bảng giá lộ trình* | Bấm chọn Nhãn → Chương trình → HTTT → Kỳ hạn → Bảo hành, tích chọn khóa (Online/Offline) → ra học phí cuối, quà tặng, trạng thái hợp lệ; *Sao chép báo giá* để gửi Zalo |
| **Admin** | Thêm tab *Quản trị dữ liệu gốc* | Sửa trực tiếp 14 bảng (giá gốc, voucher, CTKM, quà, Citime, lộ trình...), nhập lại từ Excel/JSON, *Lưu & áp dụng* |

Engine tính giá được đối chiếu với giá trị Excel đã tính sẵn: **574/574 ca khớp** (`npm test`).

## Chạy thử

```bash
node scripts/serve.mjs
```

Mở http://localhost:5180 (thêm `?role=admin` để vào thẳng vai trò admin). Bản demo lưu dữ liệu trong trình duyệt và có nút đổi vai trò ở góc phải.

## Cấu trúc

```
src/engine/pricing.js   Engine tính giá thuần JS (không phụ thuộc framework) — quote(), routeTable(), validateData()
src/data/seed.js        Dữ liệu gốc sinh từ file Excel (scripts/import_excel.py)
src/store.js            Lớp lưu trữ: localStore (demo) | supabaseStore | restStore
src/ui/app.js           Giao diện: mountPromoTool(element, options)
src/ui/admin-tables.js  Khai báo cột của từng bảng admin (thêm cột/bảng chỉ sửa ở đây)
src/ui/excel-import.js  Admin nhập file Excel cùng mẫu ngay trên web
src/ui/styles.css       Toàn bộ class có tiền tố pt- → nhúng vào portal không đụng CSS cũ
supabase/schema.sql     Bảng promo_config + lịch sử + RLS (mọi người đọc, chỉ admin ghi)
tests/engine.test.mjs   Đối chiếu engine với Excel
```

## Nhúng vào portal nội bộ

Module là ES module thuần, nhúng được vào Vue, React hay trang server-render.

1. Chép thư mục `src/` vào dự án portal (VD `src/modules/promo-tool/`).
2. Chạy `supabase/schema.sql`, rồi thêm admin: `insert into promo_admins ...` (cuối file). Nếu portal đã có bảng vai trò, sửa hàm `promo_is_admin()` theo bảng đó.
3. Tạo route/menu mới (VD *Hành chính → Công cụ tính giá KM*) và mount:

**Vue 3**
```vue
<template><div ref="el" /></template>
<script setup>
import { ref, onMounted } from 'vue';
import '@/modules/promo-tool/ui/styles.css';
import seed from '@/modules/promo-tool/data/seed.js';
import { supabaseStore } from '@/modules/promo-tool/store.js';
import { mountPromoTool } from '@/modules/promo-tool/ui/app.js';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth';

const el = ref();
const auth = useAuthStore();
onMounted(() => mountPromoTool(el.value, {
  role: auth.isAdmin ? 'admin' : 'sale',   // lấy từ tài khoản đăng nhập
  store: supabaseStore(supabase, seed),
  user: auth.user,
}));
</script>
```

**React**
```jsx
useEffect(() => {
  mountPromoTool(ref.current, { role: isAdmin ? 'admin' : 'sale', store: supabaseStore(supabase, seed), user });
}, []);
```

**Portal có backend riêng (không dùng Supabase):** dùng `restStore('/api/promo-config', seed)` — backend chỉ cần `GET` trả JSON và `PUT` nhận JSON (kiểm tra quyền admin ở server).

> Vai trò ở giao diện chỉ để ẩn/hiện tab. Quyền ghi thật sự do RLS (`promo_is_admin()`) hoặc backend kiểm soát — sale có sửa code trình duyệt cũng không lưu được.

Giao diện dùng font của portal (`font-family: inherit`), màu tím `#4b2a9b` theo menu Hành chính. Đổi màu ở biến `--pt-*` đầu `styles.css`.

## Cập nhật dữ liệu hằng tháng

- **Sửa trên web:** Admin → chọn bảng → sửa ô → *Lưu & áp dụng*. Có cảnh báo khi trùng khóa, giá ≤ 0, % ngoài 0–100.
- **Nhập lại từ Excel:** giữ đúng tên sheet/cột như file gốc → *Nhập từ Excel* → kiểm tra → *Lưu & áp dụng*. Phần *Cấu hình* (chương trình, HTTT, nhãn, mã khóa) được giữ nguyên.
- **Thêm chương trình mới** (VD "Back to school"): *Danh sách chương trình* → thêm dòng loại `MO_RONG` → nhập % ở *CTKM mở rộng* và voucher riêng ở *Voucher theo CTKM*. Không cần sửa code.

## Logic tính (giữ nguyên Excel sheet 12_CALCULATOR_SALE)

```
Giá sau KM   = Tổng giá gốc − Tổng giá gốc × %CTKM − Hoàn tiền − Tổng voucher
Phí bảo hành = Giá tính BH × %BH        (Giá tính BH = tổng giá gốc trừ các khóa bỏ tick "Tính BH")
Học phí cuối = Giá sau KM + Phí bảo hành
```

| Chương trình | % giảm lấy từ |
|---|---|
| Định kỳ (`DINH_KY`) | CTKM định kỳ theo số khóa + hoàn tiền + quà tặng |
| Định kỳ đặc biệt (`DAC_BIET`) | CTKM đặc biệt theo HTTT + kỳ hạn |
| Liên kết trường (`LKT`) | % của **chương trình nền** theo Nhóm LKT − mức cắt của Format (bảng *Format liên kết trường*). VD *LKT Thấp điểm* → % Thấp điểm − cắt; *LKT Toàn hệ thống* → % Định kỳ đặc biệt − cắt. Voucher cũng lấy theo chương trình nền. Ánh xạ nhóm → chương trình nền sửa ở *Cấu hình → Nhóm LKT* |
| Thấp điểm / VP mới / Vũ Đài Trí Tuệ (`MO_RONG`) | CTKM mở rộng; voucher lấy từ *Voucher theo CTKM* |

Kiểm tra trạng thái theo đúng thứ tự công thức `IFS` của Excel. Thêm 3 kiểm tra mà Excel đang bỏ sót:
- khóa không có hình thức đã chọn (Excel báo "KHÔNG TÌM THẤY" trong ô nhưng trạng thái vẫn OK);
- Định kỳ đặc biệt / LKT không có dòng % khớp (Excel âm thầm tính 0%);
- giá sau KM âm → "LỖI GIÁ".

So khớp tên không phân biệt hoa thường giống Excel ("Vũ Đài Trí Tuệ" = "Vũ đài trí tuệ").

## Sinh lại dữ liệu gốc từ Excel

```bash
pip install openpyxl
python scripts/import_excel.py "CÔNG CỤ TÍNH GIÁ KHUYẾN MẠI.xlsx"
npm test
```
