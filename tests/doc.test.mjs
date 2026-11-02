// Đối chiếu số liệu ấn phẩm PDF với ấn phẩm IELTS Mentor tháng 11/2026 (cùng bộ dữ liệu gốc). Chạy: node tests/doc.test.mjs
import seed from '../src/data/seed.js';
import { normalizeData } from '../src/engine/pricing.js';
import { buildPromoDoc } from '../src/doc/promo-doc.js';

const data = normalizeData(JSON.parse(JSON.stringify(seed)));
const doc = buildPromoDoc(data, { label: 'IELTS Mentor', program: 'Định kỳ' });
const text = doc.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

const expect = {
  'Giá sau KM từng khóa (trang 1)': ['1.540.000', '5.695.000', '8.330.000', '9.775.000', '14.025.000', '20.825.000', '2.275.000', '8.750.000'],
  'Đầu ra 5.5+': ['19.700.000', '20.645.000', '21.275.000', '22.220.000', '27.710.000', '33.336.000', '36.900.000', '38.080.000', '39.260.000', '44.020.000'],
  'Đầu ra 6.5+': ['24.280.000', '19.140.000', '31.430.000', '30.020.000', '38.182.000', '38.030.000', '41.420.000', '43.396.000', '46.700.000', '42.560.000', '49.060.000', '55.140.000'],
  'Đầu ra 7.0+': ['30.360.000', '41.050.000', '54.236.000', '57.350.000', '59.710.000', '66.550.000'],
  'CTKM + voucher': ['Hoàn tiền 800.000đ', 'Hoàn tiền 2.500.000đ', '6.000.000đ', '1.300.000đ'],
  'Quà tặng': ['Bộ quà tặng trị giá 6.770.000đ', '100% phí lãi suất trả góp', 'Hoàn thành tối thiểu 40% học phí trong tháng', 'Bình nước IELTS MENTOR'],
  'Tiêu đề': ['CHƯƠNG TRÌNH KHUYẾN MÃI IELTS MENTOR - THÁNG 11/2026', 'Áp dụng từ 1/11/2026 đến 30/11/2026', 'Mừng ngày Nhà giáo Việt Nam', 'Thời hạn trả góp Citime tối đa', 'mức giảm học phí cao nhất', '30%'],
};
let bad = 0;
for (const [name, list] of Object.entries(expect)) {
  const miss = list.filter((v) => !text.includes(v));
  console.log(`${miss.length ? '✗' : '✓'} ${name}${miss.length ? ` — thiếu: ${miss.join(', ')}` : ''}`);
  bad += miss.length;
}
console.log(`Số trang: ${doc.pages}`);

// ---- Định kỳ đặc biệt: đối chiếu ấn phẩm "CTKM ĐỊNH KỲ ĐẶC BIỆT IELTS MENTOR THÁNG 11_2026"
const sp = buildPromoDoc(data, { label: 'IELTS Mentor', program: 'Định kỳ đặc biệt' });
const spText = sp.html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const spExpect = {
  'ĐB · bảng ưu đãi': ['Hoàn thành toàn bộ trong tháng', 'Chia giai đoạn', 'Trả góp ngân hàng', 'Trả góp Citime', 'Toàn bộ các khóa học',
    'Combo từ 2 khoá trở lên', '37%', '33%', 'Quy định tham gia chương trình'],
  'ĐB · giá từng khóa': ['940.000', '4.020.000', '5.880.000', '6.900.000', '9.900.000', '14.700.000', '1.400.000', '5.000.000'],
  'ĐB · kịch bản': ['Đóng Full · Giảm 40%', 'Trả góp Sacombank 9 & 12 tháng · Giảm 36%', 'Trả góp Citime 8 & 9 tháng · Giảm 34%', 'Trả góp Citime 12 & 15 tháng · Giảm 33%'],
  'ĐB · đầu ra 5.5+': ['16.300.000', '17.245.000', '18.820.000', '17.700.000', '20.220.000', '25.990.000', '33.021.000', '34.980.000', '39.726.000', '44.486.000'],
  'ĐB · đầu ra 7.0+': ['24.600.000', '34.500.000', '27.060.000', '59.501.000', '66.341.000'],
};
for (const [name, list] of Object.entries(spExpect)) {
  const miss = list.filter((v) => !spText.includes(v));
  console.log(`${miss.length ? '✗' : '✓'} ${name}${miss.length ? ` — thiếu: ${miss.join(', ')}` : ''}`);
  bad += miss.length;
}
console.log(`Định kỳ đặc biệt: ${sp.pages} trang`);

// Các chương trình khác vẫn dựng được
for (const opts of [
  { label: 'IELTS Mentor', program: 'Định kỳ đặc biệt', method: 'Sacombank', term: 12 },
  { label: 'IELTS Mentor', program: 'Liên kết trường', lktGroup: 'LKT Thấp điểm', lktFormat: 'Format 1', method: 'Full', term: 0 },
  { label: 'CLASSUP 1-1', program: 'Vũ Đài Trí Tuệ', method: 'Full', term: 0 },
]) {
  const d = buildPromoDoc(data, opts);
  console.log(`✓ ${opts.label} · ${opts.program}: ${d.pages} trang`);
}
process.exit(bad ? 1 : 0);
