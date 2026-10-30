// Sinh tự động bởi scripts/import_excel.py — dữ liệu gốc ban đầu, admin sửa tiếp trên web.
export default {
 "version": 1,
 "settings": {
  "campaignName": "Chương trình khuyến mại tháng 10/2026",
  "validFrom": "2026-10-01",
  "validTo": "2026-10-31",
  "labels": [
   {
    "name": "IELTS Mentor",
    "blockedMethods": []
   },
   {
    "name": "CLASSUP 1-8",
    "blockedMethods": []
   },
   {
    "name": "CLASSUP 1-1",
    "blockedMethods": [
     "Sacombank",
     "Citime"
    ]
   }
  ],
  "programs": [
   {
    "name": "Định kỳ",
    "type": "DINH_KY"
   },
   {
    "name": "Định kỳ đặc biệt",
    "type": "DAC_BIET"
   },
   {
    "name": "Liên kết trường",
    "type": "LKT"
   },
   {
    "name": "Thấp điểm",
    "type": "MO_RONG"
   },
   {
    "name": "Văn phòng mới",
    "type": "MO_RONG"
   },
   {
    "name": "Vũ Đài Trí Tuệ",
    "type": "MO_RONG"
   }
  ],
  "paymentMethods": [
   {
    "name": "Full",
    "terms": [
     0
    ],
    "giftGroup": "Full",
    "citime": false,
    "allowSingle": true
   },
   {
    "name": "Giai đoạn",
    "terms": [
     0
    ],
    "giftGroup": "Giai đoạn",
    "citime": false,
    "allowSingle": false
   },
   {
    "name": "Sacombank",
    "terms": [
     6,
     9,
     12
    ],
    "giftGroup": "Ngân hàng",
    "citime": false,
    "allowSingle": false
   },
   {
    "name": "Citime",
    "terms": [
     5,
     6,
     8,
     9,
     12,
     15
    ],
    "giftGroup": "Citime",
    "citime": true,
    "allowSingle": false
   }
  ],
  "lktGroups": [
   {
    "name": "LKT Toàn hệ thống",
    "baseProgram": "Định kỳ đặc biệt"
   },
   {
    "name": "LKT Thấp điểm",
    "baseProgram": "Thấp điểm"
   },
   {
    "name": "LKT Văn phòng mới",
    "baseProgram": "Văn phòng mới"
   },
   {
    "name": "LKT Vũ Đài Trí Tuệ",
    "baseProgram": "Vũ Đài Trí Tuệ"
   }
  ],
  "courseCodes": [
   {
    "code": "Module A",
    "short": "MA",
    "order": 1,
    "warranty": false
   },
   {
    "code": "Module B",
    "short": "MB",
    "order": 2,
    "warranty": false
   },
   {
    "code": "BS",
    "short": "BS",
    "order": 3,
    "warranty": true
   },
   {
    "code": "PRE",
    "short": "PRE",
    "order": 4,
    "warranty": true
   },
   {
    "code": "IE4.5",
    "short": "IE45",
    "order": 5,
    "warranty": true
   },
   {
    "code": "IE6.5(M1)",
    "short": "M1",
    "order": 6,
    "warranty": true
   },
   {
    "code": "IE6.5(M2)",
    "short": "M2",
    "order": 7,
    "warranty": true
   },
   {
    "code": "IE7.0",
    "short": "IE70",
    "order": 8,
    "warranty": true
   },
   {
    "code": "BT5.5",
    "short": "BT55",
    "order": 9,
    "warranty": false
   },
   {
    "code": "Ready",
    "short": "READY",
    "order": 10,
    "warranty": true
   }
  ],
  "note": "Các khoá Module A, Module B, BT5.5, IE7.0 chỉ có hình thức Online. Các khoá còn lại có cả 2 hình thức Offline/Online."
 },
 "courses": [
  {
   "label": "CLASSUP 1-8",
   "code": "Module A",
   "name": "Module A - Grammar",
   "mode": "Online",
   "price": 2400000,
   "voucher": 500000
  },
  {
   "label": "CLASSUP 1-8",
   "code": "Module B",
   "name": "Module B - Pronunciation",
   "mode": "Online",
   "price": 2400000,
   "voucher": 500000
  },
  {
   "label": "CLASSUP 1-8",
   "code": "BS",
   "name": "Basic",
   "mode": "Online",
   "price": 3400000,
   "voucher": 0
  },
  {
   "label": "CLASSUP 1-8",
   "code": "PRE",
   "name": "Pre IELTS",
   "mode": "Online",
   "price": 5000000,
   "voucher": 0
  },
  {
   "label": "CLASSUP 1-8",
   "code": "IE4.5",
   "name": "IELTS 3.5-4.5",
   "mode": "Online",
   "price": 6400000,
   "voucher": 0
  },
  {
   "label": "CLASSUP 1-8",
   "code": "IE6.5(M1)",
   "name": "IELTS 4.5-6.5 M1",
   "mode": "Online",
   "price": 13500000,
   "voucher": 0
  },
  {
   "label": "CLASSUP 1-8",
   "code": "IE6.5(M2)",
   "name": "IELTS 4.5-6.5 M2",
   "mode": "Online",
   "price": 12000000,
   "voucher": 0
  },
  {
   "label": "CLASSUP 1-8",
   "code": "BT5.5",
   "name": "Bổ trợ IELTS 5.5",
   "mode": "Online",
   "price": 3500000,
   "voucher": 700000
  },
  {
   "label": "CLASSUP 1-8",
   "code": "Ready",
   "name": "IELTS Ready",
   "mode": "Online",
   "price": 13000000,
   "voucher": 4700000
  },
  {
   "label": "CLASSUP 1-1",
   "code": "Module A",
   "name": "Module A - Grammar",
   "mode": "Online",
   "price": 2400000,
   "voucher": 500000
  },
  {
   "label": "CLASSUP 1-1",
   "code": "Module B",
   "name": "Module B - Pronunciation",
   "mode": "Online",
   "price": 2400000,
   "voucher": 500000
  },
  {
   "label": "CLASSUP 1-1",
   "code": "BS",
   "name": "Basic",
   "mode": "Online",
   "price": 8500000,
   "voucher": 0
  },
  {
   "label": "CLASSUP 1-1",
   "code": "PRE",
   "name": "Pre IELTS",
   "mode": "Online",
   "price": 13500000,
   "voucher": 0
  },
  {
   "label": "CLASSUP 1-1",
   "code": "IE4.5",
   "name": "IELTS 3.5-4.5",
   "mode": "Online",
   "price": 14800000,
   "voucher": 0
  },
  {
   "label": "CLASSUP 1-1",
   "code": "IE6.5(M1)",
   "name": "IELTS 4.5-6.5 M1",
   "mode": "Online",
   "price": 31000000,
   "voucher": 0
  },
  {
   "label": "CLASSUP 1-1",
   "code": "IE6.5(M2)",
   "name": "IELTS 4.5-6.5 M2",
   "mode": "Online",
   "price": 33000000,
   "voucher": 0
  },
  {
   "label": "CLASSUP 1-1",
   "code": "BT5.5",
   "name": "Bổ trợ IELTS 5.5",
   "mode": "Online",
   "price": 3500000,
   "voucher": 700000
  },
  {
   "label": "CLASSUP 1-1",
   "code": "Ready",
   "name": "IELTS Ready",
   "mode": "Online",
   "price": 13000000,
   "voucher": 4700000
  },
  {
   "label": "IELTS Mentor",
   "code": "Module A",
   "name": "Module A - Grammar",
   "mode": "Online",
   "price": 2400000,
   "voucher": 500000
  },
  {
   "label": "IELTS Mentor",
   "code": "Module B",
   "name": "Module B - Pronunciation",
   "mode": "Online",
   "price": 2400000,
   "voucher": 500000
  },
  {
   "label": "IELTS Mentor",
   "code": "BS",
   "name": "Basic",
   "mode": "Offline",
   "price": 6700000,
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "code": "BS",
   "name": "Basic",
   "mode": "Online",
   "price": 6700000,
   "voucher": 700000
  },
  {
   "label": "IELTS Mentor",
   "code": "PRE",
   "name": "Pre IELTS",
   "mode": "Offline",
   "price": 9800000,
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "code": "PRE",
   "name": "Pre IELTS",
   "mode": "Online",
   "price": 9800000,
   "voucher": 1300000
  },
  {
   "label": "IELTS Mentor",
   "code": "IE4.5",
   "name": "IELTS 3.5 - 4.5",
   "mode": "Offline",
   "price": 11500000,
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "code": "IE4.5",
   "name": "IELTS 3.5 - 4.5",
   "mode": "Online",
   "price": 11500000,
   "voucher": 1800000
  },
  {
   "label": "IELTS Mentor",
   "code": "IE6.5(M1)",
   "name": "IELTS 4.5-6.5 (Module 1)",
   "mode": "Offline",
   "price": 16500000,
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "code": "IE6.5(M1)",
   "name": "IELTS 4.5-6.5 (Module 1)",
   "mode": "Online",
   "price": 16500000,
   "voucher": 2300000
  },
  {
   "label": "IELTS Mentor",
   "code": "IE6.5(M2)",
   "name": "IELTS 4.5-6.5 (Module 2)",
   "mode": "Offline",
   "price": 16500000,
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "code": "IE6.5(M2)",
   "name": "IELTS 4.5-6.5 (Module 2)",
   "mode": "Online",
   "price": 16500000,
   "voucher": 3000000
  },
  {
   "label": "IELTS Mentor",
   "code": "IE7.0",
   "name": "IELTS 6.5 - 7.0+",
   "mode": "Online",
   "price": 24500000,
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "code": "BT5.5",
   "name": "Bổ trợ IELTS 5.5",
   "mode": "Online",
   "price": 3500000,
   "voucher": 700000
  },
  {
   "label": "IELTS Mentor",
   "code": "Ready",
   "name": "IELTS Ready",
   "mode": "Offline",
   "price": 15000000,
   "voucher": 4000000
  },
  {
   "label": "IELTS Mentor",
   "code": "Ready",
   "name": "IELTS Ready",
   "mode": "Online",
   "price": 15000000,
   "voucher": 6000000
  }
 ],
 "programVouchers": [
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "code": "Module A",
   "mode": "Online",
   "voucher": 600000
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "code": "Module B",
   "mode": "Online",
   "voucher": 600000
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "code": "BS",
   "mode": "Offline",
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "code": "BS",
   "mode": "Online",
   "voucher": 450000
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "code": "PRE",
   "mode": "Offline",
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "code": "PRE",
   "mode": "Online",
   "voucher": 600000
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "code": "IE4.5",
   "mode": "Offline",
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "code": "IE4.5",
   "mode": "Online",
   "voucher": 1000000
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "code": "IE6.5(M1)",
   "mode": "Offline",
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "code": "IE6.5(M1)",
   "mode": "Online",
   "voucher": 900000
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "code": "IE6.5(M2)",
   "mode": "Offline",
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "code": "IE6.5(M2)",
   "mode": "Online",
   "voucher": 2000000
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "code": "IE7.0",
   "mode": "Online",
   "voucher": 700000
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "code": "BT5.5",
   "mode": "Online",
   "voucher": 800000
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "code": "Ready",
   "mode": "Offline",
   "voucher": 3200000
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "code": "Ready",
   "mode": "Online",
   "voucher": 4800000
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "code": "Module A",
   "mode": "Online",
   "voucher": 600000
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "code": "Module B",
   "mode": "Online",
   "voucher": 600000
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "code": "BS",
   "mode": "Offline",
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "code": "BS",
   "mode": "Online",
   "voucher": 700000
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "code": "PRE",
   "mode": "Offline",
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "code": "PRE",
   "mode": "Online",
   "voucher": 900000
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "code": "IE4.5",
   "mode": "Offline",
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "code": "IE4.5",
   "mode": "Online",
   "voucher": 1500000
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "code": "IE6.5(M1)",
   "mode": "Offline",
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "code": "IE6.5(M1)",
   "mode": "Online",
   "voucher": 1600000
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "code": "IE6.5(M2)",
   "mode": "Offline",
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "code": "IE6.5(M2)",
   "mode": "Online",
   "voucher": 2700000
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "code": "IE7.0",
   "mode": "Online",
   "voucher": 700000
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "code": "BT5.5",
   "mode": "Online",
   "voucher": 800000
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "code": "Ready",
   "mode": "Offline",
   "voucher": 3500000
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "code": "Ready",
   "mode": "Online",
   "voucher": 5500000
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Vũ đài trí tuệ",
   "code": "Module A",
   "mode": "Online",
   "voucher": 500000
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Vũ đài trí tuệ",
   "code": "Module B",
   "mode": "Online",
   "voucher": 500000
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Vũ đài trí tuệ",
   "code": "BS",
   "mode": "Online",
   "voucher": 0
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Vũ đài trí tuệ",
   "code": "PRE",
   "mode": "Online",
   "voucher": 0
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Vũ đài trí tuệ",
   "code": "IE4.5",
   "mode": "Online",
   "voucher": 0
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Vũ đài trí tuệ",
   "code": "IE6.5(M1)",
   "mode": "Online",
   "voucher": 0
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Vũ đài trí tuệ",
   "code": "IE6.5(M2)",
   "mode": "Online",
   "voucher": 0
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Vũ đài trí tuệ",
   "code": "BT5.5",
   "mode": "Online",
   "voucher": 700000
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Vũ đài trí tuệ",
   "code": "Ready",
   "mode": "Online",
   "voucher": 4700000
  },
  {
   "label": "CLASSUP 1-1",
   "program": "Vũ đài trí tuệ",
   "code": "Module A",
   "mode": "Online",
   "voucher": 500000
  },
  {
   "label": "CLASSUP 1-1",
   "program": "Vũ đài trí tuệ",
   "code": "Module B",
   "mode": "Online",
   "voucher": 500000
  },
  {
   "label": "CLASSUP 1-1",
   "program": "Vũ đài trí tuệ",
   "code": "BS",
   "mode": "Online",
   "voucher": 0
  },
  {
   "label": "CLASSUP 1-1",
   "program": "Vũ đài trí tuệ",
   "code": "PRE",
   "mode": "Online",
   "voucher": 0
  },
  {
   "label": "CLASSUP 1-1",
   "program": "Vũ đài trí tuệ",
   "code": "IE4.5",
   "mode": "Online",
   "voucher": 0
  },
  {
   "label": "CLASSUP 1-1",
   "program": "Vũ đài trí tuệ",
   "code": "IE6.5(M1)",
   "mode": "Online",
   "voucher": 0
  },
  {
   "label": "CLASSUP 1-1",
   "program": "Vũ đài trí tuệ",
   "code": "IE6.5(M2)",
   "mode": "Online",
   "voucher": 0
  },
  {
   "label": "CLASSUP 1-1",
   "program": "Vũ đài trí tuệ",
   "code": "BT5.5",
   "mode": "Online",
   "voucher": 700000
  },
  {
   "label": "CLASSUP 1-1",
   "program": "Vũ đài trí tuệ",
   "code": "Ready",
   "mode": "Online",
   "voucher": 4700000
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "code": "Module A",
   "mode": "Online",
   "voucher": 500000
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "code": "Module B",
   "mode": "Online",
   "voucher": 500000
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "code": "BS",
   "mode": "Offline",
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "code": "BS",
   "mode": "Online",
   "voucher": 700000
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "code": "PRE",
   "mode": "Offline",
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "code": "PRE",
   "mode": "Online",
   "voucher": 1300000
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "code": "IE4.5",
   "mode": "Offline",
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "code": "IE4.5",
   "mode": "Online",
   "voucher": 1800000
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "code": "IE6.5(M1)",
   "mode": "Offline",
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "code": "IE6.5(M1)",
   "mode": "Online",
   "voucher": 2300000
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "code": "IE6.5(M2)",
   "mode": "Offline",
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "code": "IE6.5(M2)",
   "mode": "Online",
   "voucher": 3000000
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "code": "IE7.0",
   "mode": "Online",
   "voucher": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "code": "BT5.5",
   "mode": "Online",
   "voucher": 700000
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "code": "Ready",
   "mode": "Offline",
   "voucher": 4000000
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "code": "Ready",
   "mode": "Online",
   "voucher": 6000000
  }
 ],
 "warranty": [
  {
   "name": "Tiêu chuẩn",
   "rate": 0
  },
  {
   "name": "Bạc",
   "rate": 0.03
  },
  {
   "name": "Vàng",
   "rate": 0.05
  },
  {
   "name": "Kim Cương",
   "rate": 0.08
  }
 ],
 "periodic": [
  {
   "label": "IELTS Mentor",
   "from": 1,
   "to": 1,
   "pct": 0.15,
   "cashback": 0
  },
  {
   "label": "IELTS Mentor",
   "from": 2,
   "to": 2,
   "pct": 0.24,
   "cashback": 800000
  },
  {
   "label": "IELTS Mentor",
   "from": 3,
   "to": 3,
   "pct": 0.26,
   "cashback": 1500000
  },
  {
   "label": "IELTS Mentor",
   "from": 4,
   "to": 4,
   "pct": 0.26,
   "cashback": 2000000
  },
  {
   "label": "IELTS Mentor",
   "from": 5,
   "to": 5,
   "pct": 0.28,
   "cashback": 2500000
  },
  {
   "label": "IELTS Mentor",
   "from": 6,
   "to": 99,
   "pct": 0.3,
   "cashback": 2500000
  },
  {
   "label": "CLASSUP 1-8",
   "from": 1,
   "to": 1,
   "pct": 0.15,
   "cashback": 0
  },
  {
   "label": "CLASSUP 1-8",
   "from": 2,
   "to": 2,
   "pct": 0.24,
   "cashback": 400000
  },
  {
   "label": "CLASSUP 1-8",
   "from": 3,
   "to": 3,
   "pct": 0.26,
   "cashback": 800000
  },
  {
   "label": "CLASSUP 1-8",
   "from": 4,
   "to": 4,
   "pct": 0.28,
   "cashback": 800000
  },
  {
   "label": "CLASSUP 1-8",
   "from": 5,
   "to": 5,
   "pct": 0.3,
   "cashback": 1000000
  },
  {
   "label": "CLASSUP 1-8",
   "from": 6,
   "to": 99,
   "pct": 0.3,
   "cashback": 1400000
  },
  {
   "label": "CLASSUP 1-1",
   "from": 1,
   "to": 1,
   "pct": 0.18,
   "cashback": 0
  },
  {
   "label": "CLASSUP 1-1",
   "from": 2,
   "to": 2,
   "pct": 0.21,
   "cashback": 500000
  },
  {
   "label": "CLASSUP 1-1",
   "from": 3,
   "to": 3,
   "pct": 0.23,
   "cashback": 800000
  },
  {
   "label": "CLASSUP 1-1",
   "from": 4,
   "to": 4,
   "pct": 0.23,
   "cashback": 1500000
  },
  {
   "label": "CLASSUP 1-1",
   "from": 5,
   "to": 5,
   "pct": 0.25,
   "cashback": 2000000
  },
  {
   "label": "CLASSUP 1-1",
   "from": 6,
   "to": 99,
   "pct": 0.25,
   "cashback": 2500000
  }
 ],
 "special": [
  {
   "label": "IELTS Mentor",
   "method": "Full",
   "term": 0,
   "pct": 0.4,
   "applyType": "TOAN_BO",
   "minCourses": 1,
   "note": "Khóa lẻ và combo"
  },
  {
   "label": "IELTS Mentor",
   "method": "Giai đoạn",
   "term": 0,
   "pct": 0.38,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "IELTS Mentor",
   "method": "Sacombank",
   "term": 6,
   "pct": 0.37,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "IELTS Mentor",
   "method": "Sacombank",
   "term": 9,
   "pct": 0.36,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "IELTS Mentor",
   "method": "Sacombank",
   "term": 12,
   "pct": 0.36,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "IELTS Mentor",
   "method": "Citime",
   "term": 5,
   "pct": 0.36,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "method": "Citime",
   "term": 6,
   "pct": 0.35,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "method": "Citime",
   "term": 8,
   "pct": 0.34,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "method": "Citime",
   "term": 9,
   "pct": 0.34,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "method": "Citime",
   "term": 12,
   "pct": 0.33,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "method": "Citime",
   "term": 15,
   "pct": 0.33,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "CLASSUP 1-8",
   "method": "Full",
   "term": 0,
   "pct": 0.4,
   "applyType": "TOAN_BO",
   "minCourses": 1,
   "note": "Khóa lẻ và combo"
  },
  {
   "label": "CLASSUP 1-8",
   "method": "Giai đoạn",
   "term": 0,
   "pct": 0.38,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "CLASSUP 1-8",
   "method": "Sacombank",
   "term": 6,
   "pct": 0.37,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "CLASSUP 1-8",
   "method": "Sacombank",
   "term": 9,
   "pct": 0.36,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "CLASSUP 1-8",
   "method": "Sacombank",
   "term": 12,
   "pct": 0.36,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "CLASSUP 1-8",
   "method": "Citime",
   "term": 5,
   "pct": 0.36,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "CLASSUP 1-8",
   "method": "Citime",
   "term": 6,
   "pct": 0.35,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "CLASSUP 1-8",
   "method": "Citime",
   "term": 8,
   "pct": 0.34,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "CLASSUP 1-8",
   "method": "Citime",
   "term": 9,
   "pct": 0.34,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "CLASSUP 1-8",
   "method": "Citime",
   "term": 12,
   "pct": 0.33,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "CLASSUP 1-8",
   "method": "Citime",
   "term": 15,
   "pct": 0.33,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "CLASSUP 1-1",
   "method": "Full",
   "term": 0,
   "pct": 0.3,
   "applyType": "TOAN_BO",
   "minCourses": 1,
   "note": "Khóa lẻ và combo"
  },
  {
   "label": "CLASSUP 1-1",
   "method": "Giai đoạn",
   "term": 0,
   "pct": 0.27,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  }
 ],
 "lkt": [
  {
   "label": "IELTS Mentor",
   "group": "LKT Toàn hệ thống",
   "format": "Format 1",
   "cut": 0.06
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Toàn hệ thống",
   "format": "Format 2",
   "cut": 0.05
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Toàn hệ thống",
   "format": "Format 3",
   "cut": 0.04
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Toàn hệ thống",
   "format": "Format 4",
   "cut": 0.03
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Toàn hệ thống",
   "format": "Format 5",
   "cut": 0.03
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Toàn hệ thống",
   "format": "Format 6",
   "cut": 0
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Toàn hệ thống",
   "format": "Format 7",
   "cut": 0.06
  },
  {
   "label": "CLASSUP 1-8",
   "group": "LKT Toàn hệ thống",
   "format": "Format 1",
   "cut": 0.06
  },
  {
   "label": "CLASSUP 1-8",
   "group": "LKT Toàn hệ thống",
   "format": "Format 2",
   "cut": 0.05
  },
  {
   "label": "CLASSUP 1-8",
   "group": "LKT Toàn hệ thống",
   "format": "Format 3",
   "cut": 0.04
  },
  {
   "label": "CLASSUP 1-8",
   "group": "LKT Toàn hệ thống",
   "format": "Format 4",
   "cut": 0.03
  },
  {
   "label": "CLASSUP 1-8",
   "group": "LKT Toàn hệ thống",
   "format": "Format 5",
   "cut": 0.03
  },
  {
   "label": "CLASSUP 1-8",
   "group": "LKT Toàn hệ thống",
   "format": "Format 6",
   "cut": 0
  },
  {
   "label": "CLASSUP 1-8",
   "group": "LKT Toàn hệ thống",
   "format": "Format 7",
   "cut": 0.06
  },
  {
   "label": "CLASSUP 1-1",
   "group": "LKT Toàn hệ thống",
   "format": "Format 1",
   "cut": 0.06
  },
  {
   "label": "CLASSUP 1-1",
   "group": "LKT Toàn hệ thống",
   "format": "Format 2",
   "cut": 0.05
  },
  {
   "label": "CLASSUP 1-1",
   "group": "LKT Toàn hệ thống",
   "format": "Format 3",
   "cut": 0.04
  },
  {
   "label": "CLASSUP 1-1",
   "group": "LKT Toàn hệ thống",
   "format": "Format 4",
   "cut": 0.03
  },
  {
   "label": "CLASSUP 1-1",
   "group": "LKT Toàn hệ thống",
   "format": "Format 5",
   "cut": 0.03
  },
  {
   "label": "CLASSUP 1-1",
   "group": "LKT Toàn hệ thống",
   "format": "Format 6",
   "cut": 0
  },
  {
   "label": "CLASSUP 1-1",
   "group": "LKT Toàn hệ thống",
   "format": "Format 7",
   "cut": 0.06
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Thấp điểm",
   "format": "Format 1",
   "cut": 0.06
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Thấp điểm",
   "format": "Format 2",
   "cut": 0.05
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Thấp điểm",
   "format": "Format 3",
   "cut": 0.04
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Thấp điểm",
   "format": "Format 4",
   "cut": 0.03
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Thấp điểm",
   "format": "Format 5",
   "cut": 0.03
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Thấp điểm",
   "format": "Format 6",
   "cut": 0
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Thấp điểm",
   "format": "Format 7",
   "cut": 0.06
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Văn phòng mới",
   "format": "Format 1",
   "cut": 0.06
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Văn phòng mới",
   "format": "Format 2",
   "cut": 0.05
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Văn phòng mới",
   "format": "Format 3",
   "cut": 0.04
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Văn phòng mới",
   "format": "Format 4",
   "cut": 0.03
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Văn phòng mới",
   "format": "Format 5",
   "cut": 0.03
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Văn phòng mới",
   "format": "Format 6",
   "cut": 0
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Văn phòng mới",
   "format": "Format 7",
   "cut": 0.06
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 1",
   "cut": 0.06
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 2",
   "cut": 0.05
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 3",
   "cut": 0.04
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 4",
   "cut": 0.03
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 5",
   "cut": 0.03
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 6",
   "cut": 0
  },
  {
   "label": "IELTS Mentor",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 7",
   "cut": 0.06
  },
  {
   "label": "CLASSUP 1-8",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 1",
   "cut": 0.06
  },
  {
   "label": "CLASSUP 1-8",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 2",
   "cut": 0.05
  },
  {
   "label": "CLASSUP 1-8",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 3",
   "cut": 0.04
  },
  {
   "label": "CLASSUP 1-8",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 4",
   "cut": 0.03
  },
  {
   "label": "CLASSUP 1-8",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 5",
   "cut": 0.03
  },
  {
   "label": "CLASSUP 1-8",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 6",
   "cut": 0
  },
  {
   "label": "CLASSUP 1-8",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 7",
   "cut": 0.06
  },
  {
   "label": "CLASSUP 1-1",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 1",
   "cut": 0.06
  },
  {
   "label": "CLASSUP 1-1",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 2",
   "cut": 0.05
  },
  {
   "label": "CLASSUP 1-1",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 3",
   "cut": 0.04
  },
  {
   "label": "CLASSUP 1-1",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 4",
   "cut": 0.03
  },
  {
   "label": "CLASSUP 1-1",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 5",
   "cut": 0.03
  },
  {
   "label": "CLASSUP 1-1",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 6",
   "cut": 0
  },
  {
   "label": "CLASSUP 1-1",
   "group": "LKT Vũ Đài Trí Tuệ",
   "format": "Format 7",
   "cut": 0.06
  }
 ],
 "extended": [
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "method": "Full",
   "term": 0,
   "pct": 0.48,
   "applyType": "TOAN_BO",
   "minCourses": 1,
   "note": "Khóa lẻ và combo"
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "method": "Giai đoạn",
   "term": 0,
   "pct": 0.46,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "method": "Sacombank",
   "term": 6,
   "pct": 0.45,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "method": "Sacombank",
   "term": 9,
   "pct": 0.44,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "method": "Sacombank",
   "term": 12,
   "pct": 0.44,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "method": "Citime",
   "term": 5,
   "pct": 0.44,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "method": "Citime",
   "term": 6,
   "pct": 0.43,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "method": "Citime",
   "term": 8,
   "pct": 0.42,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "method": "Citime",
   "term": 9,
   "pct": 0.42,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "method": "Citime",
   "term": 12,
   "pct": 0.41,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "program": "Thấp điểm",
   "method": "Citime",
   "term": 15,
   "pct": 0.41,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "method": "Full",
   "term": 0,
   "pct": 0.44,
   "applyType": "TOAN_BO",
   "minCourses": 1,
   "note": "Khóa lẻ và combo"
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "method": "Giai đoạn",
   "term": 0,
   "pct": 0.42,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "method": "Sacombank",
   "term": 6,
   "pct": 0.41,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "method": "Sacombank",
   "term": 9,
   "pct": 0.4,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "method": "Sacombank",
   "term": 12,
   "pct": 0.4,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "method": "Citime",
   "term": 5,
   "pct": 0.4,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "method": "Citime",
   "term": 6,
   "pct": 0.39,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "method": "Citime",
   "term": 8,
   "pct": 0.38,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "method": "Citime",
   "term": 9,
   "pct": 0.38,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "method": "Citime",
   "term": 12,
   "pct": 0.37,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "program": "Văn phòng mới",
   "method": "Citime",
   "term": 15,
   "pct": 0.37,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "method": "Full",
   "term": 0,
   "pct": 0.45,
   "applyType": "TOAN_BO",
   "minCourses": 1,
   "note": "Khóa lẻ và combo"
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "method": "Giai đoạn",
   "term": 0,
   "pct": 0.43,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "method": "Sacombank",
   "term": 6,
   "pct": 0.42,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "method": "Sacombank",
   "term": 9,
   "pct": 0.41,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "method": "Sacombank",
   "term": 12,
   "pct": 0.41,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "method": "Citime",
   "term": 5,
   "pct": 0.41,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "method": "Citime",
   "term": 6,
   "pct": 0.4,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "method": "Citime",
   "term": 8,
   "pct": 0.39,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "method": "Citime",
   "term": 9,
   "pct": 0.39,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "method": "Citime",
   "term": 12,
   "pct": 0.38,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "IELTS Mentor",
   "program": "Vũ đài trí tuệ",
   "method": "Citime",
   "term": 15,
   "pct": 0.38,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Vũ đài trí tuệ",
   "method": "Full",
   "term": 0,
   "pct": 0.45,
   "applyType": "TOAN_BO",
   "minCourses": 1,
   "note": "Khóa lẻ và combo"
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Vũ đài trí tuệ",
   "method": "Giai đoạn",
   "term": 0,
   "pct": 0.43,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Vũ đài trí tuệ",
   "method": "Sacombank",
   "term": 6,
   "pct": 0.42,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Vũ đài trí tuệ",
   "method": "Sacombank",
   "term": 9,
   "pct": 0.41,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Vũ đài trí tuệ",
   "method": "Sacombank",
   "term": 12,
   "pct": 0.41,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Vũ đài trí tuệ",
   "method": "Citime",
   "term": 5,
   "pct": 0.41,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Vũ đài trí tuệ",
   "method": "Citime",
   "term": 6,
   "pct": 0.4,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Vũ đài trí tuệ",
   "method": "Citime",
   "term": 8,
   "pct": 0.39,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Vũ đài trí tuệ",
   "method": "Citime",
   "term": 9,
   "pct": 0.39,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Vũ đài trí tuệ",
   "method": "Citime",
   "term": 12,
   "pct": 0.38,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Vũ đài trí tuệ",
   "method": "Citime",
   "term": 15,
   "pct": 0.38,
   "applyType": "LO_TRINH_CU_THE",
   "minCourses": 2,
   "note": "Theo Sheet 05"
  },
  {
   "label": "CLASSUP 1-1",
   "program": "Vũ đài trí tuệ",
   "method": "Full",
   "term": 0,
   "pct": 0.35,
   "applyType": "TOAN_BO",
   "minCourses": 1,
   "note": "Khóa lẻ và combo"
  },
  {
   "label": "CLASSUP 1-1",
   "program": "Vũ đài trí tuệ",
   "method": "Giai đoạn",
   "term": 0,
   "pct": 0.33,
   "applyType": "COMBO",
   "minCourses": 2,
   "note": "Combo từ 2 khóa"
  }
 ],
 "citimeRoutes": [
  {
   "label": "IELTS Mentor",
   "group": "Chuẩn",
   "count": 2,
   "code": "BS_PRE",
   "name": "BS + PRE",
   "status": "Áp dụng",
   "maxTerm": 5
  },
  {
   "label": "IELTS Mentor",
   "group": "Chuẩn",
   "count": 2,
   "code": "PRE_IE45",
   "name": "PRE + IE4.5",
   "status": "Áp dụng",
   "maxTerm": 5
  },
  {
   "label": "IELTS Mentor",
   "group": "Chuẩn",
   "count": 2,
   "code": "IE45_M1",
   "name": "IE4.5 + IE6.5(M1)",
   "status": "Áp dụng",
   "maxTerm": 8
  },
  {
   "label": "IELTS Mentor",
   "group": "Chuẩn",
   "count": 2,
   "code": "M1_M2",
   "name": "IE6.5(M1) + IE6.5(M2)",
   "status": "Áp dụng",
   "maxTerm": 8
  },
  {
   "label": "IELTS Mentor",
   "group": "Chuẩn",
   "count": 2,
   "code": "M2_IE70",
   "name": "IE6.5(M2) + IE7.0",
   "status": "Áp dụng",
   "maxTerm": 8
  },
  {
   "label": "IELTS Mentor",
   "group": "Chuẩn",
   "count": 3,
   "code": "BS_PRE_IE45",
   "name": "BS + PRE + IE4.5",
   "status": "Áp dụng",
   "maxTerm": 6
  },
  {
   "label": "IELTS Mentor",
   "group": "Chuẩn",
   "count": 3,
   "code": "PRE_IE45_M1",
   "name": "PRE + IE4.5 + IE6.5(M1)",
   "status": "Áp dụng",
   "maxTerm": 9
  },
  {
   "label": "IELTS Mentor",
   "group": "Chuẩn",
   "count": 3,
   "code": "IE45_M1_M2",
   "name": "IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "status": "Áp dụng",
   "maxTerm": 9
  },
  {
   "label": "IELTS Mentor",
   "group": "Chuẩn",
   "count": 3,
   "code": "M1_M2_IE70",
   "name": "IE6.5(M1) + IE6.5(M2) + IE7.0",
   "status": "Áp dụng",
   "maxTerm": 9
  },
  {
   "label": "IELTS Mentor",
   "group": "Chuẩn",
   "count": 4,
   "code": "BS_PRE_IE45_M1",
   "name": "BS + PRE + IE4.5 + IE6.5(M1)",
   "status": "Áp dụng",
   "maxTerm": 12
  },
  {
   "label": "IELTS Mentor",
   "group": "Chuẩn",
   "count": 4,
   "code": "PRE_IE45_M1_M2",
   "name": "PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Chuẩn",
   "count": 4,
   "code": "IE45_M1_M2_IE70",
   "name": "IE4.5 + IE6.5(M1) + IE6.5(M2) + IE7.0",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Chuẩn",
   "count": 5,
   "code": "BS_PRE_IE45_M1_M2",
   "name": "BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Chuẩn",
   "count": 5,
   "code": "PRE_IE45_M1_M2_IE70",
   "name": "PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + IE7.0",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Chuẩn",
   "count": 6,
   "code": "BS_PRE_IE45_M1_M2_IE70",
   "name": "BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + IE7.0",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp luyện thi",
   "count": 2,
   "code": "M2_READY",
   "name": "IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 5
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp luyện thi",
   "count": 3,
   "code": "M1_BT55_READY",
   "name": "IE6.5(M1) + BT5.5 + Ready",
   "status": "Áp dụng",
   "maxTerm": 6
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp luyện thi",
   "count": 3,
   "code": "M1_M2_READY",
   "name": "IE6.5(M1) + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 9
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp luyện thi",
   "count": 4,
   "code": "IE45_M1_BT55_READY",
   "name": "IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "status": "Áp dụng",
   "maxTerm": 9
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp luyện thi",
   "count": 4,
   "code": "IE45_M1_M2_READY",
   "name": "IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 12
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp luyện thi",
   "count": 5,
   "code": "PRE_IE45_M1_BT55_READY",
   "name": "PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "status": "Áp dụng",
   "maxTerm": 12
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp luyện thi",
   "count": 5,
   "code": "PRE_IE45_M1_M2_READY",
   "name": "PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp luyện thi",
   "count": 6,
   "code": "BS_PRE_IE45_M1_M2_READY",
   "name": "BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp luyện thi",
   "count": 6,
   "code": "BS_PRE_IE45_M1_BT55_READY",
   "name": "BS + PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 2,
   "code": "MA_BS",
   "name": "Module A + BS",
   "status": "Không áp dụng",
   "maxTerm": 0
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 2,
   "code": "MB_BS",
   "name": "Module B + BS",
   "status": "Không áp dụng",
   "maxTerm": 0
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 2,
   "code": "MB_PRE",
   "name": "Module B + PRE",
   "status": "Không áp dụng",
   "maxTerm": 0
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 2,
   "code": "MB_IE45",
   "name": "Module B + IE4.5",
   "status": "Không áp dụng",
   "maxTerm": 0
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 2,
   "code": "MB_M1",
   "name": "Module B + IE6.5(M1)",
   "status": "Không áp dụng",
   "maxTerm": 0
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 2,
   "code": "MB_M2",
   "name": "Module B + IE6.5(M2)",
   "status": "Không áp dụng",
   "maxTerm": 0
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 2,
   "code": "MB_IE70",
   "name": "Module B + IE7.0",
   "status": "Không áp dụng",
   "maxTerm": 0
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 3,
   "code": "MA_MB_BS",
   "name": "Module A + Module B + BS",
   "status": "Không áp dụng",
   "maxTerm": 0
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 3,
   "code": "MA_BS_PRE",
   "name": "Module A + BS + PRE",
   "status": "Áp dụng",
   "maxTerm": 5
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 3,
   "code": "MB_BS_PRE",
   "name": "Module B + BS + PRE",
   "status": "Áp dụng",
   "maxTerm": 5
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 3,
   "code": "MB_PRE_IE45",
   "name": "Module B + PRE + IE4.5",
   "status": "Áp dụng",
   "maxTerm": 5
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 3,
   "code": "MB_IE45_M1",
   "name": "Module B + IE4.5 + IE6.5(M1)",
   "status": "Áp dụng",
   "maxTerm": 8
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 3,
   "code": "MB_M1_M2",
   "name": "Module B + IE6.5(M1) + IE6.5(M2)",
   "status": "Áp dụng",
   "maxTerm": 8
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 3,
   "code": "MB_M2_IE70",
   "name": "Module B + IE6.5(M2) + IE7.0",
   "status": "Áp dụng",
   "maxTerm": 8
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 4,
   "code": "MA_MB_BS_PRE",
   "name": "Module A + Module B + BS + PRE",
   "status": "Áp dụng",
   "maxTerm": 5
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 4,
   "code": "MA_BS_PRE_IE45",
   "name": "Module A + BS + PRE + IE4.5",
   "status": "Áp dụng",
   "maxTerm": 6
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 4,
   "code": "MB_BS_PRE_IE45",
   "name": "Module B + BS + PRE + IE4.5",
   "status": "Áp dụng",
   "maxTerm": 6
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 4,
   "code": "MB_PRE_IE45_M1",
   "name": "Module B + PRE + IE4.5 + IE6.5(M1)",
   "status": "Áp dụng",
   "maxTerm": 9
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 4,
   "code": "MB_IE45_M1_M2",
   "name": "Module B + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "status": "Áp dụng",
   "maxTerm": 9
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 4,
   "code": "MB_M1_M2_IE70",
   "name": "Module B + IE6.5(M1) + IE6.5(M2) + IE7.0",
   "status": "Áp dụng",
   "maxTerm": 9
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 5,
   "code": "MA_MB_BS_PRE_IE45",
   "name": "Module A + Module B + BS + PRE + IE4.5",
   "status": "Áp dụng",
   "maxTerm": 6
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 5,
   "code": "MA_BS_PRE_IE45_M1",
   "name": "Module A + BS + PRE + IE4.5 + IE6.5(M1)",
   "status": "Áp dụng",
   "maxTerm": 12
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 5,
   "code": "MB_BS_PRE_IE45_M1",
   "name": "Module B + BS + PRE + IE4.5 + IE6.5(M1)",
   "status": "Áp dụng",
   "maxTerm": 12
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 5,
   "code": "MB_PRE_IE45_M1_M2",
   "name": "Module B + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 5,
   "code": "MB_IE45_M1_M2_IE70",
   "name": "Module B + IE4.5 + IE6.5(M1) + IE6.5(M2) + IE7.0",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 6,
   "code": "MA_MB_BS_PRE_IE45_M1",
   "name": "Module A + Module B + BS + PRE + IE4.5 + IE6.5(M1)",
   "status": "Áp dụng",
   "maxTerm": 12
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 6,
   "code": "MA_BS_PRE_IE45_M1_M2",
   "name": "Module A + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 6,
   "code": "MB_BS_PRE_IE45_M1_M2",
   "name": "Module B + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 6,
   "code": "MB_PRE_IE45_M1_M2_IE70",
   "name": "Module B + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + IE7.0",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 7,
   "code": "MA_MB_BS_PRE_IE45_M1_M2",
   "name": "Module A + Module B + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 7,
   "code": "MB_BS_PRE_IE45_M1_M2_IE70",
   "name": "Module B + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + IE7.0",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 8,
   "code": "MA_MB_BS_PRE_IE45_M1_M2_IE70",
   "name": "Module A + Module B + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + IE7.0",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 3,
   "code": "MB_M2_READY",
   "name": "Module B + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 5
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 4,
   "code": "MB_M1_BT55_READY",
   "name": "Module B + IE6.5(M1) + BT5.5 + Ready",
   "status": "Áp dụng",
   "maxTerm": 6
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 4,
   "code": "MB_M1_M2_READY",
   "name": "Module B + IE6.5(M1) + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 9
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 5,
   "code": "MB_IE45_M1_BT55_READY",
   "name": "Module B + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "status": "Áp dụng",
   "maxTerm": 9
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 5,
   "code": "MB_IE45_M1_M2_READY",
   "name": "Module B + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 12
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 6,
   "code": "MB_PRE_IE45_M1_BT55_READY",
   "name": "Module B + PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "status": "Áp dụng",
   "maxTerm": 12
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 6,
   "code": "MB_PRE_IE45_M1_M2_READY",
   "name": "Module B + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 7,
   "code": "MA_BS_PRE_IE45_M1_BT55_READY",
   "name": "Module A + BS + PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 7,
   "code": "MB_BS_PRE_IE45_M1_BT55_READY",
   "name": "Module B + BS + PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 7,
   "code": "MA_BS_PRE_IE45_M1_M2_READY",
   "name": "Module A + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 7,
   "code": "MB_BS_PRE_IE45_M1_M2_READY",
   "name": "Module B + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 8,
   "code": "MA_MB_BS_PRE_IE45_M1_M2_READY",
   "name": "Module A + Module B + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "IELTS Mentor",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 8,
   "code": "MA_MB_BS_PRE_IE45_M1_BT55_READY",
   "name": "Module A + Module B + BS + PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Chuẩn",
   "count": 2,
   "code": "BS_PRE",
   "name": "BS + PRE",
   "status": "Áp dụng",
   "maxTerm": 5
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Chuẩn",
   "count": 2,
   "code": "PRE_IE45",
   "name": "PRE + IE4.5",
   "status": "Áp dụng",
   "maxTerm": 5
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Chuẩn",
   "count": 2,
   "code": "IE45_M1",
   "name": "IE4.5 + IE6.5(M1)",
   "status": "Áp dụng",
   "maxTerm": 8
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Chuẩn",
   "count": 2,
   "code": "M1_M2",
   "name": "IE6.5(M1) + IE6.5(M2)",
   "status": "Áp dụng",
   "maxTerm": 8
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Chuẩn",
   "count": 3,
   "code": "BS_PRE_IE45",
   "name": "BS + PRE + IE4.5",
   "status": "Áp dụng",
   "maxTerm": 6
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Chuẩn",
   "count": 3,
   "code": "PRE_IE45_M1",
   "name": "PRE + IE4.5 + IE6.5(M1)",
   "status": "Áp dụng",
   "maxTerm": 9
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Chuẩn",
   "count": 3,
   "code": "IE45_M1_M2",
   "name": "IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "status": "Áp dụng",
   "maxTerm": 9
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Chuẩn",
   "count": 4,
   "code": "BS_PRE_IE45_M1",
   "name": "BS + PRE + IE4.5 + IE6.5(M1)",
   "status": "Áp dụng",
   "maxTerm": 12
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Chuẩn",
   "count": 4,
   "code": "PRE_IE45_M1_M2",
   "name": "PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Chuẩn",
   "count": 5,
   "code": "BS_PRE_IE45_M1_M2",
   "name": "BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp luyện thi",
   "count": 2,
   "code": "M2_READY",
   "name": "IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 5
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp luyện thi",
   "count": 3,
   "code": "M1_BT55_READY",
   "name": "IE6.5(M1) + BT5.5 + Ready",
   "status": "Áp dụng",
   "maxTerm": 6
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp luyện thi",
   "count": 3,
   "code": "M1_M2_READY",
   "name": "IE6.5(M1) + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 9
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp luyện thi",
   "count": 4,
   "code": "IE45_M1_BT55_READY",
   "name": "IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "status": "Áp dụng",
   "maxTerm": 9
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp luyện thi",
   "count": 4,
   "code": "IE45_M1_M2_READY",
   "name": "IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 12
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp luyện thi",
   "count": 5,
   "code": "PRE_IE45_M1_BT55_READY",
   "name": "PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "status": "Áp dụng",
   "maxTerm": 12
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp luyện thi",
   "count": 5,
   "code": "PRE_IE45_M1_M2_READY",
   "name": "PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp luyện thi",
   "count": 6,
   "code": "BS_PRE_IE45_M1_M2_READY",
   "name": "BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp luyện thi",
   "count": 6,
   "code": "BS_PRE_IE45_M1_BT55_READY",
   "name": "BS + PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 2,
   "code": "MA_BS",
   "name": "Module A + BS",
   "status": "Không áp dụng",
   "maxTerm": 0
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 2,
   "code": "MB_BS",
   "name": "Module B + BS",
   "status": "Không áp dụng",
   "maxTerm": 0
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 2,
   "code": "MB_PRE",
   "name": "Module B + PRE",
   "status": "Không áp dụng",
   "maxTerm": 0
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 2,
   "code": "MB_IE45",
   "name": "Module B + IE4.5",
   "status": "Không áp dụng",
   "maxTerm": 0
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 2,
   "code": "MB_M1",
   "name": "Module B + IE6.5(M1)",
   "status": "Không áp dụng",
   "maxTerm": 0
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 2,
   "code": "MB_M2",
   "name": "Module B + IE6.5(M2)",
   "status": "Không áp dụng",
   "maxTerm": 0
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 3,
   "code": "MA_MB_BS",
   "name": "Module A + Module B + BS",
   "status": "Không áp dụng",
   "maxTerm": 0
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 3,
   "code": "MA_BS_PRE",
   "name": "Module A + BS + PRE",
   "status": "Áp dụng",
   "maxTerm": 5
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 3,
   "code": "MB_BS_PRE",
   "name": "Module B + BS + PRE",
   "status": "Áp dụng",
   "maxTerm": 5
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 3,
   "code": "MB_PRE_IE45",
   "name": "Module B + PRE + IE4.5",
   "status": "Áp dụng",
   "maxTerm": 5
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 3,
   "code": "MB_IE45_M1",
   "name": "Module B + IE4.5 + IE6.5(M1)",
   "status": "Áp dụng",
   "maxTerm": 8
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 3,
   "code": "MB_M1_M2",
   "name": "Module B + IE6.5(M1) + IE6.5(M2)",
   "status": "Áp dụng",
   "maxTerm": 8
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 4,
   "code": "MA_MB_BS_PRE",
   "name": "Module A + Module B + BS + PRE",
   "status": "Áp dụng",
   "maxTerm": 5
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 4,
   "code": "MA_BS_PRE_IE45",
   "name": "Module A + BS + PRE + IE4.5",
   "status": "Áp dụng",
   "maxTerm": 6
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 4,
   "code": "MB_BS_PRE_IE45",
   "name": "Module B + BS + PRE + IE4.5",
   "status": "Áp dụng",
   "maxTerm": 6
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 4,
   "code": "MB_PRE_IE45_M1",
   "name": "Module B + PRE + IE4.5 + IE6.5(M1)",
   "status": "Áp dụng",
   "maxTerm": 9
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 4,
   "code": "MB_IE45_M1_M2",
   "name": "Module B + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "status": "Áp dụng",
   "maxTerm": 9
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 5,
   "code": "MA_MB_BS_PRE_IE45",
   "name": "Module A + Module B + BS + PRE + IE4.5",
   "status": "Áp dụng",
   "maxTerm": 6
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 5,
   "code": "MA_BS_PRE_IE45_M1",
   "name": "Module A + BS + PRE + IE4.5 + IE6.5(M1)",
   "status": "Áp dụng",
   "maxTerm": 12
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 5,
   "code": "MB_BS_PRE_IE45_M1",
   "name": "Module B + BS + PRE + IE4.5 + IE6.5(M1)",
   "status": "Áp dụng",
   "maxTerm": 12
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 5,
   "code": "MB_PRE_IE45_M1_M2",
   "name": "Module B + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 6,
   "code": "MA_MB_BS_PRE_IE45_M1",
   "name": "Module A + Module B + BS + PRE + IE4.5 + IE6.5(M1)",
   "status": "Áp dụng",
   "maxTerm": 12
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 6,
   "code": "MA_BS_PRE_IE45_M1_M2",
   "name": "Module A + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 6,
   "code": "MB_BS_PRE_IE45_M1_M2",
   "name": "Module B + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng",
   "count": 7,
   "code": "MA_MB_BS_PRE_IE45_M1_M2",
   "name": "Module A + Module B + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 3,
   "code": "MB_M2_READY",
   "name": "Module B + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 5
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 4,
   "code": "MB_M1_BT55_READY",
   "name": "Module B + IE6.5(M1) + BT5.5 + Ready",
   "status": "Áp dụng",
   "maxTerm": 6
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 4,
   "code": "MB_M1_M2_READY",
   "name": "Module B + IE6.5(M1) + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 9
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 5,
   "code": "MB_IE45_M1_BT55_READY",
   "name": "Module B + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "status": "Áp dụng",
   "maxTerm": 9
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 5,
   "code": "MB_IE45_M1_M2_READY",
   "name": "Module B + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 12
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 6,
   "code": "MB_PRE_IE45_M1_BT55_READY",
   "name": "Module B + PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "status": "Áp dụng",
   "maxTerm": 12
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 6,
   "code": "MB_PRE_IE45_M1_M2_READY",
   "name": "Module B + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 7,
   "code": "MA_BS_PRE_IE45_M1_BT55_READY",
   "name": "Module A + BS + PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 7,
   "code": "MB_BS_PRE_IE45_M1_BT55_READY",
   "name": "Module B + BS + PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 7,
   "code": "MA_BS_PRE_IE45_M1_M2_READY",
   "name": "Module A + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 7,
   "code": "MB_BS_PRE_IE45_M1_M2_READY",
   "name": "Module B + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 8,
   "code": "MA_MB_BS_PRE_IE45_M1_M2_READY",
   "name": "Module A + Module B + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "status": "Áp dụng",
   "maxTerm": 15
  },
  {
   "label": "CLASSUP 1-8",
   "group": "Kết hợp bổ trợ nền tảng - luyện thi",
   "count": 8,
   "code": "MA_MB_BS_PRE_IE45_M1_BT55_READY",
   "name": "Module A + Module B + BS + PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "status": "Áp dụng",
   "maxTerm": 15
  }
 ],
 "gifts": [
  {
   "label": "IELTS Mentor",
   "program": "Định kỳ",
   "milestone": 1,
   "method": "Full",
   "content": "Bộ quà tặng trị giá 1.970.000đ",
   "value": 1970000
  },
  {
   "label": "IELTS Mentor",
   "program": "Định kỳ",
   "milestone": 2,
   "method": "Full",
   "content": "Bộ quà tặng trị giá 2.530.000đ",
   "value": 2530000
  },
  {
   "label": "IELTS Mentor",
   "program": "Định kỳ",
   "milestone": 3,
   "method": "Full",
   "content": "Bộ quà tặng trị giá 3.260.000đ",
   "value": 3260000
  },
  {
   "label": "IELTS Mentor",
   "program": "Định kỳ",
   "milestone": 4,
   "method": "Full",
   "content": "Bộ quà tặng trị giá 5.380.000đ",
   "value": 5380000
  },
  {
   "label": "IELTS Mentor",
   "program": "Định kỳ",
   "milestone": 5,
   "method": "Full",
   "content": "Bộ quà tặng trị giá 6.180.000đ",
   "value": 6180000
  },
  {
   "label": "IELTS Mentor",
   "program": "Định kỳ",
   "milestone": 6,
   "method": "Full",
   "content": "Bộ quà tặng trị giá 6.770.000đ",
   "value": 6770000
  },
  {
   "label": "IELTS Mentor",
   "program": "Định kỳ",
   "milestone": 2,
   "method": "Ngân hàng",
   "content": "Bộ quà tặng trị giá 1.750.000đ",
   "value": 1750000
  },
  {
   "label": "IELTS Mentor",
   "program": "Định kỳ",
   "milestone": 3,
   "method": "Ngân hàng",
   "content": "Bộ quà tặng trị giá 1.750.000đ",
   "value": 1750000
  },
  {
   "label": "IELTS Mentor",
   "program": "Định kỳ",
   "milestone": 4,
   "method": "Ngân hàng",
   "content": "Bộ quà tặng trị giá 3.260.000đ",
   "value": 3260000
  },
  {
   "label": "IELTS Mentor",
   "program": "Định kỳ",
   "milestone": 5,
   "method": "Ngân hàng",
   "content": "Bộ quà tặng trị giá 3.260.000đ",
   "value": 3260000
  },
  {
   "label": "IELTS Mentor",
   "program": "Định kỳ",
   "milestone": 6,
   "method": "Ngân hàng",
   "content": "Bộ quà tặng trị giá 3.260.000đ",
   "value": 3260000
  },
  {
   "label": "IELTS Mentor",
   "program": "Định kỳ",
   "milestone": 2,
   "method": "Citime",
   "content": "100% phí lãi suất trả góp",
   "value": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Định kỳ",
   "milestone": 3,
   "method": "Citime",
   "content": "100% phí lãi suất trả góp",
   "value": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Định kỳ",
   "milestone": 4,
   "method": "Citime",
   "content": "100% phí lãi suất trả góp",
   "value": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Định kỳ",
   "milestone": 5,
   "method": "Citime",
   "content": "100% phí lãi suất trả góp",
   "value": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Định kỳ",
   "milestone": 6,
   "method": "Citime",
   "content": "100% phí lãi suất trả góp",
   "value": 0
  },
  {
   "label": "IELTS Mentor",
   "program": "Định kỳ",
   "milestone": 3,
   "method": "Giai đoạn",
   "content": "Voucher giảm học phí 500.000đ",
   "value": 500000
  },
  {
   "label": "IELTS Mentor",
   "program": "Định kỳ",
   "milestone": 4,
   "method": "Giai đoạn",
   "content": "Voucher giảm học phí 800.000đ",
   "value": 800000
  },
  {
   "label": "IELTS Mentor",
   "program": "Định kỳ",
   "milestone": 5,
   "method": "Giai đoạn",
   "content": "Voucher giảm học phí 1.000.000đ",
   "value": 1000000
  },
  {
   "label": "IELTS Mentor",
   "program": "Định kỳ",
   "milestone": 6,
   "method": "Giai đoạn",
   "content": "Voucher giảm học phí 1.500.000đ",
   "value": 1500000
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Định kỳ",
   "milestone": 1,
   "method": "Full",
   "content": "Bộ quà tặng trị giá 1.140.000đ",
   "value": 1140000
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Định kỳ",
   "milestone": 2,
   "method": "Full",
   "content": "Bộ quà tặng trị giá 1.650.000đ",
   "value": 1650000
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Định kỳ",
   "milestone": 3,
   "method": "Full",
   "content": "Bộ quà tặng trị giá 2.000.000đ",
   "value": 2000000
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Định kỳ",
   "milestone": 4,
   "method": "Full",
   "content": "Bộ quà tặng trị giá 3.260.000đ",
   "value": 3260000
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Định kỳ",
   "milestone": 5,
   "method": "Full",
   "content": "Bộ quà tặng trị giá 4.850.000đ",
   "value": 4850000
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Định kỳ",
   "milestone": 6,
   "method": "Full",
   "content": "Bộ quà tặng trị giá 5.200.000đ",
   "value": 5200000
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Định kỳ",
   "milestone": 2,
   "method": "Ngân hàng",
   "content": "Bộ quà tặng trị giá 1.140.000đ",
   "value": 1140000
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Định kỳ",
   "milestone": 3,
   "method": "Ngân hàng",
   "content": "Bộ quà tặng trị giá 1.140.000đ",
   "value": 1140000
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Định kỳ",
   "milestone": 4,
   "method": "Ngân hàng",
   "content": "Bộ quà tặng trị giá 2.470.000đ",
   "value": 2470000
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Định kỳ",
   "milestone": 5,
   "method": "Ngân hàng",
   "content": "Bộ quà tặng trị giá 2.470.000đ",
   "value": 2470000
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Định kỳ",
   "milestone": 6,
   "method": "Ngân hàng",
   "content": "Bộ quà tặng trị giá 3.260.000đ",
   "value": 3260000
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Định kỳ",
   "milestone": 2,
   "method": "Citime",
   "content": "100% phí lãi suất trả góp",
   "value": 0
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Định kỳ",
   "milestone": 3,
   "method": "Citime",
   "content": "100% phí lãi suất trả góp",
   "value": 0
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Định kỳ",
   "milestone": 4,
   "method": "Citime",
   "content": "100% phí lãi suất trả góp",
   "value": 0
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Định kỳ",
   "milestone": 5,
   "method": "Citime",
   "content": "100% phí lãi suất trả góp",
   "value": 0
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Định kỳ",
   "milestone": 6,
   "method": "Citime",
   "content": "100% phí lãi suất trả góp",
   "value": 0
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Định kỳ",
   "milestone": 3,
   "method": "Giai đoạn",
   "content": "Voucher giảm học phí 500.000đ",
   "value": 500000
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Định kỳ",
   "milestone": 4,
   "method": "Giai đoạn",
   "content": "Voucher giảm học phí 800.000đ",
   "value": 800000
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Định kỳ",
   "milestone": 5,
   "method": "Giai đoạn",
   "content": "Voucher giảm học phí 1.000.000đ",
   "value": 1000000
  },
  {
   "label": "CLASSUP 1-8",
   "program": "Định kỳ",
   "milestone": 6,
   "method": "Giai đoạn",
   "content": "Voucher giảm học phí 1.500.000đ",
   "value": 1500000
  },
  {
   "label": "CLASSUP 1-1",
   "program": "Định kỳ",
   "milestone": 1,
   "method": "Full",
   "content": "Bộ quà tặng trị giá 1.650.000đ",
   "value": 1650000
  },
  {
   "label": "CLASSUP 1-1",
   "program": "Định kỳ",
   "milestone": 2,
   "method": "Full",
   "content": "Bộ quà tặng trị giá 2.000.000đ",
   "value": 2000000
  },
  {
   "label": "CLASSUP 1-1",
   "program": "Định kỳ",
   "milestone": 3,
   "method": "Full",
   "content": "Bộ quà tặng trị giá 2.470.000đ",
   "value": 2470000
  },
  {
   "label": "CLASSUP 1-1",
   "program": "Định kỳ",
   "milestone": 4,
   "method": "Full",
   "content": "Bộ quà tặng trị giá 3.260.000đ",
   "value": 3260000
  },
  {
   "label": "CLASSUP 1-1",
   "program": "Định kỳ",
   "milestone": 5,
   "method": "Full",
   "content": "Bộ quà tặng trị giá 4.850.000đ",
   "value": 4850000
  },
  {
   "label": "CLASSUP 1-1",
   "program": "Định kỳ",
   "milestone": 6,
   "method": "Full",
   "content": "Bộ quà tặng trị giá 5.200.000đ",
   "value": 5200000
  }
 ],
 "routes": [
  {
   "label": "IELTS Mentor",
   "output": "5.5+",
   "code": "M1_BT55_READY",
   "name": "IE6.5(M1) + BT5.5 + Ready",
   "items": [
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "BT5.5",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Offline"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "5.5+",
   "code": "IE45_M1_BT55_READY",
   "name": "IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "items": [
    {
     "code": "IE4.5",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "BT5.5",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Offline"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "5.5+",
   "code": "PRE_IE45_M1_BT55_READY",
   "name": "PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "items": [
    {
     "code": "PRE",
     "mode": "Offline"
    },
    {
     "code": "IE4.5",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "BT5.5",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Offline"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "5.5+",
   "code": "BS_PRE_IE45_M1_BT55_READY",
   "name": "BS + PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "items": [
    {
     "code": "BS",
     "mode": "Offline"
    },
    {
     "code": "PRE",
     "mode": "Offline"
    },
    {
     "code": "IE4.5",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "BT5.5",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Offline"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "5.5+",
   "code": "MA_BS_PRE_IE45_M1_BT55_READY",
   "name": "Module A + BS + PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "items": [
    {
     "code": "Module A",
     "mode": "Online"
    },
    {
     "code": "BS",
     "mode": "Offline"
    },
    {
     "code": "PRE",
     "mode": "Offline"
    },
    {
     "code": "IE4.5",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "BT5.5",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Offline"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "5.5+",
   "code": "MA_MB_BS_PRE_IE45_M1_BT55_READY",
   "name": "Module A + Module B + BS + PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "items": [
    {
     "code": "Module A",
     "mode": "Online"
    },
    {
     "code": "Module B",
     "mode": "Online"
    },
    {
     "code": "BS",
     "mode": "Offline"
    },
    {
     "code": "PRE",
     "mode": "Offline"
    },
    {
     "code": "IE4.5",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "BT5.5",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Offline"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "6.5+",
   "code": "M1_M2",
   "name": "IE6.5(M1) + IE6.5(M2)",
   "items": [
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Offline"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "6.5+",
   "code": "M2_READY",
   "name": "IE6.5(M2) + Ready",
   "items": [
    {
     "code": "IE6.5(M2)",
     "mode": "Offline"
    },
    {
     "code": "Ready",
     "mode": "Offline"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "6.5+",
   "code": "IE45_M1_M2",
   "name": "IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "items": [
    {
     "code": "IE4.5",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Offline"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "6.5+",
   "code": "M1_M2_READY",
   "name": "IE6.5(M1) + IE6.5(M2) + Ready",
   "items": [
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Offline"
    },
    {
     "code": "Ready",
     "mode": "Offline"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "6.5+",
   "code": "PRE_IE45_M1_M2",
   "name": "PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "items": [
    {
     "code": "PRE",
     "mode": "Offline"
    },
    {
     "code": "IE4.5",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Offline"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "6.5+",
   "code": "IE45_M1_M2_READY",
   "name": "IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "items": [
    {
     "code": "IE4.5",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Offline"
    },
    {
     "code": "Ready",
     "mode": "Offline"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "6.5+",
   "code": "BS_PRE_IE45_M1_M2",
   "name": "BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "items": [
    {
     "code": "BS",
     "mode": "Offline"
    },
    {
     "code": "PRE",
     "mode": "Offline"
    },
    {
     "code": "IE4.5",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Offline"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "6.5+",
   "code": "PRE_IE45_M1_M2_READY",
   "name": "PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "items": [
    {
     "code": "PRE",
     "mode": "Offline"
    },
    {
     "code": "IE4.5",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Offline"
    },
    {
     "code": "Ready",
     "mode": "Offline"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "6.5+",
   "code": "BS_PRE_IE45_M1_M2_READY",
   "name": "BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "items": [
    {
     "code": "BS",
     "mode": "Offline"
    },
    {
     "code": "PRE",
     "mode": "Offline"
    },
    {
     "code": "IE4.5",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Offline"
    },
    {
     "code": "Ready",
     "mode": "Offline"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "6.5+",
   "code": "MA_MB_BS_PRE_IE45_M1_M2",
   "name": "Module A + Module B + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "items": [
    {
     "code": "Module A",
     "mode": "Online"
    },
    {
     "code": "Module B",
     "mode": "Online"
    },
    {
     "code": "BS",
     "mode": "Offline"
    },
    {
     "code": "PRE",
     "mode": "Offline"
    },
    {
     "code": "IE4.5",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Offline"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "6.5+",
   "code": "MA_MB_BS_PRE_IE45_M1_M2_READY",
   "name": "Module A + Module B + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "items": [
    {
     "code": "Module A",
     "mode": "Online"
    },
    {
     "code": "Module B",
     "mode": "Online"
    },
    {
     "code": "BS",
     "mode": "Offline"
    },
    {
     "code": "PRE",
     "mode": "Offline"
    },
    {
     "code": "IE4.5",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Offline"
    },
    {
     "code": "Ready",
     "mode": "Offline"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "7.0+",
   "code": "M2_IE70",
   "name": "IE6.5(M2) + IE7.0",
   "items": [
    {
     "code": "IE6.5(M2)",
     "mode": "Offline"
    },
    {
     "code": "IE7.0",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "7.0+",
   "code": "M1_M2_IE70",
   "name": "IE6.5(M1) + IE6.5(M2) + IE7.0",
   "items": [
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Offline"
    },
    {
     "code": "IE7.0",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "7.0+",
   "code": "IE45_M1_M2_IE70",
   "name": "IE4.5 + IE6.5(M1) + IE6.5(M2) + IE7.0",
   "items": [
    {
     "code": "IE4.5",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Offline"
    },
    {
     "code": "IE7.0",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "7.0+",
   "code": "PRE_IE45_M1_M2_IE70",
   "name": "PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + IE7.0",
   "items": [
    {
     "code": "PRE",
     "mode": "Offline"
    },
    {
     "code": "IE4.5",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Offline"
    },
    {
     "code": "IE7.0",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "7.0+",
   "code": "BS_PRE_IE45_M1_M2_IE70",
   "name": "BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + IE7.0",
   "items": [
    {
     "code": "BS",
     "mode": "Offline"
    },
    {
     "code": "PRE",
     "mode": "Offline"
    },
    {
     "code": "IE4.5",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Offline"
    },
    {
     "code": "IE7.0",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "IELTS Mentor",
   "output": "7.0+",
   "code": "MA_MB_BS_PRE_IE45_M1_M2_IE70",
   "name": "Module A + Module B + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + IE7.0",
   "items": [
    {
     "code": "Module A",
     "mode": "Online"
    },
    {
     "code": "Module B",
     "mode": "Online"
    },
    {
     "code": "BS",
     "mode": "Offline"
    },
    {
     "code": "PRE",
     "mode": "Offline"
    },
    {
     "code": "IE4.5",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Offline"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Offline"
    },
    {
     "code": "IE7.0",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-8",
   "output": "5.5+",
   "code": "M1_BT55_READY",
   "name": "IE6.5(M1) + BT5.5 + Ready",
   "items": [
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "BT5.5",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-8",
   "output": "5.5+",
   "code": "IE45_M1_BT55_READY",
   "name": "IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "items": [
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "BT5.5",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-8",
   "output": "5.5+",
   "code": "PRE_IE45_M1_BT55_READY",
   "name": "PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "items": [
    {
     "code": "PRE",
     "mode": "Online"
    },
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "BT5.5",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-8",
   "output": "5.5+",
   "code": "BS_PRE_IE45_M1_BT55_READY",
   "name": "BS + PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "items": [
    {
     "code": "BS",
     "mode": "Online"
    },
    {
     "code": "PRE",
     "mode": "Online"
    },
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "BT5.5",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-8",
   "output": "5.5+",
   "code": "MA_BS_PRE_IE45_M1_BT55_READY",
   "name": "Module A + BS + PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "items": [
    {
     "code": "Module A",
     "mode": "Online"
    },
    {
     "code": "BS",
     "mode": "Online"
    },
    {
     "code": "PRE",
     "mode": "Online"
    },
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "BT5.5",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-8",
   "output": "5.5+",
   "code": "MA_MB_BS_PRE_IE45_M1_BT55_READY",
   "name": "Module A + Module B + BS + PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "items": [
    {
     "code": "Module A",
     "mode": "Online"
    },
    {
     "code": "Module B",
     "mode": "Online"
    },
    {
     "code": "BS",
     "mode": "Online"
    },
    {
     "code": "PRE",
     "mode": "Online"
    },
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "BT5.5",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-8",
   "output": "6.5+",
   "code": "M1_M2",
   "name": "IE6.5(M1) + IE6.5(M2)",
   "items": [
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-8",
   "output": "6.5+",
   "code": "M2_READY",
   "name": "IE6.5(M2) + Ready",
   "items": [
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-8",
   "output": "6.5+",
   "code": "IE45_M1_M2",
   "name": "IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "items": [
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-8",
   "output": "6.5+",
   "code": "M1_M2_READY",
   "name": "IE6.5(M1) + IE6.5(M2) + Ready",
   "items": [
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-8",
   "output": "6.5+",
   "code": "PRE_IE45_M1_M2",
   "name": "PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "items": [
    {
     "code": "PRE",
     "mode": "Online"
    },
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-8",
   "output": "6.5+",
   "code": "IE45_M1_M2_READY",
   "name": "IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "items": [
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-8",
   "output": "6.5+",
   "code": "BS_PRE_IE45_M1_M2",
   "name": "BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "items": [
    {
     "code": "BS",
     "mode": "Online"
    },
    {
     "code": "PRE",
     "mode": "Online"
    },
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-8",
   "output": "6.5+",
   "code": "PRE_IE45_M1_M2_READY",
   "name": "PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "items": [
    {
     "code": "PRE",
     "mode": "Online"
    },
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-8",
   "output": "6.5+",
   "code": "BS_PRE_IE45_M1_M2_READY",
   "name": "BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "items": [
    {
     "code": "BS",
     "mode": "Online"
    },
    {
     "code": "PRE",
     "mode": "Online"
    },
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-8",
   "output": "6.5+",
   "code": "MA_MB_BS_PRE_IE45_M1_M2",
   "name": "Module A + Module B + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "items": [
    {
     "code": "Module A",
     "mode": "Online"
    },
    {
     "code": "Module B",
     "mode": "Online"
    },
    {
     "code": "BS",
     "mode": "Online"
    },
    {
     "code": "PRE",
     "mode": "Online"
    },
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-8",
   "output": "6.5+",
   "code": "MA_MB_BS_PRE_IE45_M1_M2_READY",
   "name": "Module A + Module B + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "items": [
    {
     "code": "Module A",
     "mode": "Online"
    },
    {
     "code": "Module B",
     "mode": "Online"
    },
    {
     "code": "BS",
     "mode": "Online"
    },
    {
     "code": "PRE",
     "mode": "Online"
    },
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-1",
   "output": "5.5+",
   "code": "M1_BT55_READY",
   "name": "IE6.5(M1) + BT5.5 + Ready",
   "items": [
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "BT5.5",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-1",
   "output": "5.5+",
   "code": "IE45_M1_BT55_READY",
   "name": "IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "items": [
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "BT5.5",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-1",
   "output": "5.5+",
   "code": "PRE_IE45_M1_BT55_READY",
   "name": "PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "items": [
    {
     "code": "PRE",
     "mode": "Online"
    },
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "BT5.5",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-1",
   "output": "5.5+",
   "code": "BS_PRE_IE45_M1_BT55_READY",
   "name": "BS + PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "items": [
    {
     "code": "BS",
     "mode": "Online"
    },
    {
     "code": "PRE",
     "mode": "Online"
    },
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "BT5.5",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-1",
   "output": "5.5+",
   "code": "MA_BS_PRE_IE45_M1_BT55_READY",
   "name": "Module A + BS + PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "items": [
    {
     "code": "Module A",
     "mode": "Online"
    },
    {
     "code": "BS",
     "mode": "Online"
    },
    {
     "code": "PRE",
     "mode": "Online"
    },
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "BT5.5",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-1",
   "output": "5.5+",
   "code": "MA_MB_BS_PRE_IE45_M1_BT55_READY",
   "name": "Module A + Module B + BS + PRE + IE4.5 + IE6.5(M1) + BT5.5 + Ready",
   "items": [
    {
     "code": "Module A",
     "mode": "Online"
    },
    {
     "code": "Module B",
     "mode": "Online"
    },
    {
     "code": "BS",
     "mode": "Online"
    },
    {
     "code": "PRE",
     "mode": "Online"
    },
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "BT5.5",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-1",
   "output": "6.5+",
   "code": "M1_M2",
   "name": "IE6.5(M1) + IE6.5(M2)",
   "items": [
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-1",
   "output": "6.5+",
   "code": "M2_READY",
   "name": "IE6.5(M2) + Ready",
   "items": [
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-1",
   "output": "6.5+",
   "code": "IE45_M1_M2",
   "name": "IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "items": [
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-1",
   "output": "6.5+",
   "code": "M1_M2_READY",
   "name": "IE6.5(M1) + IE6.5(M2) + Ready",
   "items": [
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-1",
   "output": "6.5+",
   "code": "PRE_IE45_M1_M2",
   "name": "PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "items": [
    {
     "code": "PRE",
     "mode": "Online"
    },
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-1",
   "output": "6.5+",
   "code": "IE45_M1_M2_READY",
   "name": "IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "items": [
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-1",
   "output": "6.5+",
   "code": "BS_PRE_IE45_M1_M2",
   "name": "BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "items": [
    {
     "code": "BS",
     "mode": "Online"
    },
    {
     "code": "PRE",
     "mode": "Online"
    },
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-1",
   "output": "6.5+",
   "code": "PRE_IE45_M1_M2_READY",
   "name": "PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "items": [
    {
     "code": "PRE",
     "mode": "Online"
    },
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-1",
   "output": "6.5+",
   "code": "BS_PRE_IE45_M1_M2_READY",
   "name": "BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "items": [
    {
     "code": "BS",
     "mode": "Online"
    },
    {
     "code": "PRE",
     "mode": "Online"
    },
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-1",
   "output": "6.5+",
   "code": "MA_MB_BS_PRE_IE45_M1_M2",
   "name": "Module A + Module B + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2)",
   "items": [
    {
     "code": "Module A",
     "mode": "Online"
    },
    {
     "code": "Module B",
     "mode": "Online"
    },
    {
     "code": "BS",
     "mode": "Online"
    },
    {
     "code": "PRE",
     "mode": "Online"
    },
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    }
   ]
  },
  {
   "label": "CLASSUP 1-1",
   "output": "6.5+",
   "code": "MA_MB_BS_PRE_IE45_M1_M2_READY",
   "name": "Module A + Module B + BS + PRE + IE4.5 + IE6.5(M1) + IE6.5(M2) + Ready",
   "items": [
    {
     "code": "Module A",
     "mode": "Online"
    },
    {
     "code": "Module B",
     "mode": "Online"
    },
    {
     "code": "BS",
     "mode": "Online"
    },
    {
     "code": "PRE",
     "mode": "Online"
    },
    {
     "code": "IE4.5",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M1)",
     "mode": "Online"
    },
    {
     "code": "IE6.5(M2)",
     "mode": "Online"
    },
    {
     "code": "Ready",
     "mode": "Online"
    }
   ]
  }
 ]
};
