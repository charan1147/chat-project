import { Server } from "socket.io";

export const userSocketMap = new Map();

export const getSocketIdByUserId = (id) => userSocketMap.get(id);
export const getRoomId = (a, b) => [String(a), String(b)].sort().join("_");

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL },
  });

  io.on("connection", (socket) => {
    socket.on("register", (userId) => {
      userSocketMap.set(userId, socket.id);
      socket.userId = userId;
    });

    socket.on("answerCall", ({ roomId, signal }) => {
      const [a, b] = roomId.split("_");
      const other = socket.userId === a ? b : a;
      const socketId = userSocketMap.get(other);
      if (socketId) io.to(socketId).emit("call:accepted", { signal });
    });

    socket.on("endCall", ({ roomId }) => {
      const [a, b] = roomId.split("_");
      const other = socket.userId === a ? b : a;
      const socketId = userSocketMap.get(other);
      if (socketId) io.to(socketId).emit("call:ended");
    });

    socket.on("disconnect", () => {
      if (socket.userId) userSocketMap.delete(socket.userId);
    });
  });

  return io;
};
