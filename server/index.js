import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // Add this import
import dotenv from "dotenv";
import {expressjwt} from "express-jwt";
import { connectDB } from "./models/dbSetup.js";

import authenticationRoutes from "./routes/authenticationRoutes.js";

dotenv.config();
const app = express();

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
await connectDB();

// Set JWT middleware (protects /api routes)
app.use("/api", expressjwt({ secret: process.env.ACCESS_TOKEN_SECRET, algorithms: ["HS256"] }));

const PORT = process.env.PORT || 5000;

// Routers
app.use("/auth", authenticationRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
