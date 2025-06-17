const { io } = require("socket.io-client");

// Byt ut url till din server
const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Ansluten till Socket.IO-server:", socket.id);
});

socket.on("bookingCreated", (data) => {
  console.log("Notifiering: Bokning skapad:", data);
});

socket.on("bookingUpdated", (data) => {
  console.log("Notifiering: Bokning uppdaterad:", data);
});

socket.on("bookingDeleted", (data) => {
  console.log("Notifiering: Bokning borttagen:", data);
});

socket.on("disconnect", () => {
  console.log("Kopplingen bruten");
});
