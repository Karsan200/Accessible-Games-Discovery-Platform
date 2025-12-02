import { sanitiseSearch, escapeForRegex, maxInputLength } from "../src/data/InputSanitation";

describe("sanitiseSearch", () => {

    // checking if null is returned for invalid inputs
    test("returns null when input is null, undefined, or empty", () => {
        expect(sanitiseSearch(null)).toBeNull();
        expect(sanitiseSearch(undefined)).toBeNull();
        expect(sanitiseSearch("")).toBeNull();
    });

    test("trims surrounding whitespace", () => {
        const result = sanitiseSearch("   test   ");
        expect(result).toBe("test");
    });

    test("removes HTML tags", () => {
        const result = sanitiseSearch("<b>testing123</b>");
        expect(result).toBe("testing123");
    });

    test("removes MongoDB and injection-related characters", () => {
        const result = sanitiseSearch("{testWord}$;|");
        expect(result).toBe("testWord");
    });

    test("removes leading dots", () => {
        const result = sanitiseSearch(".test");
        expect(result).toBe("test");
    });

    test("removes multiple spaces", () => {
        const result = sanitiseSearch("te    st");
        expect(result).toBe("test");
    });

    test("returns null when sanitised result is empty", () => {
        const result = sanitiseSearch("$$$$$");
        expect(result).toBeNull();
    });

    test("returns null when input exceeds maximum length", () => {
        const longInput = "a".repeat(maxInputLength + 1);
        const result = sanitiseSearch(longInput);
        expect(result).toBeNull();
    });

    test("respects a custom maximum length when provided", () => {
        const result = sanitiseSearch("abcdef", 5);
        expect(result).toBeNull();
    });

    test("returns sanitised string when input is valid", () => {
        const result = sanitiseSearch("safeSearch123");
        expect(result).toBe("safeSearch123");
    });
});

describe("escapeForRegex", () => {

    test("escapes special regex characters", () => {
        const result = escapeForRegex("a+b*c");
        expect(result).toBe("a\\+b\\*c");
    });

    test("returns the same string when the input is valid", () => {
        const result = escapeForRegex("testWord");
        expect(result).toBe("testWord");
    });

    test("escapes all regex control characters correctly", () => {
        const result = escapeForRegex(".*+?^${}()|[]\\");
        expect(result).toBe("\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\");
    });
});
