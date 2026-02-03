# 📖 Booking API - Complete Guide

## Overview
Hướng dẫn đầy đủ để sử dụng Booking API với token + input params → insert booking → error codes

## 📁 File Structure
```
server/
├── models/
│   └── booking.js                 # Schema & Validation
├── middleware/
│   └── validateBooking.js         # Input Validation Middleware
├── controllers/
│   └── bookingController.js       # Business Logic
├── routes/
│   └── bookingRoutes.js           # API Endpoints
```

## 🔧 Integration Steps

### 1. Register Routes in Main Server (index.js)
```javascript
import bookingRoutes from "./routes/bookingRoutes.js";

// Add before other routes
app.use("/api/bookings", bookingRoutes);
```

### 2. Install Dependencies (if not exists)
```bash
npm install mongoose bcryptjs express
```

---

## 📡 API Endpoints

### 1. CREATE BOOKING
**POST** `/api/bookings/`

#### Headers
```
Authorization: Bearer {TOKEN}
Content-Type: application/json
```

#### Request Body
```json
{
  "patientName": "Nguyen Van A",
  "patientEmail": "nguyenvana@example.com",
  "patientPhone": "0912345678",
  "doctorId": "67a8c1d2e5f4a9b0c1d2e3f4",
  "appointmentDate": "2026-02-15T10:00:00Z",
  "timeSlot": "10:00",
  "reason": "General Checkup",
  "notes": "Optional notes"
}
```

#### Success Response (201)
```json
{
  "success": true,
  "code": 201,
  "message": "Booking created successfully",
  "data": {
    "_id": "67a8c1d2e5f4a9b0c1d2e3f5",
    "patientName": "Nguyen Van A",
    "patientEmail": "nguyenvana@example.com",
    "patientPhone": "0912345678",
    "doctorId": "67a8c1d2e5f4a9b0c1d2e3f4",
    "doctorName": "Dr. Tran B",
    "appointmentDate": "2026-02-15T10:00:00.000Z",
    "timeSlot": "10:00",
    "reason": "General Checkup",
    "status": "pending",
    "createdAt": "2026-02-03T10:30:00.000Z"
  }
}
```

#### Error Responses

