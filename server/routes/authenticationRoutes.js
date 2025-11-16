import express from "express";

import { authenticationController } from "../controllers/authenticationController.js";

const router = express.Router();
const _authenticationController = new authenticationController()

// Register
router.post("/login", async (req, res) => {
    return await _authenticationController.login(req, res)
})

// Login
router.post("/register", async (req, res) => {
    return await _authenticationController.register(req, res)
})

// Refresh Token
router.get("/refresh", async (req, res) => {

})

export default router;