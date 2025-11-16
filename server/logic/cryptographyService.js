import crypto from 'crypto';
import jsonwebtoken from "jsonwebtoken";

export class cryptographyService {

    /**
     * Create a cryptographically secure random salt.
     *
     * @param {number} [size=16] - Number of random bytes to generate.
     * @returns {string} Hex\-encoded salt string.
     */
    static createSalt(size = 16) {
        return crypto.randomBytes(size).toString('hex');
    }

    /**
     * Hash a password with a given salt using SHA256.
     *
     * @param {string} password - Plain text password.
     * @param {string} salt - Hex encoded salt
     * @returns {string} Password hash.
     */
    static hashPassword(password, salt) {
        return crypto.hash('sha256', password + salt);
    }

    /**
     * Verify that a password matches.
     *
     * @param {string} password - Plain text password to verify.
     * @param {string} salt - Salt that was used when hashing the stored password.
     * @param {string} hash - Stored password hash.
     * @returns {boolean} `true` if the password is valid, otherwise `false`.
     */
    static verfiyPassword(password, salt, hash) {
        const hashedPassword = this.hashPassword(password, salt);
        return hashedPassword === hash;
    }

    /**
     * Create a JWT refresh token for a user.
     *
     * @param userId {string} userId
     * @returns {string} JWT refresh token
     */
    static createRefreshToken(userId) {
        return jsonwebtoken.sign(
            {
                userId: userId,
                uuid: crypto.randomUUID(),
                issued: Date.now()
            },
            process.env.REFRESH_TOKEN_SECRET,
            { algorithm: 'HS256', expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        );
    }

    /**
     * Verify a JWT refresh token.
     *
     * @param token {string} JWT refresh token
     * @returns {{valid: boolean, payload: JwtPayload | string}|{valid: boolean, error: *}} Verification result
     */
    static verifyRefreshToken(token) {
        try {
            // This both verifies the signature and checks expiry
            const decoded = jsonwebtoken.verify(
                token,
                process.env.REFRESH_TOKEN_SECRET
        );
            return { valid: true, payload: decoded };
        } catch (err) {
            return { valid: false, error: err };
        }
    }

    /**
     * Create a JWT access token for a user.
     *
     * @param userId {string} userId
     * @returns {string} JWT access token
     */
    static createAccessToken(userId) {
        return jsonwebtoken.sign(
            {
                userId: userId,
                uuid: crypto.randomUUID(),
                issued: Date.now()
            },
            process.env.ACCESS_TOKEN_SECRET,
            { algorithm: 'HS256', expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
        );
    }
}