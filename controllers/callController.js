import Message from "../models/Message.js";
import { getRoomId, getSocketIdByUserId } from "../websocket/index.js";

export const startCall = async (req, res) => {
  const { receiverId, callType = "video" } = req.body;
  const roomId = getRoomId(req.user._id, receiverId);

  await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    type: callType,
    callInfo: { callType, roomId, startedAt: new Date() },
  });

  const socketId = getSocketIdByUserId(receiverId);
  if (socketId) {
    req.io.to(socketId).emit("call:user", {
      from: req.user._id,
      roomId,
    });
  }

  res.json({ roomId });
};

export const endCall = async (req, res) => {
  const { roomId } = req.body;

  const call = await Message.findOne({ "callInfo.roomId": roomId });
  if (call) {
    call.callInfo.endedAt = new Date();
    call.callInfo.duration =
      (call.callInfo.endedAt - call.callInfo.startedAt) / 1000;
    await call.save();
  }

  res.json({ success: true });
};
