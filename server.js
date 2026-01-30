import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import helmet from "helmet";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import callRoutes from "./routes/callRoutes.js";
import { setupSocket } from "./websocket/index.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(helmet());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", chatRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/call", callRoutes);

server.listen(process.env.PORT || 5016, () => console.log("Server running"));
