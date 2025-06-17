require("dotenv").config();
console.log("JWT_secret:", process.env.JWT_secret); // Läser in .env-filen

const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.set("io", io);
io.on("connection", (socket) => {
  console.log("Användaren ansluten via Websocket:", socket.id);
  socket.on("disconnect", () => {
    console.log("Användare kopplades bort:", socket.id);
  });
});

app.use(express.json());
const bookingroute = require("./routes/bookingroute");
app.use("/api/bookings", bookingroute);

const protectedRoutes = require("./routes/protected");
app.use("/api", protectedRoutes);

const adminRoutes = require("./routes/adminroutes");
app.use("/api", adminRoutes);

const roomRoute = require("./routes/roomroute");
app.use("/api/rooms", roomRoute);

const authRoutes = require("./routes/authroutes"); // Anpassa sökväg om fil ligger annorlunda
//const { Socket } = require("dgram");
app.use("/api", authRoutes); // /api/register, /api/login

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.DB_URL || "mongodb://localhost:27017/booking";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Ansluten till MongoDB"))
  .catch((err) => {
    console.error("MongoDB-anslutningsfel:", err);
    process.exit(1); // Avsluta appen vid fel
  });

app.get("/", (req, res) => {
  res.send("Servern fungerar!");
});

server.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
