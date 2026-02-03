/**
 * Booking API Test Suite
 * Run: node test-booking-api.mjs
 */

const BASE_URL = "http://localhost:5000/api";
let AUTH_TOKEN = ""; // Will be set after login
let DOCTOR_ID = ""; // Will be set from doctors list
let BOOKING_ID = ""; // Will be set after creating booking

// Test User Credentials
const testUser = {
  email: "test@example.com",
  password: "Test@1234",
};

const bookingData = {
  patientName: "Nguyen Van Test",
  patientEmail: "nguyenvana@example.com",
  patientPhone: "0912345678",
  appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  timeSlot: "10:00",
  reason: "General Checkup",
  notes: "First time patient",
};

// Helper function to make requests
async function makeRequest(method, endpoint, data = null, token = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const result = await response.json();

  return {
    status: response.status,
    data: result,
  };
}

// Test Functions
async function testLogin() {
  console.log("\n========== TEST 1: LOGIN ==========");
  try {
    const response = await makeRequest("POST", "/auth/login", testUser);
    
    if (response.status === 200 && response.data.token) {
      AUTH_TOKEN = response.data.token;
      console.log("✅ Login successful");
      console.log("Token:", AUTH_TOKEN.substring(0, 20) + "...");
      return true;
    } else {
      console.log("❌ Login failed:", response.data.message);
      return false;
    }
  } catch (err) {
    console.log("❌ Login error:", err.message);
    return false;
  }
}

async function testGetDoctors() {
  console.log("\n========== TEST 2: GET DOCTORS ==========");
  try {
    const response = await makeRequest("GET", "/doctors");
    
    if (response.status === 200 && response.data.length > 0) {
      DOCTOR_ID = response.data[0]._id;
      console.log("✅ Doctors retrieved successfully");
      console.log("Selected Doctor ID:", DOCTOR_ID);
      console.log("Doctor Name:", response.data[0].name);
      return true;
    } else {
      console.log("❌ No doctors found");
      return false;
    }
  } catch (err) {
    console.log("❌ Get doctors error:", err.message);
    return false;
  }
}

async function testCreateBooking() {
  console.log("\n========== TEST 3: CREATE BOOKING ==========");
  try {
    const payload = {
      ...bookingData,
      doctorId: DOCTOR_ID,
    };

    const response = await makeRequest("POST", "/bookings", payload, AUTH_TOKEN);
    
    if (response.status === 201) {
      BOOKING_ID = response.data.data._id;
      console.log("✅ Booking created successfully");
      console.log("Booking ID:", BOOKING_ID);
      console.log("Status:", response.data.data.status);
      console.log("Appointment Date:", response.data.data.appointmentDate);
      return true;
    } else {
      console.log("❌ Create booking failed - Status:", response.status);
      console.log("Error:", response.data.message);
      if (response.data.errors) {
        response.data.errors.forEach((err) => {
          console.log(`  - ${err.field}: ${err.message}`);
        });
      }
      return false;
    }
  } catch (err) {
    console.log("❌ Create booking error:", err.message);
    return false;
  }
}

async function testCreateBookingValidationError() {
  console.log("\n========== TEST 4: VALIDATION ERROR TEST ==========");
  try {
    const invalidData = {
      patientName: "A", // Too short
      patientEmail: "invalid-email", // Invalid email
      patientPhone: "123", // Too short
      doctorId: DOCTOR_ID,
      appointmentDate: new Date(Date.now() - 1000).toISOString(), // Past date
      timeSlot: "99:99", // Invalid slot
      reason: "", // Empty
    };

    const response = await makeRequest("POST", "/bookings", invalidData, AUTH_TOKEN);
    
    if (response.status === 400) {
      console.log("✅ Validation error caught correctly - Status:", response.status);
      console.log("Message:", response.data.message);
      console.log("Errors:");
      response.data.errors.forEach((err) => {
        console.log(`  - Field: ${err.field}`);
        console.log(`    Message: ${err.message}`);
      });
      return true;
    } else {
      console.log("❌ Expected 400 but got:", response.status);
      return false;
    }
  } catch (err) {
    console.log("❌ Validation error test failed:", err.message);
    return false;
  }
}

