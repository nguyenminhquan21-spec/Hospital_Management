# 🏥 Hospital Booking API - Integration Guide

## 📋 Overview

Đây là trọn bộ Booking API hoàn chỉnh với các tính năng:
- ✅ **Token-based Authentication** - Xác thực với JWT token
- ✅ **Input Validation** - Validation middleware kiểm tra toàn bộ input
- ✅ **Error Handling** - Trả về error codes chi tiết
- ✅ **CRUD Operations** - Create, Read, Update, Cancel booking
- ✅ **Role-based Access** - Admin-only endpoints

---

## 📁 File Structure

```
server/
├── models/
│   └── booking.js                    # Schema với validation
├── middleware/
│   └── validateBooking.js            # Input validation middleware
├── controllers/
│   └── bookingController.js          # Business logic (CRUD)
├── routes/
│   └── bookingRoutes.js              # API endpoints
├── BOOKING_API_GUIDE.md              # Hướng dẫn chi tiết
├── BOOKING_API_CURL_EXAMPLES.sh      # cURL examples
├── test-booking-api.mjs              # Node.js test script
└── test-booking-api.ps1              # PowerShell test script
```

---

## 🚀 Quick Start

### Step 1: Copy Files to Your Project
Tất cả các file đã được tạo trong đúng folder tương ứng.

### Step 2: Register Routes in `index.js`

Thêm dòng này vào file server chính của bạn (ví dụ: `server/index.js`):

```javascript
import bookingRoutes from "./routes/bookingRoutes.js";

// Add before other routes
app.use("/api/bookings", bookingRoutes);
```

### Step 3: Verify Database Connection
Đảm bảo MongoDB connection đã được setup trong project của bạn.

### Step 4: Test API

**Option 1: Node.js Test**
```bash
node test-booking-api.mjs
```

**Option 2: PowerShell Test**
```powershell
.\test-booking-api.ps1
```

**Option 3: Using Postman**
- Import `BOOKING_API_CURL_EXAMPLES.sh` hoặc tạo request theo hướng dẫn

---

## 📡 API Endpoints Summary

### User Endpoints (Require Authentication)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/bookings/` | Tạo booking mới | ✅ Required |
| GET | `/api/bookings/my-bookings` | Lấy bookings của user | ✅ Required |
| GET | `/api/bookings/:id` | Lấy chi tiết booking | ✅ Required |
| PUT | `/api/bookings/:id` | Cập nhật booking | ✅ Required |
| DELETE | `/api/bookings/:id/cancel` | Hủy booking | ✅ Required |

### Admin Endpoints (Require Authentication + Admin Role)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/bookings/admin/all-bookings` | Lấy tất cả bookings | ✅ Admin |

---

## 🧪 Test Cases

### 1. Tạo Booking Thành Công (201)

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Nguyen Van A",
    "patientEmail": "a@example.com",
    "patientPhone": "0912345678",
    "doctorId": "DOCTOR_ID",
    "appointmentDate": "2026-02-15T10:00:00Z",
    "timeSlot": "10:00",
    "reason": "General Checkup"
  }'
```

**Response:**
```json
{
  "success": true,
  "code": 201,
  "message": "Booking created successfully",
  "data": { /* booking object */ }
}
```

---

### 2. Validation Error (400)

**Khi input không hợp lệ:**
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "A",
    "patientEmail": "invalid-email",
    "patientPhone": "123",
    "doctorId": "DOCTOR_ID",
    "appointmentDate": "2020-01-01T10:00:00Z",
    "timeSlot": "99:99",
    "reason": ""
  }'
```

**Response:**
```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "code": 400,
      "field": "patientName",
      "message": "Patient name must be at least 2 characters"
    },
    {
      "code": 400,
      "field": "patientEmail",
      "message": "Valid email is required"
    },
    {
      "code": 400,
      "field": "appointmentDate",
      "message": "Appointment date must be in the future"
    }
  ]
}
```

---

### 3. Unauthorized Access (401)

**Khi không có token:**
```bash
curl -X GET http://localhost:5000/api/bookings/my-bookings
```

**Response:**
```json
{
  "success": false,
  "code": 401,
  "message": "Unauthorized"
}
```

