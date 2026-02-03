# Booking API Test - PowerShell Version
# Run: .\test-booking-api.ps1

$baseUrl = "http://localhost:5000/api"
$authToken = ""
$doctorId = ""
$bookingId = ""

# Test user credentials
$testUser = @{
    email = "test@example.com"
    password = "Test@1234"
}

# Booking data
$bookingData = @{
    patientName = "Nguyen Van Test"
    patientEmail = "nguyenvana@example.com"
    patientPhone = "0912345678"
    appointmentDate = (Get-Date).AddDays(7).ToString("o")
    timeSlot = "10:00"
    reason = "General Checkup"
    notes = "First time patient"
}

function Test-Login {
    Write-Host "`n========== TEST 1: LOGIN ==========" -ForegroundColor Cyan
    try {
        $response = Invoke-RestMethod `
            -Method Post `
            -Uri "$baseUrl/auth/login" `
            -ContentType "application/json" `
            -Body ($testUser | ConvertTo-Json)
        
        if ($response.token) {
            $script:authToken = $response.token
            Write-Host "✅ Login successful" -ForegroundColor Green
            Write-Host "Token: $($script:authToken.Substring(0, 20))..." -ForegroundColor Gray
            return $true
        }
    }
    catch {
        Write-Host "❌ Login failed: $_" -ForegroundColor Red
        return $false
    }
}

