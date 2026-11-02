// Thông tin chỉ dùng cho ấn phẩm PDF (không ảnh hưởng cách tính giá), lấy từ ấn phẩm IELTS Mentor tháng 11/2026.
// normalizeData() bổ sung các trường này khi dữ liệu đã lưu chưa có; sau đó admin sửa trong tab Quản trị.

// Số buổi + sĩ số theo từng dòng khóa học (Nhãn|Mã khóa|Hình thức). "" = không mở hình thức đó.
export const COURSE_DOC_INFO = {
  'IELTS Mentor|Module A|Online': { sessions: '5 buổi', classSize: '10-12 học viên' },
  'IELTS Mentor|Module B|Online': { sessions: '5 buổi', classSize: '10-12 học viên' },
  'IELTS Mentor|BS|Offline': { sessions: '20 buổi', classSize: '≥ 20 học viên' },
  'IELTS Mentor|BS|Online': { sessions: '20 buổi', classSize: '6-8 học viên' },
  'IELTS Mentor|PRE|Offline': { sessions: '26 buổi', classSize: '≥ 18 học viên' },
  'IELTS Mentor|PRE|Online': { sessions: '26 buổi', classSize: '6-8 học viên' },
  'IELTS Mentor|IE4.5|Offline': { sessions: '26 buổi', classSize: '≥ 18 học viên' },
  'IELTS Mentor|IE4.5|Online': { sessions: '26 buổi', classSize: '6-8 học viên' },
  'IELTS Mentor|IE6.5(M1)|Offline': { sessions: '36 buổi', classSize: '≥ 18 học viên' },
  'IELTS Mentor|IE6.5(M1)|Online': { sessions: '36 buổi', classSize: '6-8 học viên' },
  'IELTS Mentor|IE6.5(M2)|Offline': { sessions: '38 buổi', classSize: '≥ 18 học viên' },
  'IELTS Mentor|IE6.5(M2)|Online': { sessions: '38 buổi', classSize: '6-8 học viên' },
  'IELTS Mentor|IE7.0|Online': { sessions: '32 buổi', classSize: '6-8 học viên' },
  'IELTS Mentor|BT5.5|Online': { sessions: '6 buổi', classSize: '18-20 học viên' },
  'IELTS Mentor|Ready|Offline': { sessions: '16 buổi', classSize: '18-20 học viên' },
  'IELTS Mentor|Ready|Online': { sessions: '16 buổi', classSize: '20 - 22 học viên' },
};

