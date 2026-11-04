// Logo có sẵn trong dự án (src/assets/brand). Dữ liệu chỉ lưu khóa, VD 'classup/ngang-am-ban';
// đường dẫn thật được tính lúc dựng ấn phẩm nên chạy đúng ở cả bản demo lẫn khi nhúng vào portal.
// Ô logo cũng nhận link ảnh bất kỳ (https://...) nếu cần logo khác.

export const BRAND_ASSETS = {
  'classup/ngang-am-ban': { name: 'ClassUp · ngang · âm bản (chữ trắng, biểu tượng cam)', file: 'classup/ngang-am-ban.png' },
  'classup/ngang-mau': { name: 'ClassUp · ngang · màu (chữ xanh, biểu tượng cam)', file: 'classup/ngang-mau.png' },
  'classup/ngang-trang': { name: 'ClassUp · ngang · trắng', file: 'classup/ngang-trang.png' },
  'classup/doc-am-ban': { name: 'ClassUp · dọc · âm bản', file: 'classup/doc-am-ban.png' },
  'classup/doc-mau': { name: 'ClassUp · dọc · màu', file: 'classup/doc-mau.png' },
  'classup/doc-trang': { name: 'ClassUp · dọc · trắng', file: 'classup/doc-trang.png' },
  'classup/ecoach-am-ban': { name: 'ClassUp Powered by ECoach · âm bản', file: 'classup/ecoach-am-ban.webp' },
  'classup/ecoach-mau': { name: 'ClassUp Powered by ECoach · màu', file: 'classup/ecoach-mau.webp' },
  'classup/ecoach-trang': { name: 'ClassUp Powered by ECoach · trắng', file: 'classup/ecoach-trang.webp' },
  'classup/bieu-tuong-cam': { name: 'ClassUp · biểu tượng cam', file: 'classup/bieu-tuong-cam.png' },
  'classup/bieu-tuong-xanh': { name: 'ClassUp · biểu tượng xanh', file: 'classup/bieu-tuong-xanh.png' },
  'classup/bieu-tuong-trang': { name: 'ClassUp · biểu tượng trắng', file: 'classup/bieu-tuong-trang.png' },
  'classup/bieu-tuong-den': { name: 'ClassUp · biểu tượng đen', file: 'classup/bieu-tuong-den.png' },
  'classup/bieu-tuong-xam': { name: 'ClassUp · biểu tượng xám', file: 'classup/bieu-tuong-xam.png' },
};

/** Khóa logo → đường dẫn file; link ảnh nhập tay giữ nguyên; rỗng → ''. */
export function assetUrl(key) {
  const k = String(key ?? '').trim();
  const a = BRAND_ASSETS[k];
  return a ? new URL(`../assets/brand/${a.file}`, import.meta.url).href : k;
}
