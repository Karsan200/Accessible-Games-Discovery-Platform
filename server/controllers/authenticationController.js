import {httpError} from "../errors/httpError.js";
import {authenticationService} from "../logic/authenticationService.js";

export class authenticationController {
    constructor() {
        this.authenticationService = new authenticationService();
    }

    async register(req, res) {
        try {
            await this.authenticationService.registerTraditional(req.body);

            return res.status(201).json({ message: "User registered successfully" });
        }
        catch (error) {
            // Check if the error is known
            if (error instanceof httpError) {
                return res.status(error.statusCode).json({ error: error.message });
            }

            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async login(req, res) {
        try {
            // Login logic here
        }
        catch (error) {
            // Check if the error is known
            if (error instanceof httpError) {
                return res.status(error.statusCode).json({ error: error.message });
            }

            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async refreshToken(req, res) {
        try {
            // Refresh token logic here
        }
        catch (error) {
            // Check if the error is known
            if (error instanceof httpError) {
                return res.status(error.statusCode).json({ error: error.message });
            }

            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}