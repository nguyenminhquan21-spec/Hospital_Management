import Booking from "../models/booking.js";
import Doctor from "../models/doctor.js";
import User from "../models/User.js";

// ===== CREATE BOOKING =====
export const createBooking = async (req, res) => {
  try {
    const {
      patientName,
      patientEmail,
      patientPhone,
      doctorId,
      appointmentDate,
      timeSlot,
      reason,
      notes,
    } = req.body;

    const userId = req.userId;

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        code: 404,
        message: "Doctor not found",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        code: 404,
        message: "User not found",
      });
    }

    // Check for duplicate booking (same doctor, date, time, and user)
    const existingBooking = await Booking.findOne({
      doctorId,
      appointmentDate,
      timeSlot,
      userId,
      status: { $ne: "cancelled" },
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        code: 409,
        message: "You already have a booking with this doctor at this time",
      });
    }

    // Create new booking
    const booking = new Booking({
      patientName,
      patientEmail,
      patientPhone,
      doctorId,
      doctorName: doctor.name,
      appointmentDate,
      timeSlot,
      reason,
      notes,
      userId,
      status: "pending",
    });

    const savedBooking = await booking.save();

    // Populate doctor info
    const populatedBooking = await Booking.findById(savedBooking._id).populate(
      "doctorId",
      "name specialization department"
    );

    return res.status(201).json({
      success: true,
      code: 201,
      message: "Booking created successfully",
      data: populatedBooking,
    });
  } catch (err) {
    console.error("Create booking error:", err);

    // Mongoose validation error
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => ({
        code: 400,
        field: e.path,
        message: e.message,
      }));

      return res.status(400).json({
        success: false,
        code: 400,
        message: "Validation error",
        errors,
      });
    }

    return res.status(500).json({
      success: false,
      code: 500,
      message: "Server error",
      error: err.message,
    });
  }
};

// ===== GET ALL BOOKINGS FOR CURRENT USER =====
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.userId;

    const bookings = await Booking.find({ userId })
      .populate("doctorId", "name specialization department photoUrl")
      .sort({ appointmentDate: 1 });

    return res.status(200).json({
      success: true,
      code: 200,
      message: "Bookings retrieved successfully",
      data: bookings,
      count: bookings.length,
    });
  } catch (err) {
    console.error("Get bookings error:", err);

    return res.status(500).json({
      success: false,
      code: 500,
      message: "Server error",
      error: err.message,
    });
  }
};

// ===== GET BOOKING BY ID =====
export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.userId;

    const booking = await Booking.findById(bookingId).populate(
      "doctorId",
      "name specialization department photoUrl"
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        code: 404,
        message: "Booking not found",
      });
    }

    // Check authorization
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        code: 403,
        message: "You do not have permission to view this booking",
      });
    }

    return res.status(200).json({
      success: true,
      code: 200,
      message: "Booking retrieved successfully",
      data: booking,
    });
  } catch (err) {
    console.error("Get booking error:", err);

    return res.status(500).json({
      success: false,
      code: 500,
      message: "Server error",
      error: err.message,
    });
  }
};

// ===== UPDATE BOOKING =====
export const updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.userId;
    const updates = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        code: 404,
        message: "Booking not found",
      });
    }

    // Check authorization
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        code: 403,
        message: "You do not have permission to update this booking",
      });
    }

    // Prevent status change directly (should use separate endpoints)
    if (updates.status) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "Use specific endpoints to change booking status",
      });
    }

    // Update only allowed fields
    const allowedFields = ["patientName", "patientPhone", "reason", "notes"];
    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        booking[key] = updates[key];
      }
    });

    const updatedBooking = await booking.save();

    const populatedBooking = await Booking.findById(updatedBooking._id).populate(
      "doctorId",
      "name specialization department"
    );

    return res.status(200).json({
      success: true,
      code: 200,
      message: "Booking updated successfully",
      data: populatedBooking,
    });
  } catch (err) {
    console.error("Update booking error:", err);

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => ({
        code: 400,
        field: e.path,
        message: e.message,
      }));

      return res.status(400).json({
        success: false,
        code: 400,
        message: "Validation error",
        errors,
      });
    }

    return res.status(500).json({
      success: false,
      code: 500,
      message: "Server error",
      error: err.message,
    });
  }
};

// ===== CANCEL BOOKING =====
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.userId;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        code: 404,
        message: "Booking not found",
      });
    }

    // Check authorization
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        code: 403,
        message: "You do not have permission to cancel this booking",
      });
    }

    // Check if already cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "Booking is already cancelled",
      });
    }

    booking.status = "cancelled";
    const updatedBooking = await booking.save();

    return res.status(200).json({
      success: true,
      code: 200,
      message: "Booking cancelled successfully",
      data: updatedBooking,
    });
  } catch (err) {
    console.error("Cancel booking error:", err);

    return res.status(500).json({
      success: false,
      code: 500,
      message: "Server error",
      error: err.message,
    });
  }
};

// ===== GET ALL BOOKINGS (ADMIN ONLY) =====
export const getAllBookings = async (req, res) => {
  try {
    const { status, doctorId, sortBy } = req.query;

    let query = {};
    if (status) query.status = status;
    if (doctorId) query.doctorId = doctorId;

    const bookings = await Booking.find(query)
      .populate("doctorId", "name specialization")
      .populate("userId", "name email")
      .sort(sortBy === "newest" ? { createdAt: -1 } : { appointmentDate: 1 });

    return res.status(200).json({
      success: true,
      code: 200,
      message: "All bookings retrieved successfully",
      data: bookings,
      count: bookings.length,
    });
  } catch (err) {
    console.error("Get all bookings error:", err);

    return res.status(500).json({
      success: false,
      code: 500,
      message: "Server error",
      error: err.message,
    });
  }
};