async function testGetMyBookings() {
  console.log("\n========== TEST 5: GET MY BOOKINGS ==========");
  try {
    const response = await makeRequest("GET", "/bookings/my-bookings", null, AUTH_TOKEN);
    
    if (response.status === 200) {
      console.log("✅ Bookings retrieved successfully");
      console.log("Total Bookings:", response.data.count);
      if (response.data.data.length > 0) {
        console.log("First booking:", response.data.data[0].patientName);
      }
      return true;
    } else {
      console.log("❌ Get bookings failed:", response.data.message);
      return false;
    }
  } catch (err) {
    console.log("❌ Get bookings error:", err.message);
    return false;
  }
}

async function testGetBookingById() {
  console.log("\n========== TEST 6: GET BOOKING BY ID ==========");
  try {
    const response = await makeRequest(
      "GET",
      `/bookings/${BOOKING_ID}`,
      null,
      AUTH_TOKEN
    );
    
    if (response.status === 200) {
      console.log("✅ Booking retrieved successfully");
      console.log("Booking ID:", response.data.data._id);
      console.log("Patient Name:", response.data.data.patientName);
      console.log("Status:", response.data.data.status);
      return true;
    } else {
      console.log("❌ Get booking failed:", response.data.message);
      return false;
    }
  } catch (err) {
    console.log("❌ Get booking error:", err.message);
    return false;
  }
}

async function testUpdateBooking() {
  console.log("\n========== TEST 7: UPDATE BOOKING ==========");
  try {
    const updateData = {
      patientName: "Nguyen Van Updated",
      reason: "Updated reason for visit",
      notes: "Updated notes",
    };

    const response = await makeRequest(
      "PUT",
      `/bookings/${BOOKING_ID}`,
      updateData,
      AUTH_TOKEN
    );
    
    if (response.status === 200) {
      console.log("✅ Booking updated successfully");
      console.log("Updated Name:", response.data.data.patientName);
      console.log("Updated Reason:", response.data.data.reason);
      return true;
    } else {
      console.log("❌ Update booking failed:", response.data.message);
      return false;
    }
  } catch (err) {
    console.log("❌ Update booking error:", err.message);
    return false;
  }
}

async function testUnauthorizedAccess() {
  console.log("\n========== TEST 8: UNAUTHORIZED ACCESS ==========");
  try {
    const response = await makeRequest("GET", "/bookings/my-bookings", null, null);
    
    if (response.status === 401) {
      console.log("✅ Unauthorized access blocked correctly - Status:", response.status);
      console.log("Message:", response.data.message);
      return true;
    } else {
      console.log("❌ Expected 401 but got:", response.status);
      return false;
    }
  } catch (err) {
    console.log("❌ Unauthorized test error:", err.message);
    return false;
  }
}

async function testCancelBooking() {
  console.log("\n========== TEST 9: CANCEL BOOKING ==========");
  try {
    const response = await makeRequest(
      "DELETE",
      `/bookings/${BOOKING_ID}/cancel`,
      null,
      AUTH_TOKEN
    );
    
    if (response.status === 200) {
      console.log("✅ Booking cancelled successfully");
      console.log("New Status:", response.data.data.status);
      return true;
    } else {
      console.log("❌ Cancel booking failed:", response.data.message);
      return false;
    }
  } catch (err) {
    console.log("❌ Cancel booking error:", err.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log("🚀 Starting Booking API Tests...");
  console.log("Base URL:", BASE_URL);

  const results = [];

  // Sequential tests
  results.push(await testLogin());
  if (!AUTH_TOKEN) {
    console.log("\n❌ Cannot continue without authentication");
    return;
  }

  results.push(await testGetDoctors());
  if (!DOCTOR_ID) {
    console.log("\n❌ Cannot continue without doctor ID");
    return;
  }

  results.push(await testCreateBooking());
  results.push(await testCreateBookingValidationError());
  results.push(await testGetMyBookings());
  
  if (BOOKING_ID) {
    results.push(await testGetBookingById());
    results.push(await testUpdateBooking());
  }

  results.push(await testUnauthorizedAccess());
  
  if (BOOKING_ID) {
    results.push(await testCancelBooking());
  }

  // Summary
  console.log("\n========== TEST SUMMARY ==========");
  const passed = results.filter((r) => r).length;
  const total = results.length;
  console.log(`Passed: ${passed}/${total}`);

  if (passed === total) {
    console.log("✅ All tests passed!");
  } else {
    console.log(`⚠️  ${total - passed} test(s) failed`);
  }
}

// Run tests
runAllTests().catch(console.error);
