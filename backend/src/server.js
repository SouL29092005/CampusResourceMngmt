import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { startBookingStatusJob } from "./jobs/bookingStatus.job.js";
import { startRoomBookingStatusJob } from "./jobs/roomBookingStatus.job.js";


import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  if (process.env.ENABLE_CRON === "true") {
    startBookingStatusJob();
    startRoomBookingStatusJob();
  }

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  app.set("io", io);

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
