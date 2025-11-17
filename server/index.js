import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // Add this import
import dotenv from "dotenv";
import {expressjwt} from "express-jwt";
import { connectDB } from "./models/dbSetup.js";

import authenticationRoutes from "./routes/authenticationRoutes.js";
import { authenticationService } from "./logic/authenticationService.js";

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

// Set JWT middleware (protects all routes by default)
app.use(
    expressjwt({
        secret: process.env.ACCESS_TOKEN_SECRET,
        algorithms: ["HS256"],
    }).unless({
        // Paths exempt from JWT authentication
        path: [
            "/auth/login", "/auth/register", "/auth/refresh" // Authentication paths
        ]
    })
);

// Current user middleware (Makes user document available in req.currentUser for protected routes)
app.use(async (req, res, next) => {
    try {
        const user = await authenticationService.getCurrentUser(req, res);

        req.currentUser = user
        next();
    }
    catch (error) {
        console.log("Error in current user middleware:", error);

        req.currentUser = null
        next();
    }
});

const PORT = process.env.PORT || 5000;

// Routers
app.use("/auth", authenticationRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