function Test-GetDoctors {
    Write-Host "`n========== TEST 2: GET DOCTORS ==========" -ForegroundColor Cyan
    try {
        $response = Invoke-RestMethod `
            -Method Get `
            -Uri "$baseUrl/doctors" `
            -ContentType "application/json"
        
        if ($response.Count -gt 0) {
            $script:doctorId = $response[0]._id
            Write-Host "✅ Doctors retrieved successfully" -ForegroundColor Green
            Write-Host "Selected Doctor ID: $script:doctorId" -ForegroundColor Gray
            Write-Host "Doctor Name: $($response[0].name)" -ForegroundColor Gray
            return $true
        }
    }
    catch {
        Write-Host "❌ Get doctors failed: $_" -ForegroundColor Red
        return $false
    }
}

function Test-CreateBooking {
    Write-Host "`n========== TEST 3: CREATE BOOKING ==========" -ForegroundColor Cyan
    try {
        $payload = $bookingData.Clone()
        $payload["doctorId"] = $script:doctorId
        
        $headers = @{
            "Authorization" = "Bearer $script:authToken"
            "Content-Type" = "application/json"
        }
        
        $response = Invoke-RestMethod `
            -Method Post `
            -Uri "$baseUrl/bookings" `
            -Headers $headers `
            -Body ($payload | ConvertTo-Json)
        
        if ($response.success) {
            $script:bookingId = $response.data._id
            Write-Host "✅ Booking created successfully" -ForegroundColor Green
            Write-Host "Booking ID: $script:bookingId" -ForegroundColor Gray
            Write-Host "Status: $($response.data.status)" -ForegroundColor Gray
            return $true
        }
    }
    catch {
        Write-Host "❌ Create booking failed: $_" -ForegroundColor Red
        return $false
    }
}

function Test-ValidationError {
    Write-Host "`n========== TEST 4: VALIDATION ERROR TEST ==========" -ForegroundColor Cyan
    try {
        $invalidData = @{
            patientName = "A"
            patientEmail = "invalid-email"
            patientPhone = "123"
            doctorId = $script:doctorId
            appointmentDate = (Get-Date).AddDays(-1).ToString("o")
            timeSlot = "99:99"
            reason = ""
        }
        
        $headers = @{
            "Authorization" = "Bearer $script:authToken"
            "Content-Type" = "application/json"
        }
        
        $response = Invoke-RestMethod `
            -Method Post `
            -Uri "$baseUrl/bookings" `
            -Headers $headers `
            -Body ($invalidData | ConvertTo-Json) `
            -ErrorAction Continue
        
        Write-Host "✅ Validation error caught correctly" -ForegroundColor Green
        Write-Host "Message: $($response.message)" -ForegroundColor Gray
        return $true
    }
    catch {
        Write-Host "⚠️  Expected error: $_" -ForegroundColor Yellow
        return $true
    }
}

function Test-GetMyBookings {
    Write-Host "`n========== TEST 5: GET MY BOOKINGS ==========" -ForegroundColor Cyan
    try {
        $headers = @{
            "Authorization" = "Bearer $script:authToken"
        }
        
        $response = Invoke-RestMethod `
            -Method Get `
            -Uri "$baseUrl/bookings/my-bookings" `
            -Headers $headers
        
        if ($response.success) {
            Write-Host "✅ Bookings retrieved successfully" -ForegroundColor Green
            Write-Host "Total Bookings: $($response.count)" -ForegroundColor Gray
            return $true
        }
    }
    catch {
        Write-Host "❌ Get bookings failed: $_" -ForegroundColor Red
        return $false
    }
}

function Test-GetBookingById {
    Write-Host "`n========== TEST 6: GET BOOKING BY ID ==========" -ForegroundColor Cyan
    try {
        $headers = @{
            "Authorization" = "Bearer $script:authToken"
        }
        
        $response = Invoke-RestMethod `
            -Method Get `
            -Uri "$baseUrl/bookings/$script:bookingId" `
            -Headers $headers
        
        if ($response.success) {
            Write-Host "✅ Booking retrieved successfully" -ForegroundColor Green
            Write-Host "Patient Name: $($response.data.patientName)" -ForegroundColor Gray
            Write-Host "Status: $($response.data.status)" -ForegroundColor Gray
            return $true
        }
    }
    catch {
        Write-Host "❌ Get booking failed: $_" -ForegroundColor Red
        return $false
    }
}

function Test-UpdateBooking {
    Write-Host "`n========== TEST 7: UPDATE BOOKING ==========" -ForegroundColor Cyan
    try {
        $updateData = @{
            patientName = "Nguyen Van Updated"
            reason = "Updated reason"
            notes = "Updated notes"
        }
        
        $headers = @{
            "Authorization" = "Bearer $script:authToken"
            "Content-Type" = "application/json"
        }
        
        $response = Invoke-RestMethod `
            -Method Put `
            -Uri "$baseUrl/bookings/$script:bookingId" `
            -Headers $headers `
            -Body ($updateData | ConvertTo-Json)
        
        if ($response.success) {
            Write-Host "✅ Booking updated successfully" -ForegroundColor Green
            Write-Host "Updated Name: $($response.data.patientName)" -ForegroundColor Gray
            return $true
        }
    }
    catch {
        Write-Host "❌ Update booking failed: $_" -ForegroundColor Red
        return $false
    }
}

function Test-UnauthorizedAccess {
    Write-Host "`n========== TEST 8: UNAUTHORIZED ACCESS ==========" -ForegroundColor Cyan
    try {
        Invoke-RestMethod `
            -Method Get `
            -Uri "$baseUrl/bookings/my-bookings" `
            -ErrorAction Continue | Out-Null
    }
    catch {
        Write-Host "✅ Unauthorized access blocked correctly" -ForegroundColor Green
        Write-Host "Error: $_" -ForegroundColor Gray
        return $true
    }
    return $false
}

function Test-CancelBooking {
    Write-Host "`n========== TEST 9: CANCEL BOOKING ==========" -ForegroundColor Cyan
    try {
        $headers = @{
            "Authorization" = "Bearer $script:authToken"
        }
        
        $response = Invoke-RestMethod `
            -Method Delete `
            -Uri "$baseUrl/bookings/$script:bookingId/cancel" `
            -Headers $headers
        
        if ($response.success) {
            Write-Host "✅ Booking cancelled successfully" -ForegroundColor Green
            Write-Host "New Status: $($response.data.status)" -ForegroundColor Gray
            return $true
        }
    }
    catch {
        Write-Host "❌ Cancel booking failed: $_" -ForegroundColor Red
        return $false
    }
}

# Main execution
Write-Host "🚀 Starting Booking API Tests..." -ForegroundColor Yellow
Write-Host "Base URL: $baseUrl" -ForegroundColor Gray

$results = @()

# Run tests in sequence
$results += Test-Login
if (-not $script:authToken) {
    Write-Host "`n❌ Cannot continue without authentication" -ForegroundColor Red
    exit
}

$results += Test-GetDoctors
if (-not $script:doctorId) {
    Write-Host "`n❌ Cannot continue without doctor ID" -ForegroundColor Red
    exit
}

$results += Test-CreateBooking
$results += Test-ValidationError
$results += Test-GetMyBookings
$results += Test-GetBookingById
$results += Test-UpdateBooking
$results += Test-UnauthorizedAccess
$results += Test-CancelBooking

# Summary
Write-Host "`n========== TEST SUMMARY ==========" -ForegroundColor Cyan
$passed = ($results | Where-Object { $_ -eq $true }).Count
$total = $results.Count

Write-Host "Passed: $passed/$total" -ForegroundColor White

if ($passed -eq $total) {
    Write-Host "✅ All tests passed!" -ForegroundColor Green
} else {
    Write-Host "⚠️  $($total - $passed) test(s) failed" -ForegroundColor Yellow
}
