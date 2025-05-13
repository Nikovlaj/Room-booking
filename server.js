const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(express.json());

// Anslut till MongoDB utan deprecated options
mongoose
  .connect("mongodb://localhost:27017/roomBooking")
  .then(() => console.log("✅ Ansluten till MongoDB"))
  .catch((err) => console.error("❌ MongoDB-anslutningsfel:", err));

// Test-rutt
app.get("/", (req, res) => {
  res.send("Servern fungerar!");
});

// Starta servern
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servern körs på http://localhost:${PORT}`);
});
