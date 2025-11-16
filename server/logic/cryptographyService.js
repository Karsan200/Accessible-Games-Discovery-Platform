import crypto from 'crypto';

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
}