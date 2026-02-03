# Booking API - Architecture & Flow Diagram

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT (Frontend)                       │
│  - React/Vue Component                                           │
│  - Form: Patient Info + Doctor + Date + Time + Reason           │
│  - Store JWT Token in localStorage                              │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ HTTP Request
                     │ POST /api/bookings
                     │ Authorization: Bearer {TOKEN}
                     │ Content-Type: application/json
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXPRESS SERVER                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Routes (bookingRoutes.js)                                 │ │
│  │  - POST   /api/bookings                                    │ │
│  │  - GET    /api/bookings/my-bookings                        │ │
│  │  - GET    /api/bookings/:id                                │ │
│  │  - PUT    /api/bookings/:id                                │ │
│  │  - DELETE /api/bookings/:id/cancel                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                     │                                            │
│                     ▼                                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Middleware Chain                                          │ │
│  │  1. isAuthenticated - Verify JWT Token ✅                  │ │
│  │  2. validateBooking - Validate Input ✅                    │ │
│  │  3. isAdmin (for admin routes)                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                     │                                            │
│                     ▼                                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Controller (bookingController.js)                         │ │
│  │  - createBooking()                                         │ │
│  │  - getMyBookings()                                         │ │
│  │  - getBookingById()                                        │ │
│  │  - updateBooking()                                         │ │
│  │  - cancelBooking()                                         │ │
│  │  - getAllBookings() [Admin]                                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                     │                                            │
│                     ▼                                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Database Operations                                       │ │
│  │  - Verify Doctor exists (Doctor collection)                │ │
│  │  - Check duplicate booking                                 │ │
│  │  - Save/Update/Delete Booking                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                     │                                            │
└─────────────────────┼────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MONGODB DATABASE                             │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Doctors     │  │  Users       │  │  Bookings    │          │
│  │  ─────────   │  │  ─────────   │  │  ─────────   │          │
│  │  _id         │  │  _id         │  │  _id         │          │
│  │  name        │  │  email       │  │  patientName │          │
│  │  specialty   │  │  password    │  │  patientEmail│          │
│  │  ...         │  │  role        │  │  doctorId ──┼──┐       │
│  │              │  │  ...         │  │  userId ────┼──┼──┐    │
│  └──────────────┘  └──────────────┘  │  date        │  │  │    │
│                                        │  timeSlot    │  │  │    │
│                                        │  status      │  │  │    │
│                                        │  ...         │  │  │    │
│                                        └──────────────┘  │  │    │
│                                                           │  │    │
│                      Relationships ─────────────────────┘  │    │
│                                                            │    │
└────────────────────────────────────────────────────────────┼────┘
                                                             │
                                         References Doctor & User
```

---

## 📊 Request Flow Diagram

```
START: POST /api/bookings
   │
   ├─ Body: {patientName, patientEmail, patientPhone, doctorId, 
   │         appointmentDate, timeSlot, reason, notes}
   │
   ├─ Header: Authorization: Bearer {TOKEN}
   │
   ▼
┌─ isAuthenticated Middleware
│  ├─ Extract token from header
│  ├─ Verify JWT signature
│  ├─ Get userId from token payload
│  │
│  ├─ If valid: Continue → next middleware
│  │
│  └─ If invalid: Return 401 Unauthorized ❌
│       └─ Response: {success: false, code: 401, message: "Unauthorized"}
│
▼
┌─ validateBooking Middleware
│  ├─ Check patientName (min 2 chars)
│  ├─ Check patientEmail (valid format)
│  ├─ Check patientPhone (10+ digits)
│  ├─ Check doctorId (not empty)
│  ├─ Check appointmentDate (must be future)
│  ├─ Check timeSlot (must be valid)
│  ├─ Check reason (required, max 500)
│  │
│  ├─ If all valid: Continue → controller
│  │
│  └─ If any invalid: Return 400 Bad Request ❌
│       └─ Response: {success: false, code: 400, errors: [{field, message}]}
│
▼
┌─ createBooking Controller
│  │
│  ├─ Step 1: Check if doctor exists
│  │  └─ Doctor.findById(doctorId)
│  │  ├─ If found: Continue
│  │  └─ If not found: Return 404 ❌
│  │      └─ Response: {success: false, code: 404, message: "Doctor not found"}
│  │
│  ├─ Step 2: Check if user exists
│  │  └─ User.findById(userId)
│  │  ├─ If found: Continue
│  │  └─ If not found: Return 404 ❌
│  │
│  ├─ Step 3: Check for duplicate booking
│  │  └─ Booking.findOne({doctorId, appointmentDate, timeSlot, userId, 
│  │                      status: {$ne: "cancelled"}})
│  │  ├─ If not found: Continue
│  │  └─ If found: Return 409 ❌
│  │      └─ Response: {success: false, code: 409, 
│  │                    message: "Already have a booking..."}
│  │
│  ├─ Step 4: Create booking document
│  │  └─ new Booking({...data})
│  │  └─ booking.save()
│  │
│  └─ Step 5: Return success ✅
│      └─ Response: {success: true, code: 201, 
│                    message: "Booking created successfully", 
│                    data: {...booking}}
│
▼
END: Response sent to client
```

---

## 🔄 Error Handling Flow

```
Request arrives
   │
   ▼
