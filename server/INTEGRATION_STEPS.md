# 🚀 Step-by-Step Integration Instructions

## 📝 Quick Reference

Đã tạo **9 files** cho Booking API hoàn chỉnh. Bạn chỉ cần **1 bước** để integrate!

---

## ⚡ ONLY 1 STEP NEEDED

### Step 1: Register Routes in `server/index.js`

**Find this line in your index.js:**
```javascript
// Your current imports
import express from "express";
import adminRoutes from "./routes/adminRoutes.js";
// ... other imports
```

**Add this import:**
```javascript
import bookingRoutes from "./routes/bookingRoutes.js";
```

**Find this line (where routes are registered):**
```javascript
app.use("/api/admin", adminRoutes);
// ... other routes
```

**Add this line:**
```javascript
app.use("/api/bookings", bookingRoutes);
```

**That's it!** ✅

---

## 📁 Files Created (9 Files)

### Database & Models
```
✅ server/models/booking.js
   - Complete MongoDB schema
   - Validation rules
   - Timestamps & indexes
```

### Middleware
```
✅ server/middleware/validateBooking.js
   - Input validation
   - Error messages
   - Field-level validation
```

### Controller
```
✅ server/controllers/bookingController.js
   - 6 functions for CRUD operations
   - Error handling
   - Authorization checks
```

### Routes
```
✅ server/routes/bookingRoutes.js
   - 6 endpoints
   - Authentication middleware
   - Validation middleware
```

### Documentation
```
✅ server/BOOKING_INTEGRATION_GUIDE.md
   - Complete integration guide
   - Frontend examples
   - Troubleshooting

✅ server/BOOKING_API_GUIDE.md
   - Detailed endpoint documentation
   - Request/response examples
   - All 15 error scenarios

✅ server/BOOKING_API_SUMMARY.md
   - Overview of all files
   - Features summary
   - Quick reference
```

### Examples & Tests
```
✅ server/BOOKING_API_CURL_EXAMPLES.sh
   - 15 curl examples
   - Success & error cases

✅ server/test-booking-api.mjs
   - Node.js test suite
   - 9 automated tests

✅ server/test-booking-api.ps1
   - PowerShell test suite
   - Windows compatible

✅ server/Booking_API_Collection.json
   - Postman collection
   - 20+ requests
   - Variable setup
```

---

## 🧪 How to Test

### Option 1: Node.js Test
```bash
cd server
node test-booking-api.mjs
```

Output example:
```
🚀 Starting Booking API Tests...
Base URL: http://localhost:5000/api

========== TEST 1: LOGIN ==========
✅ Login successful

========== TEST 2: GET DOCTORS ==========
✅ Doctors retrieved successfully

========== TEST 3: CREATE BOOKING ==========
✅ Booking created successfully

...

========== TEST SUMMARY ==========
Passed: 9/9
✅ All tests passed!
```

### Option 2: PowerShell Test
```powershell
cd server
.\test-booking-api.ps1
```

### Option 3: Postman
1. Open Postman
2. Click "Import"
3. Select file: `server/Booking_API_Collection.json`
4. Set variables: TOKEN, DOCTOR_ID, BOOKING_ID
5. Run requests

### Option 4: Manual cURL
```bash
# Login first
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@1234"}'

# Copy TOKEN from response

# Create booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Test",
    "patientEmail": "test@example.com",
    "patientPhone": "0912345678",
    "doctorId": "DOCTOR_ID_HERE",
    "appointmentDate": "2026-02-15T10:00:00Z",
    "timeSlot": "10:00",
    "reason": "Checkup"
  }'
```

---

## 📡 API Endpoints

### Authenticated User Endpoints
```
POST   /api/bookings/
GET    /api/bookings/my-bookings
GET    /api/bookings/:id
PUT    /api/bookings/:id
DELETE /api/bookings/:id/cancel
```

### Admin Endpoints
```
GET    /api/bookings/admin/all-bookings
```

---

## 🔄 Request Flow

```
1. Client sends POST /api/bookings with token + JSON body
   ↓
2. isAuthenticated middleware extracts userId from token
   ↓
3. validateBooking middleware validates input
   ↓
4. createBooking controller:
   - Verify doctor exists (404 if not)
   - Check for duplicate booking (409 if exists)
   - Create and save booking
   - Return success (201) or error
```

