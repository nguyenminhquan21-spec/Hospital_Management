/**
 * Script to create a test user for API testing
 * Run: node create-test-user.mjs
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "Test@1234",
  role: "user",
};

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if user already exists
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log("✅ Test user already exists");
      console.log("Email:", existingUser.email);
      console.log("ID:", existingUser._id);
      await mongoose.disconnect();
      return;
    }

    // Create new test user
    const newUser = new User(testUser);
    await newUser.save();
    
    console.log("✅ Test user created successfully!");
    console.log("Email:", newUser.email);
    console.log("Password:", testUser.password);
    console.log("User ID:", newUser._id);
    console.log("\n📝 Use these credentials to test the API");

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error creating test user:", error.message);
    process.exit(1);
  }
}

createTestUser();
