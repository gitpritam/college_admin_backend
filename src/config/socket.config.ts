import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import corsOptions from "./cors.config";

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: corsOptions,
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    console.log("Socket token:", token);
    if (!token) {
      return next(new Error("Unauthorized"));
    }

    // verify JWT here
    next();
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
