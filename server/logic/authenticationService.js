import {Session, User} from "../models/dbSetup.js";
import {httpError} from "../errors/httpError.js";
import {cryptographyService} from "./cryptographyService.js";

export class authenticationService {
    async registerTraditional({ username, email, password }) {
        // Ensure all fields are provided
        if (!username || !email || !password) {
            throw new httpError(400, "Username, email, and password are required");
        }

        // Check if user already exists
        if (await User.findOne({ 'email': email }) !== null) {
            throw new httpError(409, "User with this email already exists");
        }

        // Check if username already exists
        if (await User.findOne({ 'username': username }) !== null) {
            throw new httpError(409, "User with this username already exists");
        }

        // Create password salt
        const salt = cryptographyService.createSalt()

        // Create new user
        const newUser = new User({
            username: username,
            email: email,
            password: cryptographyService.hashPassword(password, salt),
            salt: salt
        })

        await newUser.save();
    }

    async login({ email, password }) {
        // Ensure all fields are provided
        if (!email || !password) {
            throw new httpError(400, "Email and password are required");
        }

        // Find user by email
        const user = await User.findOne({ 'email': email });
        if (user === null) {
            throw new httpError(401, "Invalid email or password");
        }

        // Verify password
        const hashedPassword = cryptographyService.hashPassword(password, user.salt);
        if (hashedPassword !== user.password) {
            throw new httpError(401, "Invalid email or password");
        }

        // Create refresh token
        const refreshToken = cryptographyService.createRefreshToken({ userId: user._id });

        // Create session
        const newSession = new Session({
            user_id: user._id,
            token: refreshToken
        })
        await newSession.save();

        // Create access token
        const accessToken = cryptographyService.createAccessToken({ userId: user._id });

        return { accessToken, refreshToken };
    }

    async refreshToken(token) {
        // Verify refresh token
        const { valid, payload, error } = cryptographyService.verifyRefreshToken(token);
        if (!valid) {
            throw new httpError(401, "Invalid or expired refresh token");
        }

        // Check if session exists
        const session = await Session.findOne({ token: token });
        if (session === null) {
            throw new httpError(401, "Session not found");
        }

        // Create new access token
        const accessToken = cryptographyService.createAccessToken({ userId: payload.userId });

        return { accessToken };
    }
}