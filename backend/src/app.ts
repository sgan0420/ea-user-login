import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 5173;

app.use(express.json());

app.use(
  cors({
    origin: `http://localhost:${CORS_ORIGIN}`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/", (_, res) => res.send("Backend is running."));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