---

### 4. Doctor Not Found (404)

**Khi doctorId không tồn tại:**
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Test",
    "patientEmail": "test@example.com",
    "patientPhone": "0912345678",
    "doctorId": "invalid-id",
    "appointmentDate": "2026-02-15T10:00:00Z",
    "timeSlot": "10:00",
    "reason": "Checkup"
  }'
```

**Response:**
```json
{
  "success": false,
  "code": 404,
  "message": "Doctor not found"
}
```

---

### 5. Duplicate Booking (409)

**Khi user tạo booking trùng lặp:**
```json
{
  "success": false,
  "code": 409,
  "message": "You already have a booking with this doctor at this time"
}
```

---

## ✅ Validation Rules

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| patientName | String | ✅ | Min 2 chars |
| patientEmail | String | ✅ | Valid email format |
| patientPhone | String | ✅ | 10+ digits |
| doctorId | ObjectId | ✅ | Must exist in DB |
| appointmentDate | Date | ✅ | Must be in future |
| timeSlot | String | ✅ | One of: 09:00, 10:00, 11:00, 14:00, 15:00, 16:00 |
| reason | String | ✅ | Max 500 chars |
| notes | String | ❌ | Max 1000 chars |

---

## 🔐 Error Codes

| Code | Status | Meaning | Solution |
|------|--------|---------|----------|
| 400 | Bad Request | Validation error | Check input fields |
| 401 | Unauthorized | Missing/Invalid token | Add valid token |
| 403 | Forbidden | Permission denied | User accessing others' data |
| 404 | Not Found | Resource not found | Doctor/Booking doesn't exist |
| 409 | Conflict | Duplicate resource | Booking already exists |
| 500 | Server Error | Server error | Contact admin |

---

## 💻 Frontend Integration Example

### React Example
```javascript
import { useState } from 'react';

function BookingForm() {
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    doctorId: '',
    appointmentDate: '',
    timeSlot: '10:00',
    reason: ''
  });
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.success) {
      alert('Booking created successfully!');
      // Redirect or reset form
    } else {
      if (result.errors) {
        setErrors(result.errors);
      } else {
        alert(result.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Patient Name"
        value={formData.patientName}
        onChange={(e) => setFormData({...formData, patientName: e.target.value})}
        required
      />
      {/* ... other fields ... */}
      <button type="submit">Create Booking</button>
      
      {errors.length > 0 && (
        <ul>
          {errors.map((err, i) => (
            <li key={i}>{err.field}: {err.message}</li>
          ))}
        </ul>
      )}
    </form>
  );
}
```

---

## 🐛 Troubleshooting

### Issue: "Cannot POST /api/bookings"
**Solution:** Đảm bảo routes đã được register trong `index.js`

### Issue: "Unauthorized"
**Solution:** Thêm valid JWT token trong Authorization header

### Issue: "Doctor not found"
**Solution:** Sử dụng valid Doctor ID từ GET /api/doctors

### Issue: "Validation failed"
**Solution:** Kiểm tra tất cả required fields và format của chúng

### Issue: "You already have a booking..."
**Solution:** Người dùng đã có booking với bác sĩ này ở khung giờ này. Hãy chọn khác.

---

## 📚 Additional Resources

- [BOOKING_API_GUIDE.md](./BOOKING_API_GUIDE.md) - Chi tiết về từng endpoint
- [BOOKING_API_CURL_EXAMPLES.sh](./BOOKING_API_CURL_EXAMPLES.sh) - cURL examples
- [test-booking-api.mjs](./test-booking-api.mjs) - Node.js test script
- [test-booking-api.ps1](./test-booking-api.ps1) - PowerShell test script

---

## 🎯 Next Steps

1. ✅ Copy files vào project
2. ✅ Register routes trong index.js
3. ✅ Run test để verify
4. ✅ Tích hợp vào frontend
5. ✅ Deploy lên Azure

---

## 📞 Support

Nếu có bất kỳ vấn đề gì, kiểm tra:
1. Error response message
2. Validation rules
3. Token validity
4. Doctor/User existence

Happy coding! 🚀
