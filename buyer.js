const mongoose = require("mongoose");

const buyerSchema = new mongoose.Schema(
  {
    // House info (auto-filled from card)
    houseId: {
      type: Number,
      required: true,
    },
    houseName: {
      type: String,
      required: true,
    },
    houseType: {
      type: String,
      enum: ["house", "villa", "bungalow"],
      required: true,
    },
    housePrice: {
      type: String,
      required: true,
    },

    // Buyer personal details
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    // Booking status
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Buyer", buyerSchema);