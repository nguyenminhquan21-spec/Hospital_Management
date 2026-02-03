# 🏥 Hospital Management API - Complete Documentation

## 📋 Mục Lục
1. [Tổng Quan](#tổng-quan)
2. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
3. [Cài Đặt & Chạy Server](#cài-đặt--chạy-server)
4. [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
5. [Authentication](#authentication)
6. [API Endpoints](#api-endpoints)
7. [Booking API](#booking-api)
8. [Error Codes](#error-codes)
9. [Testing](#testing)

---

## 🎯 Tổng Quan

| Thành Phần | Chi Tiết |
|-----------|---------|
| **Backend Framework** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (JSON Web Token) |
| **Port** | 5000 (mặc định) |
| **Validation** | Custom middleware + Schema validation |

---

## 📦 Yêu Cầu Hệ Thống

```bash
Node.js v16+
npm hoặc yarn
MongoDB Atlas (hoặc local MongoDB)
```

---

## 🚀 Cài Đặt & Chạy Server

### 1️⃣ Cài Đặt Dependencies
```bash
cd server
npm install
```

### 2️⃣ Cấu Hình .env
```env
MONGO_URI=mongodb+srv://demo_viewer:demo123456@cluster0.tke6n1k.mongodb.net/hospital
JWT_SECRET=anything_secret
PORT=5000
```

### 3️⃣ Chạy Server
```bash
node index.js
```

✅ Output mong đợi:
```
[dotenv] injecting env from .env
Connecting to MongoDB URI: mongodb+srv://...
Server is running on port 5000
✅ MongoDB Connected
```

---

## 📁 Cấu Trúc Dự Án

```
server/
├── models/                    # Database schemas
│   ├── doctor.js             # Doctor schema
│   ├── booking.js            # Booking schema (NEW)
│   ├── medicines.js          # Medicine schema
│   ├── checkup.js            # Checkup schema
│   ├── lab.js                # Lab schema
│   ├── surgery.js            # Surgery schema
│   ├── contact.js            # Contact schema
│   └── User.js               # User schema
│
├── controllers/              # Business logic
│   ├── authController.js     # Login/Register logic
│   ├── bookingController.js  # Booking logic (NEW - 6 functions)
│   ├── adminController.js    # Admin operations
│   ├── medicineController.js # Medicine operations
│   └── viewerController.js   # Viewer operations
│
├── routes/                   # API endpoints
│   ├── authRoutes.js         # /api/auth/*
│   ├── bookingRoutes.js      # /api/bookings/* (NEW)
│   ├── doctorRoutes.js       # /api/doctors/*
│   ├── adminRoutes.js        # /api/admin/*
│   ├── medicineRoutes.js     # /api/admin/medicines/*
│   ├── contactRoutes.js      # /api/contact/*
│   └── emergencyRoutes.js    # /api/emergency/*
│
├── middleware/               # Request interceptors
│   ├── isAuthenticated.js    # JWT verification
│   ├── isAdmin.js            # Admin check
│   ├── doctorViewerOnly.js   # Doctor viewer check
│   ├── roleBasedAccess.js    # Role-based access
│   └── validateBooking.js    # Booking validation (NEW)
│
├── config/                   # Configuration
│   ├── passport.js           # Passport config
│   └── nodemailer.js         # Email config
│
├── data/                     # Sample data
│   ├── doctors.json          # Doctor data
│   └── medicines.json        # Medicine data
│
├── index.js                  # Main server file
├── package.json              # Dependencies
├── .env                      # Environment variables
│
└── tests/
    ├── test-booking-api.mjs  # Node.js test suite
    ├── test-booking-api.ps1  # PowerShell test suite
    ├── test-api-web.html     # Web UI test
    └── Booking_API_Collection.json # Postman collection
```

---

## 🔐 Authentication

### 1. Register (Tạo Tài Khoản)

**Endpoint:**
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "Minh Quan",
  "email": "test@example.com",
  "password": "Test@1234"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "user",
  "message": "Registered successfully"
}
```

### 2. Login (Đăng Nhập)

**Endpoint:**
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "Test@1234"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "user"
}
```

### 3. Sử Dụng Token

Thêm vào **Header** của mọi request cần authentication:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📡 API Endpoints

### Doctors (Public - Không Cần Token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | Lấy danh sách tất cả bác sĩ |
| GET | `/api/doctors/:id` | Lấy thông tin 1 bác sĩ |

**Example:**
```bash
curl http://localhost:5000/api/doctors
```

### Auth (Không Cần Token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Tạo tài khoản mới |
| POST | `/api/auth/login` | Đăng nhập |

### Bookings (Cần Token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Tạo booking mới |
| GET | `/api/bookings` | Lấy bookings của user |
| GET | `/api/bookings/:id` | Lấy chi tiết 1 booking |
| PUT | `/api/bookings/:id` | Cập nhật booking |
| DELETE | `/api/bookings/:id` | Hủy booking |
| GET | `/api/bookings/admin/all` | Lấy tất cả bookings (Admin) |

---

## 🏥 Booking API (Chi Tiết)

### 1. Tạo Booking Mới

**Endpoint:**
```
POST /api/bookings
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "patientName": "Nguyen Van A",
  "patientEmail": "nguyenvana@example.com",
  "patientPhone": "0912345678",
  "doctorId": "65c1a2b3c4d5e6f7g8h9i0j1",
  "appointmentDate": "2025-02-15T10:00:00Z",
  "timeSlot": "10:00",
  "reason": "General Checkup",
  "notes": "First time patient"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "code": 201,
  "message": "Booking created successfully",
  "data": {
    "_id": "65c1a2b3c4d5e6f7g8h9i0j1",
    "patientName": "Nguyen Van A",
    "patientEmail": "nguyenvana@example.com",
    "patientPhone": "0912345678",
    "doctorId": "65c1a2b3c4d5e6f7g8h9i0j1",
    "appointmentDate": "2025-02-15T10:00:00.000Z",
    "timeSlot": "10:00",
    "reason": "General Checkup",
    "status": "pending",
    "createdAt": "2025-02-03T10:30:00.000Z"
  }
}
```

### 2. Lấy Bookings của User

**Endpoint:**
```
GET /api/bookings
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response (200 OK):**
```json
{
  "success": true,
  "code": 200,
  "message": "Bookings retrieved successfully",
  "data": [
    {
      "_id": "65c1a2b3c4d5e6f7g8h9i0j1",
      "patientName": "Nguyen Van A",
      "appointmentDate": "2025-02-15T10:00:00.000Z",
      "timeSlot": "10:00",
      "status": "pending",
      "doctor": {
        "_id": "65c1a2b3c4d5e6f7g8h9i0j2",
        "name": "Dr. Tran Minh",
        "specialty": "Cardiology"
      }
    }
  ]
}
```

### 3. Lấy Chi Tiết 1 Booking

**Endpoint:**
```
GET /api/bookings/:id
```

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/bookings/65c1a2b3c4d5e6f7g8h9i0j1
```

### 4. Cập Nhật Booking

**Endpoint:**
```
PUT /api/bookings/:id
```

**Request Body (Chỉ có thể cập nhật những field này):**
```json
{
  "patientName": "Nguyen Van A Updated",
  "patientPhone": "0987654321",
  "reason": "Updated reason",
  "notes": "Updated notes"
}
```

**Lưu Ý:** Không thể cập nhật `appointmentDate`, `timeSlot`, `doctorId`, `status` qua endpoint này.

### 5. Hủy Booking

**Endpoint:**
```
DELETE /api/bookings/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "code": 200,
  "message": "Booking cancelled successfully",
  "data": {
    "status": "cancelled"
  }
}
```

### 6. Lấy Tất Cả Bookings (Admin)

**Endpoint:**
```
GET /api/bookings/admin/all
```

**Query Parameters (Optional):**
```
?status=pending&doctorId=65c1a2b3c4d5e6f7g8h9i0j2
```

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

---

## ❌ Error Codes

| Code | HTTP | Meaning | Example |
|------|------|---------|---------|
| 400 | 400 | Invalid input / Missing field | patientEmail không hợp lệ |
| 401 | 401 | Không có token hoặc token hết hạn | Missing Authorization header |
| 403 | 403 | Không có quyền (không phải admin/owner) | Cập nhật booking của user khác |
| 404 | 404 | Không tìm thấy resource | Doctor không tồn tại |
| 409 | 409 | Conflict - Trùng lịch | Booking trùng với lịch hiện có |
| 500 | 500 | Server error | Database connection failed |

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| patientName | Min 2 characters | "Patient name must be at least 2 characters" |
| patientEmail | Valid email format | "Please provide a valid email" |
| patientPhone | 10+ digits | "Please provide a valid phone number" |
| appointmentDate | Future date only | "Appointment date must be in the future" |
| timeSlot | Enum values | "Invalid time slot" |

**Valid Time Slots:** `09:00`, `10:00`, `11:00`, `14:00`, `15:00`, `16:00`

---

## 🧪 Testing

### Method 1: Node.js Test Suite (Tự động)

```bash
cd server
node test-booking-api.mjs
```

**Output:**
```
========== TEST 1: LOGIN ==========
✅ Login successful

========== TEST 2: GET DOCTORS ==========
✅ Doctors retrieved successfully

========== TEST 3: CREATE BOOKING ==========
✅ Booking created successfully

[... 6 more tests ...]

✅ All tests passed!
```

### Method 2: PowerShell Test Suite (Windows)

```powershell
cd server
.\test-booking-api.ps1
```

### Method 3: Postman (GUI)

1. Import file: `Booking_API_Collection.json` vào Postman
2. Chạy từng request hoặc collection runner

### Method 4: cURL (Command Line)

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@1234"
  }'

# Get Token (from register response)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Create Booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "patientName": "Nguyen Van A",
    "patientEmail": "nguyenvana@example.com",
    "patientPhone": "0912345678",
    "doctorId": "DOCTOR_ID",
    "appointmentDate": "2025-02-15T10:00:00Z",
    "timeSlot": "10:00",
    "reason": "General Checkup"
  }'
```

### Method 5: Web UI Test

```bash
# Server đã chạy trên port 5000
# Mở browser: http://localhost:8000/test-api-web.html
# Hoặc khởi động HTTP server nếu chưa chạy:
npx http-server server -p 8000 -c-1
```

---

## 🔧 Middleware

### isAuthenticated
- **Vị trí:** `middleware/isAuthenticated.js`
- **Chức năng:** Kiểm tra JWT token hợp lệ
- **Trả về:** 401 nếu token không hợp lệ

### validateBooking
- **Vị trí:** `middleware/validateBooking.js`
- **Chức năng:** Validate input fields
- **Trả về:** 400 với danh sách lỗi nếu invalid

### isAdmin
- **Vị trí:** `middleware/isAdmin.js`
- **Chức năng:** Kiểm tra user có role admin
- **Trả về:** 403 nếu không phải admin

---

## 📊 Database Schema

### Booking Schema
```javascript
{
  patientName: String (required, min 2 chars),
  patientEmail: String (required, valid email),
  patientPhone: String (required, 10+ digits),
  doctorId: ObjectId (ref: Doctor),
  appointmentDate: Date (required, future date),
  timeSlot: String (enum: 09:00-16:00),
  reason: String (required),
  notes: String (optional),
  status: String (enum: pending, confirmed, completed, cancelled),
  userId: ObjectId (ref: User),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Indexes
```javascript
userId, doctorId (for faster queries)
```

---

## 📝 Một số lưu ý quan trọng

1. **Token Expiry:** JWT token hết hạn sau 7 ngày
2. **Duplicate Booking:** Không thể đặt 2 lịch giống nhau (cùng doctor, date, time, user)
3. **Future Dates Only:** Chỉ có thể đặt lịch cho những ngày trong tương lai
4. **Authorization Header:** Phải là `Bearer <token>`, không phải chỉ token
5. **CORS:** Enabled cho tất cả origins

---

## 🚀 Quick Start

```bash
# 1. Cài dependencies
npm install

# 2. Chạy server
node index.js

# 3. Trong terminal khác, test API
node test-booking-api.mjs

# 4. Hoặc dùng Postman
# Import: Booking_API_Collection.json
```

---

## 📞 Support

- Server logs: Xem console của `node index.js`
- Database logs: Xem MongoDB Atlas dashboard
- API errors: Xem response status code và error message

---

**✅ Hoàn thành: Hospital Management API**

Tất cả 8 bước trong checklist đã được thực hiện:
1. ✅ Node.js + Express
2. ✅ MongoDB + Mongoose + .env
3. ✅ Doctor, Medicine, Booking models
4. ✅ Đúng routes (POST/GET/PUT/DELETE)
5. ✅ Controllers with business logic
6. ✅ Middleware (Auth, Validate, Admin)
7. ✅ Standard request/response format
8. ✅ Testing (Node.js, PowerShell, Postman, cURL, Web UI)