Does token exist?
   ├─ No  → 401 Unauthorized
   └─ Yes → Is token valid?
        ├─ No  → 401 Unauthorized
        └─ Yes → Is input valid?
             ├─ No  → 400 Bad Request (with field errors)
             └─ Yes → Does doctor exist?
                  ├─ No  → 404 Not Found
                  └─ Yes → Is booking duplicate?
                       ├─ Yes → 409 Conflict
                       └─ No  → Create booking → 201 Created
```

---

## 📝 Database Schema Relationship

```
┌──────────────────┐
│     Users        │
│  ──────────────  │
│  _id (PK)        │
│  email           │
│  password        │
│  role            │
│  ...             │
└──────────────────┘
       ▲
       │
       │ userId (FK)
       │
┌──────────────────┐
│    Bookings      │
│  ──────────────  │
│  _id (PK)        │
│  userId (FK) ────┼──→ User
│  doctorId (FK)───┼──→ Doctor
│  patientName     │
│  patientEmail    │
│  appointmentDate │
│  timeSlot        │
│  status          │
│  ...             │
└──────────────────┘
       ▲
       │
       │ doctorId (FK)
       │
┌──────────────────┐
│    Doctors       │
│  ──────────────  │
│  _id (PK)        │
│  name            │
│  specialization  │
│  ...             │
└──────────────────┘
```

---

## 🎯 Validation Rules Flowchart

```
Input Data
   │
   ├─ patientName
   │  ├─ Length >= 2? 
   │  └─ No → Error: "At least 2 characters"
   │
   ├─ patientEmail
   │  ├─ Valid email format?
   │  └─ No → Error: "Valid email required"
   │
   ├─ patientPhone
   │  ├─ 10+ digits?
   │  └─ No → Error: "Valid phone required"
   │
   ├─ doctorId
   │  ├─ Not empty?
   │  └─ No → Error: "Doctor required"
   │
   ├─ appointmentDate
   │  ├─ Date in future?
   │  ├─ No → Error: "Must be future date"
   │  └─ Yes → Continue
   │
   ├─ timeSlot
   │  ├─ Valid slot? [09:00, 10:00, 11:00, 14:00, 15:00, 16:00]
   │  └─ No → Error: "Invalid time slot"
   │
   └─ reason
      ├─ Not empty AND <= 500 chars?
      └─ No → Error: "Reason required"

All fields valid?
   ├─ Yes → Proceed to controller ✅
   └─ No  → Return 400 with errors ❌
```

---

## 📊 Response Status Codes

```
┌──────────────────────────────────────────────┐
│ SUCCESS RESPONSES                            │
├──────────────────────────────────────────────┤
│ 201 Created  ✅                              │
│ ├─ Booking created successfully              │
│ └─ data: new booking object                  │
│                                              │
│ 200 OK       ✅                              │
│ ├─ Booking retrieved/updated successfully    │
│ └─ data: booking object                      │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ CLIENT ERROR RESPONSES                       │
├──────────────────────────────────────────────┤
│ 400 Bad Request  ❌                          │
│ ├─ Validation failed                         │
│ └─ errors: [{field, message}, ...]           │
│                                              │
│ 401 Unauthorized ❌                          │
│ ├─ Missing/invalid token                     │
│ └─ message: "Unauthorized"                   │
│                                              │
│ 403 Forbidden    ❌                          │
│ ├─ User accessing others' data               │
│ └─ message: "Forbidden"                      │
│                                              │
│ 404 Not Found    ❌                          │
│ ├─ Doctor/Booking not found                  │
│ └─ message: "Doctor/Booking not found"       │
│                                              │
│ 409 Conflict     ❌                          │
│ ├─ Duplicate booking exists                  │
│ └─ message: "Already have a booking..."      │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ SERVER ERROR RESPONSES                       │
├──────────────────────────────────────────────┤
│ 500 Internal Server Error ❌                 │
│ ├─ Unexpected server error                   │
│ └─ message: "Server error"                   │
└──────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
Client wants to create booking
   │
   ▼
