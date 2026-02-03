# Booking API - cURL Examples
# Copy and paste these commands into your terminal

# ====================================
# 1. LOGIN (Get Token)
# ====================================
echo "=== 1. LOGIN ==="
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234"
  }'

# Output: Copy the token from response
# export TOKEN="your_token_here"


# ====================================
# 2. GET DOCTORS LIST
# ====================================
echo -e "\n\n=== 2. GET DOCTORS ==="
curl -X GET http://localhost:5000/api/doctors \
  -H "Content-Type: application/json"

# Output: Copy doctor ID from response
# export DOCTOR_ID="doctor_id_here"


# ====================================
# 3. CREATE BOOKING (Success)
# ====================================
echo -e "\n\n=== 3. CREATE BOOKING (Success) ==="
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Nguyen Van A",
    "patientEmail": "nguyenvana@example.com",
    "patientPhone": "0912345678",
    "doctorId": "DOCTOR_ID_HERE",
    "appointmentDate": "2026-02-15T10:00:00Z",
    "timeSlot": "10:00",
    "reason": "General Checkup",
    "notes": "First time patient"
  }'

# Expected Response (201):
# {
#   "success": true,
#   "code": 201,
#   "message": "Booking created successfully",
#   "data": { ... }
# }


# ====================================
# 4. VALIDATION ERROR TEST
# ====================================
echo -e "\n\n=== 4. VALIDATION ERROR (Bad Email) ==="
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Test",
    "patientEmail": "invalid-email",
    "patientPhone": "0912345678",
    "doctorId": "DOCTOR_ID_HERE",
    "appointmentDate": "2026-02-15T10:00:00Z",
    "timeSlot": "10:00",
    "reason": "General Checkup"
  }'

# Expected Response (400):
# {
#   "success": false,
#   "code": 400,
#   "message": "Validation failed",
#   "errors": [
#     {
#       "code": 400,
#       "field": "patientEmail",
#       "message": "Valid email is required"
#     }
#   ]
# }


# ====================================
# 5. MISSING REQUIRED FIELD TEST
# ====================================
echo -e "\n\n=== 5. MISSING REQUIRED FIELD ==="
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Test",
    "patientEmail": "test@example.com",
    "patientPhone": "0912345678",
    "doctorId": "DOCTOR_ID_HERE",
    "appointmentDate": "2026-02-15T10:00:00Z",
    "timeSlot": "10:00"
  }'

# Expected Response (400):
# reason field is missing


# ====================================
# 6. INVALID TIME SLOT TEST
# ====================================
echo -e "\n\n=== 6. INVALID TIME SLOT ==="
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Test",
    "patientEmail": "test@example.com",
    "patientPhone": "0912345678",
    "doctorId": "DOCTOR_ID_HERE",
    "appointmentDate": "2026-02-15T10:00:00Z",
    "timeSlot": "25:99",
    "reason": "Checkup"
  }'

# Expected Response (400):
# Invalid time slot. Valid slots: 09:00, 10:00, 11:00, 14:00, 15:00, 16:00


# ====================================
# 7. PAST DATE TEST
# ====================================
echo -e "\n\n=== 7. PAST APPOINTMENT DATE ==="
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Test",
    "patientEmail": "test@example.com",
    "patientPhone": "0912345678",
    "doctorId": "DOCTOR_ID_HERE",
    "appointmentDate": "2020-01-01T10:00:00Z",
    "timeSlot": "10:00",
    "reason": "Checkup"
  }'

# Expected Response (400):
# Appointment date must be in the future


# ====================================
# 8. DOCTOR NOT FOUND TEST
# ====================================
echo -e "\n\n=== 8. DOCTOR NOT FOUND ==="
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Test",
    "patientEmail": "test@example.com",
    "patientPhone": "0912345678",
    "doctorId": "invalid-doctor-id",
    "appointmentDate": "2026-02-15T10:00:00Z",
    "timeSlot": "10:00",
    "reason": "Checkup"
  }'

