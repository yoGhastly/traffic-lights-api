/* eslint-disable no-console */
import { Server } from "socket.io";
import app from "./app";

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env"),
  );
  console.log("  Press CTRL-C to stop\n");
});

export const io = new Server(server, {
  cors: {
    origin: ["www.piesocket.com", "http://localhost:8081"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Access-Control-Allow-Origin"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for incoming messages from clients
  socket.on("message", (message) => {
    // Broadcast the message to all connected clients
    io.emit("message", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

export default server;
