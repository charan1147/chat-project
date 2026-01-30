import Message from "../models/Message.js";
import { userSocketMap } from "../websocket/index.js";

export const sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;

  const message = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    content,
  });

  const socketId = userSocketMap.get(receiverId);
  if (socketId) {
    req.io.to(socketId).emit("receiveMessage", message);
  }

  res.status(201).json(message);
};

export const getMessages = async (req, res) => {
  const { contactId } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: contactId },
      { sender: contactId, receiver: req.user._id },
    ],
  }).sort("createdAt");

  res.json(messages);
};
