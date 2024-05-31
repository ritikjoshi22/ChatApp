import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);

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
