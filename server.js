require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const Buyer = require("./buyer");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// ─── Static house data (mirrors your frontend) ───────────────────────────────
const houses = [
  { id: 1,  name: "Classic 2BHK House",      type: "house",    price: "₹45,00,000",  bedrooms: 2, area: "1200 sq.ft." },
  { id: 2,  name: "Modern Villa 1",           type: "villa",    price: "₹1,20,00,000",bedrooms: 4, area: "2200 sq.ft." },
  { id: 3,  name: "Compact Bungalow",         type: "bungalow", price: "₹60,00,000",  bedrooms: 3, area: "1600 sq.ft." },
  { id: 4,  name: "Luxury Villa Deluxe",      type: "villa",    price: "₹1,80,00,000",bedrooms: 5, area: "3000 sq.ft." },
  { id: 5,  name: "Family 3BHK House",        type: "house",    price: "₹65,00,000",  bedrooms: 3, area: "1500 sq.ft." },
  { id: 6,  name: "Premium Villa 2",          type: "villa",    price: "₹2,00,00,000",bedrooms: 6, area: "3500 sq.ft." },
  { id: 7,  name: "Eco-Friendly Bungalow",    type: "bungalow", price: "₹75,00,000",  bedrooms: 3, area: "1800 sq.ft." },
  { id: 8,  name: "Compact Studio House",     type: "house",    price: "₹30,00,000",  bedrooms: 1, area: "800 sq.ft."  },
  { id: 9,  name: "Farmhouse Villa",          type: "villa",    price: "₹1,50,00,000",bedrooms: 4, area: "2500 sq.ft." },
  { id: 10, name: "Heritage Bungalow",        type: "bungalow", price: "₹85,00,000",  bedrooms: 3, area: "2000 sq.ft." },
  { id: 11, name: "Compact 2BHK Villa",       type: "villa",    price: "₹95,00,000",  bedrooms: 2, area: "1400 sq.ft." },
  { id: 12, name: "Luxury Pool Bungalow",     type: "bungalow", price: "₹1,10,00,000",bedrooms: 4, area: "2300 sq.ft." },
];

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /api/houses → all houses
app.get("/api/houses", (req, res) => {
  const { type } = req.query;
  if (type && type !== "all") {
    return res.json(houses.filter((h) => h.type === type));
  }
  res.json(houses);
});

// GET /api/houses/:id → single house details
app.get("/api/houses/:id", (req, res) => {
  const house = houses.find((h) => h.id === parseInt(req.params.id));
  if (!house) {
    return res.status(404).json({ message: "House not found" });
  }
  res.json(house);
});

// POST /api/bookings → create a new booking (saves buyer to MongoDB)
app.post("/api/bookings", async (req, res) => {
  const { houseId, fullName, email, phone, address } = req.body;

  // Find the house
  const house = houses.find((h) => h.id === parseInt(houseId));
  if (!house) {
    return res.status(404).json({ message: "House not found" });
  }

  // Check if email already booked this house
  const existing = await Buyer.findOne({ email, houseId });
  if (existing) {
    return res.status(400).json({ message: "You have already booked this property." });
  }

  try {
    const buyer = new Buyer({
      houseId: house.id,
      houseName: house.name,
      houseType: house.type,
      housePrice: house.price,
      fullName,
      email,
      phone,
      address,
    });

    await buyer.save();

    res.status(201).json({
      message: "Booking confirmed! We will contact you soon.",
      booking: buyer,
    });
  } catch (err) {
    // Mongoose validation errors
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: errors.join(", ") });
    }
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// GET /api/bookings → get all bookings (admin view)
app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Buyer.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/bookings/:id → single booking details
app.get("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Buyer.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/bookings/:id/status → update booking status
app.patch("/api/bookings/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Buyer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Status updated", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/bookings/:id → cancel/delete booking
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Buyer.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;