export const DOC_SETTINGS = {
  // Nhận diện theo nhãn (phong cách catalogue): màu chủ đạo, nền giấy, màu tối, màu cảnh báo, dòng chân trang
  brands: [
    {
      label: 'IELTS Mentor', brandName: 'IELTS Mentor', bg: '#F0C030', bg2: '#FFFCF2', ink: '#161513', accent: '#C8102E',
      logoUrl: '', footer: 'Áp dụng cho toàn bộ khách hàng\nÁp dụng toàn bộ hệ thống IELTS MENTOR',
    },
    {
      label: 'CLASSUP 1-8', brandName: 'CLASSUP', bg: '#4B2A9B', bg2: '#FBFAFF', ink: '#1F1646', accent: '#C8102E',
      logoUrl: '', footer: 'Áp dụng cho toàn bộ khách hàng\nÁp dụng toàn bộ hệ thống CLASSUP',
    },
    {
      label: 'CLASSUP 1-1', brandName: 'CLASSUP', bg: '#4B2A9B', bg2: '#FBFAFF', ink: '#1F1646', accent: '#C8102E',
      logoUrl: '', footer: 'Áp dụng cho toàn bộ khách hàng\nÁp dụng toàn bộ hệ thống CLASSUP',
    },
  ],
  // Dịch vụ học tập (bảng cuối trang 1)
  services: [
    { label: 'IELTS Mentor', name: 'Workshop về phương pháp học', duration: '1 buổi', mode: 'Online', price: 300000 },
    { label: 'IELTS Mentor', name: 'Cố vấn học tập', duration: '1 buổi', mode: 'Online/Offline', price: 400000 },
    { label: 'IELTS Mentor', name: 'Gia sư học tập theo năng lực cá nhân hóa', duration: '1 buổi', mode: 'Online', price: 200000 },
    { label: 'IELTS Mentor', name: 'Thi lại (khi không đạt đủ điều kiện học tập)', duration: '1 buổi', mode: 'Online/Offline', price: 100000 },
    { label: 'IELTS Mentor', name: 'Chương trình duy trì năng lực sau khóa học', duration: '1 buổi', mode: 'Online', price: 300000 },
    { label: 'IELTS Mentor', name: 'Thi thử online', duration: '1 buổi', mode: 'Online', price: 100000 },
    { label: 'IELTS Mentor', name: 'Thi thử offline', duration: '1 buổi', mode: 'Offline', price: 300000 },
  ],
  // Bộ quà tặng — khớp với cột "Giá trị" ở bảng Quà tặng
  giftSets: [
    { label: 'IELTS Mentor', value: 1750000, items: '1 Đèn thông minh chữ G N69\n1 Loa bluetooth mini\n1 Áo mưa IELTS MENTOR' },
    { label: 'IELTS Mentor', value: 1970000, items: '1 Đồng hồ thông minh AMOLED HK85\n1 Tai nghe không dây ZTC Air A501\n1 Gấu bông IELTS MENTOR' },
    { label: 'IELTS Mentor', value: 2530000, items: '1 Đèn thông minh chữ G N69\n1 Tai nghe không dây ZTC Air A501\n1 Pin Dự Phòng USAMS 10000mAh' },
    { label: 'IELTS Mentor', value: 3260000, items: '1 Đèn thông minh chữ G N69\n1 Đồng hồ thông minh AMOLED HK85\n1 Tai nghe không dây ZTC Air A501' },
    { label: 'IELTS Mentor', value: 5380000, items: '1 Máy tính bảng IvyPad Smart 5\n1 Tai nghe không dây ZTC Air A501' },
    { label: 'IELTS Mentor', value: 6180000, items: '1 Máy tính bảng IvyPad Smart 5\n1 Đèn thông minh chữ G N69\n1 Bình nước IELTS MENTOR' },
    { label: 'IELTS Mentor', value: 6770000, items: '1 Máy tính bảng IvyPad Smart 5\n1 Đèn thông minh chữ G N69\n1 Tai nghe không dây ZTC Air A501' },
  ],
  // Quy định tham gia theo chương trình (in dưới bảng ưu đãi). Mỗi tháng admin cập nhật.
  programRules: [
    {
      label: 'IELTS Mentor', program: 'Định kỳ đặc biệt',
      rules: 'Chương trình không áp dụng đồng thời với các chương trình khuyến mại khác trong tháng.\n'
        + 'Chương trình chỉ áp dụng với lộ trình IELTS (không áp dụng với lộ trình Mentor English Mastery).\n'
        + 'Quà tặng khóa học đặc biệt áp dụng cho các khóa học đặc biệt theo danh sách có trong lộ trình khóa học khách hàng đăng ký.\n'
        + 'Số lượng voucher giảm học phí được áp dụng tương ứng với số khóa học đặc biệt có trong lộ trình mà khách hàng đăng ký.\n'
        + 'Voucher giảm học phí được trừ trực tiếp vào học phí khi đăng ký học. Áp dụng đồng thời với các mức giảm giá.',
    },
  ],
  docTexts: {
    cashbackLabel: 'Đăng ký trong 48h',
    warrantyDuration: 'Theo lộ trình khoá học đăng ký',
    warrantyForm: 'Theo dịch vụ bảo hành',
    routeNote:
      'Bảng giá được tính dựa trên thông tin CTKM với các khoá học Offline (nếu có). Trường hợp khách hàng lựa chọn các khoá học theo hình thức Online hoặc các combo khác, TVV vui lòng tự tính giá theo CTKM hiện hành.',
    citimeNote:
      'Với combo có các khóa Module A, Module B, BT5.5 khi xác định thời hạn trả góp không tính 3 khoá đó, chỉ xác định với các khoá còn lại đối chiếu với bảng trên. (Khoá BT5.5 có kèm khóa Ready đối chiếu thời gian với bảng trên)',
  },
};

// Nhãn cột trên ấn phẩm cho từng hình thức thanh toán
export const METHOD_DOC_LABELS = {
  Full: { promoLabel: 'Hoàn thành toàn bộ trong tháng', docLabel: 'Đăng ký Full học phí', docShort: 'Đóng Full', giftCondition: '' },
  'Giai đoạn': { promoLabel: 'Chia giai đoạn',
    docLabel: 'Đăng ký trả theo giai đoạn', docShort: 'Trả giai đoạn\n(Đóng 40% học phí lần đầu)',
    giftCondition: 'Hoàn thành tối thiểu 40% học phí trong tháng',
  },
  Sacombank: { promoLabel: 'Trả góp ngân hàng', docLabel: 'Đăng ký trả góp qua ngân hàng', docShort: 'Trả góp ngân hàng', giftCondition: '' },
  Citime: { promoLabel: 'Trả góp Citime', docLabel: 'Đăng ký trả góp qua Citime', docShort: 'Trả góp Citime', giftCondition: '' },
};
