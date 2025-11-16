import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./models/dbSetup.js";
import gamesRouter from "./routes/gameRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/images", express.static("public/gameImages"));

app.use("/api/games", gamesRouter);

// Connect to MongoDB
await connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
