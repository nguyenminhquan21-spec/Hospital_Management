# 📊 HƯỚNG DẪN CHECK DATABASE CHO NHÓM KHÁC

## ✅ CÓ GÌ TRONG DỰ ÁN:

### 1️⃣ **Hướng dẫn sẵn có:**
- ✅ [VIEWER_USER_GUIDE.md](./VIEWER_USER_GUIDE.md) - Tạo user read-only
- ✅ [HOW_TO_TEST_IN_BROWSER.md](./HOW_TO_TEST_IN_BROWSER.md) - Test API bằng Postman
- ✅ [POSTMAN_COLLECTION.json](./Postman_Collection.json) - Import vào Postman
- ✅ [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Tổng hợp APIs

### 2️⃣ **Script kiểm tra database:**
```bash
# Kiểm tra kết nối MongoDB
node test-other-database.js

# Check products collection
node check-products.js

# Test tất cả APIs
node test-apis.mjs
```

### 3️⃣ **Connection String:**
Để check database bằng MongoDB Compass hoặc mongosh:
```
mongodb+srv://viewer_user:viewer123456@cluster0.tke6n1k.mongodb.net/hospital
```

---

## 📝 CHECKLIST CÓ ĐẦY ĐỦ:

### ✅ **Để nhóm khác CHECK DATABASE:**

**Cách 1: Dùng MongoDB Compass** ← Dễ nhất
- Tải: https://www.mongodb.com/try/download/compass
- Paste connection string → Connect
- Xem tất cả collections và data

**Cách 2: Dùng mongosh CLI**
```bash
mongosh "mongodb+srv://viewer_user:viewer123456@cluster0.tke6n1k.mongodb.net/hospital"
db.products.find()
db.doctors.find()
db.appointments.find()
```

**Cách 3: Dùng Node.js script** (đã có sẵn)
```bash
node check-products.js
```

---

## ⚠️ CÒN THIẾU:

❌ **Nếu connection failed:**
1. **Check MongoDB Atlas Network Access** - Thêm IP whitelist
2. **Verify user credentials** - `viewer_user` có tồn tại không?
3. **Check cluster URL** - `cluster0.tke6n1k.mongodb.net` đúng không?

---

## 📚 COLLECTIONS CÓ TRONG DATABASE:

Theo PROJECT_SUMMARY.md, database `hospital` có:
- `doctors` - Danh sách bác sĩ
- `medicines` - Danh sách thuốc
- `appointments` - Lịch hẹn khám
- `checkups` - Kiểm tra sức khỏe
- `surgeries` - Phẫu thuật
- `labs` - Xét nghiệm
- `contacts` - Liên hệ
- `users` - Tài khoản

---

## ✨ KHUYẾN CÁO:

Bạn nên:
1. ✅ Copy [test-other-database.js](./test-other-database.js) cho nhóm khác
2. ✅ Cung cấp **full connection string**
3. ✅ Đảm bảo **IP được whitelist** trên MongoDB Atlas
4. ✅ Test kết nối trước khi gửi cho họ

