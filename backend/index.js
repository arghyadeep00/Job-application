import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import conn from "./config/db.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import passwordRoute from "./routes/passwordRoutes.js";
import interviewRoute from "./routes/interviewRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

conn();
app.use(express.json());
app.use(cookieParser());

const defaultOrigins = ["http://localhost:5173", "http://localhost:3000"];
const envOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) =>
      url.trim().replace(/\/+$/, ""),
    )
  : [];
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/+$/, "");
      if (
        allowedOrigins.includes(cleanOrigin) ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api", otpRoutes);
app.use("/api", jobRoutes);
app.use("/api/interview", interviewRoute);
app.use("/api/forgot-password", passwordRoute);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
