import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import messageRoute from "./routes/messagesRoute"
import dotenv from 'dotenv';
import { Server } from "socket.io";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute)
if (!process.env.MONGODB_URL) {
  throw new Error("MONGODB_URL environment variable is not defined");
}

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started at PORT ${process.env.PORT}`)
);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials:true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("add-user", (userId) => {
    console.log("User added:", userId);
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
    }
  })
});