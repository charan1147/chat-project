import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: String,
    type: { type: String, enum: ["text", "video", "audio"], default: "text" },
    callInfo: {
      callType: String,
      roomId: String,
      startedAt: Date,
      endedAt: Date,
      duration: Number,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Message", messageSchema);
