import { Server } from "socket.io";

export const userSocketMap = new Map();

export const getSocketIdByUserId = (id) => userSocketMap.get(id);

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL },
  });

  io.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    socket.on("register", (userId) => {
      userSocketMap.set(userId, socket.id);
      socket.userId = userId;
      console.log(`Registered user ${userId}`);
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        userSocketMap.delete(socket.userId);
        console.log(`User ${socket.userId} disconnected`);
      }
    });
  });

  return io;
};
