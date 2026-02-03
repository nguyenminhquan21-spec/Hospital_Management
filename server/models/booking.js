import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // Patient Info
    patientName: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
      minlength: [2, "Patient name must be at least 2 characters"],
    },
    patientEmail: {
      type: String,
      required: [true, "Patient email is required"],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    patientPhone: {
      type: String,
      required: [true, "Patient phone is required"],
      match: [/^[0-9]{10,}$/, "Please provide a valid phone number"],
    },

    // Doctor Info
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor selection is required"],
    },
    doctorName: {
      type: String,
      required: true,
    },

    // Booking Details
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
      validate: {
        validator: function(v) {
          return v > new Date();
        },
        message: "Appointment date must be in the future",
      },
    },
    timeSlot: {
      type: String,
      required: [true, "Time slot is required"],
      enum: {
        values: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
        message: "Invalid time slot",
      },
    },
    reason: {
      type: String,
      required: [true, "Reason for visit is required"],
      maxlength: [500, "Reason cannot exceed 500 characters"],
    },

    // Status
    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "completed", "cancelled"],
        message: "Invalid booking status",
      },
      default: "pending",
    },

    // Link to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    // Notes
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
bookingSchema.index({ userId: 1, appointmentDate: 1 });
bookingSchema.index({ doctorId: 1, appointmentDate: 1 });
bookingSchema.index({ status: 1 });

export default mongoose.model("Booking", bookingSchema);