Client logs in (POST /api/auth/login)
   ├─ Email + Password
   │
   ▼
Server verifies credentials
   ├─ Find user by email
   ├─ Compare passwords
   │
   ▼
Server creates JWT token
   ├─ Payload: {userId, email, role}
   ├─ Sign with secret
   │
   ▼
Client receives token
   ├─ Save in localStorage
   │
   ▼
Client calls POST /api/bookings
   ├─ Header: Authorization: Bearer {TOKEN}
   │
   ▼
Server verifies token
   ├─ isAuthenticated middleware
   ├─ Check header
   ├─ Verify signature
   ├─ Extract userId
   │
   ▼
Token valid?
   ├─ Yes → Proceed to booking creation
   └─ No  → Return 401 Unauthorized
```

---

## 📈 Data Flow in Create Booking

```
User Input (Form)
   ├─ patientName: "Nguyen Van A"
   ├─ patientEmail: "a@example.com"
   ├─ patientPhone: "0912345678"
   ├─ doctorId: "67a8c1d2e5f4a9b0c1d2e3f4"
   ├─ appointmentDate: "2026-02-15T10:00:00Z"
   ├─ timeSlot: "10:00"
   └─ reason: "General Checkup"
         │
         ▼
  Validation Middleware
     │
     ├─ Regex validation
     ├─ Format checking
     ├─ Length validation
     │
         │
         ▼
  Create Booking Controller
     │
     ├─ Query 1: Doctor.findById(doctorId)
     │   └─ Verify doctor exists
     │
     ├─ Query 2: User.findById(userId)
     │   └─ Verify user exists
     │
     ├─ Query 3: Booking.findOne(...)
     │   └─ Check for duplicates
     │
     ├─ Query 4: new Booking({...})
     │   └─ Create document
     │
     └─ Query 5: booking.save()
            └─ Save to MongoDB
               │
               ▼
        Database Response
           │
           ├─ _id: "67a8c1d2e5f4a9b0c1d2e3f5"
           ├─ patientName: "Nguyen Van A"
           ├─ status: "pending"
           ├─ createdAt: "2026-02-03T10:30:00Z"
           └─ ... other fields
               │
               ▼
        Response to Client (201)
           │
           ├─ success: true
           ├─ code: 201
           ├─ message: "Booking created successfully"
           └─ data: { booking object }
```

---

## ✅ Complete Request-Response Cycle

```
CLIENT SIDE:
┌─────────────────────────────────┐
│ 1. User fills form               │
│ 2. Click submit                  │
│ 3. JavaScript fetch() request    │
│    ├─ Method: POST               │
│    ├─ URL: /api/bookings         │
│    ├─ Headers: Authorization     │
│    └─ Body: JSON data            │
└─────────────────────────────────┘
           │
           │ HTTP Request
           ▼
SERVER SIDE:
┌─────────────────────────────────┐
│ 1. Express receives request      │
│ 2. Router matches POST /bookings │
│ 3. Middleware chain runs:        │
│    ├─ isAuthenticated            │
│    ├─ validateBooking            │
│ 4. Controller function runs:     │
│    ├─ createBooking              │
│    ├─ Database operations        │
│ 5. Response prepared             │
│    └─ JSON response              │
└─────────────────────────────────┘
           │
           │ HTTP Response (JSON)
           ▼
CLIENT SIDE:
┌─────────────────────────────────┐
│ 1. Fetch response received       │
│ 2. Parse JSON                    │
│ 3. Check success flag            │
│ 4. If success:                   │
│    └─ Show booking confirmation  │
│ 5. If error:                     │
│    └─ Show error messages        │
│ 6. Update UI/redirect            │
└─────────────────────────────────┘
```

---

## 🎯 Key Components Summary

```
INPUT
  ├─ Token (JWT)
  └─ JSON Body (7-8 fields)

MIDDLEWARE
  ├─ isAuthenticated
  └─ validateBooking

CONTROLLER
  ├─ Check doctor
  ├─ Check user
  ├─ Check duplicates
  └─ Save to DB

DATABASE
  ├─ Verify references
  ├─ Insert document
  └─ Return result

OUTPUT
  ├─ Status Code
  ├─ Response JSON
  └─ Success/Error
```

---

This architecture ensures:
✅ Authentication (Token-based)
✅ Validation (Input checking)
✅ Authorization (User access control)
✅ Data Integrity (No duplicates)
✅ Error Handling (Detailed messages)
✅ Scalability (Indexed queries)
