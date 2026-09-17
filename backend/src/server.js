import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import ipRoutes from "./routes/ipRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "50kb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use(limiter);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "🚀 IP Lookup API running 👍",
  });
});

app.use("/api/ip", ipRoutes);

app.listen(PORT, () => {
  console.log(`🚀 IP Lookup API running on port ${PORT}`);
});