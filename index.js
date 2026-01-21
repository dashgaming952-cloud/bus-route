const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json());

// ✅ SERVE STATIC FILES (CSS)
app.use(express.static(path.join(__dirname, "public")));

// 🔗 MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/busdb")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

// 🚌 Bus Schema
const BusSchema = new mongoose.Schema({
  routeNumber: Number,
  routeName: String,
  startTime: String,
  busNumber: String,
  gpsInfo: String,
  driverName: String,
  driverPhone: String,
  stops: String,
  alcoholLevel: Number,
  tirePressurePSI: Number
});

const Bus = mongoose.model("Bus", BusSchema);

// 🌐 Serve Frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🔍 Search API (Route OR Stop OR Both)
app.get("/search", async (req, res) => {
  const { routeNumber, stop } = req.query;
  let query = {};

  if (routeNumber) {
    query.routeNumber = Number(routeNumber);
  }

  if (stop) {
    query.stops = { $regex: stop, $options: "i" };
  }

  const buses = await Bus.find(query);

  if (buses.length === 0) {
    return res.json({ error: "No buses found" });
  }

  res.json(buses);
});

// ▶️ Start Server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
