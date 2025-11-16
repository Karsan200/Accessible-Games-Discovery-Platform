import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./models/dbSetup.js";

import authenticationRoutes from "./routes/authenticationRoutes.js";

dotenv.config();
const app = express();

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
await connectDB();

const PORT = process.env.PORT || 5000;

// Routers
app.use("/api/auth", authenticationRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
