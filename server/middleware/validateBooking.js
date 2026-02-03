// Middleware to validate booking input
const validateBooking = (req, res, next) => {
  const {
    patientName,
    patientEmail,
    patientPhone,
    doctorId,
    appointmentDate,
    timeSlot,
    reason,
  } = req.body;

  // Check required fields
  const errors = [];

  if (!patientName || patientName.trim().length < 2) {
    errors.push({
      code: 400,
      field: "patientName",
      message: "Patient name is required and must be at least 2 characters",
    });
  }

  if (!patientEmail || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(patientEmail)) {
    errors.push({
      code: 400,
      field: "patientEmail",
      message: "Valid email is required",
    });
  }

  if (!patientPhone || !/^[0-9]{10,}$/.test(patientPhone)) {
    errors.push({
      code: 400,
      field: "patientPhone",
      message: "Phone number must be at least 10 digits",
    });
  }

  if (!doctorId) {
    errors.push({
      code: 400,
      field: "doctorId",
      message: "Doctor ID is required",
    });
  }

  if (!appointmentDate) {
    errors.push({
      code: 400,
      field: "appointmentDate",
      message: "Appointment date is required",
    });
  } else {
    const date = new Date(appointmentDate);
    if (date <= new Date()) {
      errors.push({
        code: 400,
        field: "appointmentDate",
        message: "Appointment date must be in the future",
      });
    }
  }

  const validTimeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
  if (!timeSlot || !validTimeSlots.includes(timeSlot)) {
    errors.push({
      code: 400,
      field: "timeSlot",
      message: `Invalid time slot. Valid slots: ${validTimeSlots.join(", ")}`,
    });
  }

  if (!reason || reason.trim().length === 0) {
    errors.push({
      code: 400,
      field: "reason",
      message: "Reason for visit is required",
    });
  }

  // If there are errors, return them
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "Validation failed",
      errors: errors,
    });
  }

  next();
};

export default validateBooking;