# Expected Response (404):
# {
#   "success": false,
#   "code": 404,
#   "message": "Doctor not found"
# }


# ====================================
# 9. DUPLICATE BOOKING TEST
# ====================================
echo -e "\n\n=== 9. DUPLICATE BOOKING ==="
# Create same booking twice
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Duplicate Test",
    "patientEmail": "duplicate@example.com",
    "patientPhone": "0912345678",
    "doctorId": "DOCTOR_ID_HERE",
    "appointmentDate": "2026-02-15T10:00:00Z",
    "timeSlot": "10:00",
    "reason": "Checkup"
  }'

# Run same command again - Second time will get 409:
# Expected Response (409):
# {
#   "success": false,
#   "code": 409,
#   "message": "You already have a booking with this doctor at this time"
# }


# ====================================
# 10. UNAUTHORIZED ACCESS (No Token)
# ====================================
echo -e "\n\n=== 10. UNAUTHORIZED (No Token) ==="
curl -X GET http://localhost:5000/api/bookings/my-bookings

# Expected Response (401):
# {
#   "success": false,
#   "code": 401,
#   "message": "Unauthorized"
# }


# ====================================
# 11. GET MY BOOKINGS
# ====================================
echo -e "\n\n=== 11. GET MY BOOKINGS ==="
curl -X GET http://localhost:5000/api/bookings/my-bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Expected Response (200):
# {
#   "success": true,
#   "code": 200,
#   "message": "Bookings retrieved successfully",
#   "count": 1,
#   "data": [ ... ]
# }


# ====================================
# 12. GET BOOKING BY ID
# ====================================
echo -e "\n\n=== 12. GET BOOKING BY ID ==="
curl -X GET http://localhost:5000/api/bookings/BOOKING_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Expected Response (200):
# {
#   "success": true,
#   "code": 200,
#   "message": "Booking retrieved successfully",
#   "data": { ... }
# }


# ====================================
# 13. UPDATE BOOKING
# ====================================
echo -e "\n\n=== 13. UPDATE BOOKING ==="
curl -X PUT http://localhost:5000/api/bookings/BOOKING_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Updated Name",
    "patientPhone": "0987654321",
    "reason": "Updated reason",
    "notes": "Updated notes"
  }'

# Expected Response (200):
# {
#   "success": true,
#   "code": 200,
#   "message": "Booking updated successfully",
#   "data": { ... }
# }


# ====================================
# 14. CANCEL BOOKING
# ====================================
echo -e "\n\n=== 14. CANCEL BOOKING ==="
curl -X DELETE http://localhost:5000/api/bookings/BOOKING_ID_HERE/cancel \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Expected Response (200):
# {
#   "success": true,
#   "code": 200,
#   "message": "Booking cancelled successfully",
#   "data": {
#     ...
#     "status": "cancelled"
#   }
# }


# ====================================
# 15. GET ALL BOOKINGS (Admin Only)
# ====================================
echo -e "\n\n=== 15. GET ALL BOOKINGS (Admin) ==="
curl -X GET "http://localhost:5000/api/bookings/admin/all-bookings?status=pending" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"

# Expected Response (200 or 403 if not admin):
# {
#   "success": true,
#   "code": 200,
#   "message": "All bookings retrieved successfully",
#   "count": 5,
#   "data": [ ... ]
# }


# ====================================
# SETUP INSTRUCTIONS
# ====================================
# 1. Replace YOUR_TOKEN_HERE with actual token from login response
# 2. Replace DOCTOR_ID_HERE with actual doctor ID
# 3. Replace BOOKING_ID_HERE with actual booking ID
# 4. Make sure server is running on http://localhost:5000

# Example workflow:
# 1. Get token from login
# 2. Get doctor list
# 3. Create booking with valid doctor ID
# 4. Use returned booking ID for other operations
# 5. Test error cases with invalid data
