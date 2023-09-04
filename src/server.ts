/* eslint-disable no-console */
import { Server } from "socket.io";
import app from "./app";

import crypto from "crypto";

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

// Store user nicknames and messages
const users = {};
type id = `${string}-${string}-${string}-${string}-${string}`;
const messages: { id: id; text: string }[] = [];

io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for incoming messages from clients
  socket.on("message", (message) => {
    const { id, text } = message;
    const newMessage = { text, id: crypto.randomUUID() };

    // Store the message in the message history
    messages.push(newMessage);

    // Broadcast the message to all connected clients
    io.emit("message", newMessage);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    io.emit("userList", Object.values(users));
  });

  // Send message history to the newly connected client
  socket.emit("messageHistory", messages);
});

export default server;
