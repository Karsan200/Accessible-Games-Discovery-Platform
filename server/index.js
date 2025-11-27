import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // Add this import
import dotenv from "dotenv";
import { expressjwt } from "express-jwt";
import { connectDB } from "./models/dbSetup.js";
import homeRoutes from "./routes/homeRoutes.js";
import gamesRouter from "./routes/gameRoutes.js";
import  reviewRoute  from "./routes/reviewRoute.js";
import searchRoutes from "./routes/searchRoutes.js";

import authenticationRoutes from "./routes/authenticationRoutes.js";
import { authenticationService } from "./logic/authenticationService.js";

import wishlistRoutes from "./routes/wishlistRoutes.js";

dotenv.config();
const app = express();

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.listen(5000, () => {
    console.log("API running on http://localhost:5000");
});

app.use("/images", express.static("public/gameImages"));
app.use("/api/games", gamesRouter);
app.use("/api/reviews", reviewRoute);

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
            "/auth/login", "/auth/register", "/auth/refresh",  "/auth/logout", // Authentication paths
            "/api/home/hero", "/api/home/trending", "/api/home/top-sellers", { url: "/api/search", methods: ["GET"] }, // Public home page paths
            "/games", "/games/:id", // Public game list and details,
            "api/reviews", "/voice-nav"
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
app.use("/api/home", homeRoutes);
app.use("/auth", authenticationRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoute);
app.use("/api/search", searchRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
