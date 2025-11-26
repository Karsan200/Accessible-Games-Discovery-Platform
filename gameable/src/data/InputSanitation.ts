
export const maxInputLength = 100;

export function sanitiseSearch(input: string | null | undefined, maxLen = maxInputLength): string | null {
    /**
     * Sanitising user input for safe search queries on our DB.
     * @param input - The user input string to sanitise.
     * @param maxLen - Maximum allowed length for the input.
     * @returns Sanitised string or null if input is not appropriate.
     */
    // Returning null if the input is null
    if (!input) return null;

    // Remove whitespace
    let sanitisedSearch = String(input).trim();

    /* Learning resources used:
    https://portswigger.net/web-security/nosql-injection,
    https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.6-Testing_for_NoSQL_Injection,
    https://medium.com/@kater_akeren/data-sanitization-against-nosql-query-injection-in-mongodb-and-node-js-application-dad2ffca5f01
     */


    // Removing HTML tags
    sanitisedSearch = sanitisedSearch.replace(/<[^>]*>/g, "");

    // Removing characters used in injection attacks
    sanitisedSearch = sanitisedSearch.replace(/[{};`|^\\<>]/g, "");

    // Removing the $, as it is used in mongoDb queries
    sanitisedSearch = sanitisedSearch.replace(/\$/g, "");

    // Removing leading dots from tokens
    sanitisedSearch = sanitisedSearch.replace(/(^|\s)\./g, "$1");

    // Removing multiple spaces
    sanitisedSearch = sanitisedSearch.replace(/\s+/g, "");

    // Ensuring the length does not exceed maxLen, which is 100 at the moment
    if (sanitisedSearch.length === 0 || sanitisedSearch.length > maxLen) return null;

    return sanitisedSearch;
}
export function escapeForRegex(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