---

## 📊 Error Codes Returned

| Code | When | Example |
|------|------|---------|
| 201 | Booking created | `{"success": true, "code": 201, ...}` |
| 400 | Validation failed | `{"success": false, "code": 400, "errors": [...]}` |
| 401 | No token | `{"success": false, "code": 401, "message": "Unauthorized"}` |
| 403 | Access denied | `{"success": false, "code": 403, "message": "Forbidden"}` |
| 404 | Not found | `{"success": false, "code": 404, "message": "Doctor not found"}` |
| 409 | Duplicate | `{"success": false, "code": 409, "message": "Already booked"}` |
| 500 | Server error | `{"success": false, "code": 500, "message": "Server error"}` |

---

## 🧬 Field Validation Rules

```javascript
{
  "patientName": "String (min 2 chars)",
  "patientEmail": "Email format",
  "patientPhone": "10+ digits",
  "doctorId": "Must exist in Doctor collection",
  "appointmentDate": "ISO date in future",
  "timeSlot": "09:00|10:00|11:00|14:00|15:00|16:00",
  "reason": "Required (max 500 chars)",
  "notes": "Optional (max 1000 chars)"
}
```

---

## 💻 Frontend Integration

### React Example
```javascript
const bookingData = {
  patientName: "Nguyen Van A",
  patientEmail: "a@example.com",
  patientPhone: "0912345678",
  doctorId: doctorId,
  appointmentDate: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
  timeSlot: "10:00",
  reason: "General Checkup"
};

const response = await fetch('/api/bookings', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(bookingData)
});

const result = await response.json();

if (result.success) {
  console.log('Booking created:', result.data);
} else {
  console.error('Errors:', result.errors);
}
```

---

## 🐛 Troubleshooting

### "Cannot POST /api/bookings"
**Solution:** Make sure you added `app.use("/api/bookings", bookingRoutes);` in index.js

### "Unauthorized"
**Solution:** Make sure Authorization header has valid JWT token: `Bearer YOUR_TOKEN`

### "Doctor not found"
**Solution:** Use valid Doctor ID from GET /api/doctors

### "Validation failed"
**Solution:** Check all required fields are present and valid

### "Already have a booking..."
**Solution:** User already booked this doctor at this time

### "Cannot connect to database"
**Solution:** Make sure MongoDB is running and connection string is correct

---

## ✅ Verification Checklist

- [ ] 1. Copy/paste files into correct folders
- [ ] 2. Add import in index.js: `import bookingRoutes from "./routes/bookingRoutes.js";`
- [ ] 3. Add route in index.js: `app.use("/api/bookings", bookingRoutes);`
- [ ] 4. Server is running on port 5000
- [ ] 5. MongoDB connection is active
- [ ] 6. Run test: `node test-booking-api.mjs`
- [ ] 7. All tests pass ✅
- [ ] 8. Ready for frontend integration

---

## 🎯 What's Next

After API is working:

1. **Frontend Integration**
   - Create booking form component
   - Display user's bookings
   - Cancel/edit booking options

2. **Additional Features**
   - Email notifications
   - SMS reminders
   - Calendar view
   - Doctor availability

3. **Deployment**
   - Test on staging
   - Deploy to Azure
   - Monitor error logs

4. **Optimization**
   - Caching
   - Rate limiting
   - Analytics

---

## 📞 Quick Help

**Q: Where are the files?**
A: All in `d:\Hospital_Management_Website-main\server\`

**Q: Do I need to modify any files?**
A: No, only add 2 lines in index.js

**Q: How to test?**
A: Run `node test-booking-api.mjs`

**Q: What if test fails?**
A: Check error message, usually means invalid token or doctor ID

**Q: Can I use with Postman?**
A: Yes! Import `Booking_API_Collection.json`

---

## 🎉 You're All Set!

Your Booking API is ready to use! Just:
1. Add 2 lines in index.js
2. Run test
3. Integrate with frontend
4. Deploy! 🚀

For detailed docs, read:
- `BOOKING_INTEGRATION_GUIDE.md` - Full guide
- `BOOKING_API_GUIDE.md` - API reference
- `BOOKING_API_SUMMARY.md` - Overview

**Happy coding!** 💻