**400 - Validation Error**
```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "errors": [
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

**401 - Unauthorized (No Token)**
```json
{
  "success": false,
  "code": 401,
  "message": "Unauthorized"
}
```

**404 - Doctor Not Found**
```json
{
  "success": false,
  "code": 404,
  "message": "Doctor not found"
}
```

**409 - Duplicate Booking**
```json
{
  "success": false,
  "code": 409,
  "message": "You already have a booking with this doctor at this time"
}
```

**500 - Server Error**
```json
{
  "success": false,
  "code": 500,
  "message": "Server error",
  "error": "Error details..."
}
```

---

### 2. GET MY BOOKINGS
**GET** `/api/bookings/my-bookings`

#### Headers
```
Authorization: Bearer {TOKEN}
```

#### Success Response (200)
```json
{
  "success": true,
  "code": 200,
  "message": "Bookings retrieved successfully",
  "count": 3,
  "data": [
    {
      "_id": "67a8c1d2e5f4a9b0c1d2e3f5",
      "patientName": "Nguyen Van A",
      "appointmentDate": "2026-02-15T10:00:00.000Z",
      "timeSlot": "10:00",
      "status": "pending",
      "doctorId": {
        "_id": "67a8c1d2e5f4a9b0c1d2e3f4",
        "name": "Dr. Tran B",
        "specialization": "Cardiology"
      }
    }
  ]
}
```

---

### 3. GET BOOKING BY ID
**GET** `/api/bookings/:bookingId`

#### Headers
```
Authorization: Bearer {TOKEN}
```

#### Success Response (200)
```json
{
  "success": true,
  "code": 200,
  "message": "Booking retrieved successfully",
  "data": { /* booking details */ }
}
```

#### Error Response (403)
```json
{
  "success": false,
  "code": 403,
  "message": "You do not have permission to view this booking"
}
```

---

### 4. UPDATE BOOKING
**PUT** `/api/bookings/:bookingId`

#### Headers
```
Authorization: Bearer {TOKEN}
Content-Type: application/json
```

#### Request Body (Only Allowed Fields)
```json
{
  "patientName": "Updated Name",
  "patientPhone": "0987654321",
  "reason": "Updated reason",
  "notes": "Updated notes"
}
```

**Note:** Cannot update `status`, `doctorId`, `appointmentDate`, `timeSlot` via this endpoint.

#### Success Response (200)
```json
{
  "success": true,
  "code": 200,
  "message": "Booking updated successfully",
  "data": { /* updated booking */ }
}
```

---

### 5. CANCEL BOOKING
**DELETE** `/api/bookings/:bookingId/cancel`

#### Headers
```
Authorization: Bearer {TOKEN}
```

#### Success Response (200)
```json
{
  "success": true,
  "code": 200,
  "message": "Booking cancelled successfully",
  "data": { /* cancelled booking */ }
}
```

#### Error Response (400)
```json
{
  "success": false,
  "code": 400,
  "message": "Booking is already cancelled"
}
```

---

### 6. GET ALL BOOKINGS (Admin Only)
**GET** `/api/bookings/admin/all-bookings`

#### Headers
```
Authorization: Bearer {ADMIN_TOKEN}
```

#### Query Parameters
- `status`: pending, confirmed, completed, cancelled
- `doctorId`: Doctor ID to filter by
- `sortBy`: newest (default: by appointment date)

#### Example
```
GET /api/bookings/admin/all-bookings?status=pending&sortBy=newest
```

#### Success Response (200)
```json
{
  "success": true,
  "code": 200,
  "message": "All bookings retrieved successfully",
  "count": 5,
  "data": [ /* bookings */ ]
}
```

---

## 🧪 Test Examples

### Using Postman
1. **Create Booking**
   - Method: POST
   - URL: `http://localhost:5000/api/bookings/`
   - Headers: `Authorization: Bearer YOUR_TOKEN`
   - Body (raw JSON):
   ```json
   {
     "patientName": "Nguyen Van A",
     "patientEmail": "nguyenvana@example.com",
     "patientPhone": "0912345678",
     "doctorId": "DOCTOR_ID_HERE",
     "appointmentDate": "2026-02-15T10:00:00Z",
     "timeSlot": "10:00",
     "reason": "General Checkup"
   }
   ```

### Using JavaScript Fetch
```javascript
const token = "your_jwt_token";

const bookingData = {
  patientName: "Nguyen Van A",
  patientEmail: "nguyenvana@example.com",
  patientPhone: "0912345678",
  doctorId: "doctor_id_here",
  appointmentDate: "2026-02-15T10:00:00Z",
  timeSlot": "10:00",
  reason: "General Checkup"
};

const response = await fetch("http://localhost:5000/api/bookings", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(bookingData)
});

const result = await response.json();
console.log(result);
```

---

## ✅ Validation Rules

| Field | Rule | Error Code |
|-------|------|-----------|
| patientName | Min 2 chars, required | 400 |
| patientEmail | Valid email format | 400 |
| patientPhone | 10+ digits | 400 |
| doctorId | Must exist in DB | 404 |
| appointmentDate | Must be future date | 400 |
| timeSlot | One of: 09:00, 10:00, 11:00, 14:00, 15:00, 16:00 | 400 |
| reason | Required, max 500 chars | 400 |

---

## 🔐 Error Code Reference

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Validation Error | Check input fields |
| 401 | No/Invalid Token | Add valid Authorization header |
| 403 | Permission Denied | User trying to access others' booking |
| 404 | Not Found | Doctor/Booking doesn't exist |
| 409 | Conflict | Duplicate booking exists |
| 500 | Server Error | Contact admin |

---

## 💡 Key Features

✅ **Token-based Authentication** - Requires JWT in Authorization header
✅ **Input Validation** - Comprehensive validation middleware
✅ **Error Handling** - Detailed error responses with field-level errors
✅ **Role-based Access** - Admin-only endpoints protected
✅ **Database Indexes** - Optimized queries for performance
✅ **Mongoose Validation** - Built-in schema validation
✅ **Duplicate Prevention** - Prevents booking same slot twice
✅ **Future Date Only** - Ensures appointments are in the future

---

## 🚀 Next Steps

1. ✅ Create files in correct folders
2. ✅ Register routes in main server
3. ✅ Test with Postman or curl
4. ✅ Frontend integration
5. ✅ Deployment to Azure

