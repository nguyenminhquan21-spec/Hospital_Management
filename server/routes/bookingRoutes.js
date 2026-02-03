import express from "express";
import {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  getAllBookings,
} from "../controllers/bookingController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isAdmin from "../middleware/isAdmin.js";
import validateBooking from "../middleware/validateBooking.js";

const router = express.Router();

// ===== PROTECTED ROUTES (Authenticated Users) =====
router.use(isAuthenticated);

// Create new booking
router.post("/", validateBooking, createBooking);

// Get all bookings for current user
router.get("/my-bookings", getMyBookings);

// Get specific booking
router.get("/:bookingId", getBookingById);

// Update booking
router.put("/:bookingId", updateBooking);

// Cancel booking
router.delete("/:bookingId/cancel", cancelBooking);

// ===== ADMIN ONLY ROUTES =====
router.use(isAdmin);

// Get all bookings (admin only)
router.get("/admin/all-bookings", getAllBookings);

export default router;
