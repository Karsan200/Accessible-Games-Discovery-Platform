import { User } from "../models/dbSetup.js";
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
}