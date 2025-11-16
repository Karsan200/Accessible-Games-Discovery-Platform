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
            const { accessToken, refreshToken } = await this.authenticationService.login(req.body);

            // Set refresh token as HttpOnly cookie
            res.cookie('token', refreshToken, {
                httpOnly: true,
                sameSite: 'None', secure: true,
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.status(201).json({ accessToken: accessToken });
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
            // Get refresh token from cookies
            if (!req.cookies || !req.cookies.token) {
                throw new httpError(401, "Refresh token is missing");
            }

            const token = req.cookies.token;

            const accessToken = await this.authenticationService.refreshToken(token);

            return res.status(200).json({ accessToken: accessToken });
        }
        catch (error) {
            // Check if the error is known
            if (error instanceof httpError) {
                // Remove invalid refresh token cookie, if unauthorised
                if (error.statusCode === 401) {
                    res.clearCookie('token');
                }

                return res.status(error.statusCode).json({ error: error.message });
            }

            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}