export class httpError extends Error {
    /**
     * @param {number} statusCode HTTP status code (e.g. 406).
     * @param {string} message Human readable error message.
     */
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = "HttpError";
        Error.captureStackTrace?.(this, this.constructor);
    }
}