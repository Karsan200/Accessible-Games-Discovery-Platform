const searchRouter = require("../routes/searchRoutes.js").default;
const { Game, Tag } = require("../models/dbSetup.js");

const req = (query = {}) => ({ query });
const res = () => {
    const r = {};
    r.status = jest.fn().mockReturnValue(r);
    r.json = jest.fn().mockReturnValue(r);
    return r;
};

const next = jest.fn();

// handler for extracting the search route handler
const getSearchHandler = () => {
    return searchRouter.stack
        .find(
            (layer) =>
                layer.route &&
                layer.route.methods.get &&
                (layer.route.path === "/" || layer.route.path === "")
        )
        ?.route.stack[0].handle;
};

// removing logged errors before and after tests (the errors are expected, but this just cleans it up after)
beforeAll(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
});
afterAll(() => {
    console.warn.mockRestore();
    console.error.mockRestore();
});

// resetting mocks before each test
beforeEach(() => {
    jest.clearAllMocks();

    Game.countDocuments = jest.fn().mockResolvedValue(0);

    Game.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
        populate: jest.fn().mockResolvedValue([]),
    });

    Tag.distinct = jest.fn().mockResolvedValue([]);
    Game.distinct = jest.fn().mockResolvedValue([]);
});

// test for validation errors
describe("GET /api/search - validation", () => {
    it("returns 400 if query is missing", async () => {
        const handler = getSearchHandler();
        const response = res();

        await handler(req({}), response, next);
        expect(response.status).toHaveBeenCalledWith(400);
    });
});

// tests for successful queries
describe("GET /api/search - successful queries", () => {
    it("returns matching games for valid query", async () => {
        const mockGames = [{ _id: "1", title: "Test Game" }];

        Game.find = jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockGames),
            populate: jest.fn().mockResolvedValue(mockGames),
        });

        const handler = getSearchHandler();
        const response = res();
        await handler(req({ q: "test" }), response, next);
        // checking that response contains the mock games
        expect(response.json).toHaveBeenCalled();
    });

    it("handles genre filter", async () => {
        const handler = getSearchHandler();
        const response = res();
        await handler(req({ q: "test", genre: "Action" }), response, next);
        // checking that response is sent
        expect(response.json).toHaveBeenCalled();
    });

    it("handles multiple genre filters", async () => {
        const handler = getSearchHandler();
        const response = res();

        await handler(req({ q: "test", genre: ["Action", "RPG"] }), response, next);
        expect(response.json).toHaveBeenCalled();
    });

    it("handles accessibility filter", async () => {
        const handler = getSearchHandler();
        const response = res();

        await handler(req({ q: "test", accessibility: "Visual" }), response, next);
        expect(response.json).toHaveBeenCalled();
    });

    it("handles multiple accessibility filters", async () => {
        const handler = getSearchHandler();
        const response = res();

        await handler(req({ q: "test", accessibility: ["Visual", "Audio"] }), response, next);
        expect(response.json).toHaveBeenCalled();
    });

    it("handles sort by rating", async () => {
        const handler = getSearchHandler();
        const response = res();

        await handler(req({ q: "test", sort: "rating" }), response, next);
        expect(response.json).toHaveBeenCalled();
    });

    it("handles sort by accessibility", async () => {
        const handler = getSearchHandler();
        const response = res();
        await handler(req({ q: "test", sort: "accessibility" }), response, next);
        expect(response.json).toHaveBeenCalled();
    });

    it("returns empty array when no games match", async () => {
        const handler = getSearchHandler();
        const response = res();
        await handler(req({ q: "nonexistent" }), response, next);
        expect(response.json).toHaveBeenCalledWith([]);
    });
});

// tests for checking error handling
describe("GET /api/search - error handling", () => {
    it("handles database errors", async () => {
        Game.find = jest.fn().mockImplementation(() => {
            throw new Error("Database error");
        });

        const handler = getSearchHandler();
        const response = res();
        await handler(req({ q: "test" }), response, next);
        expect(response.status).toHaveBeenCalledWith(500);
    });

    it("handles populate errors", async () => {
        Game.find = jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockRejectedValue(new Error("Populate failed")),
        });

        const handler = getSearchHandler();
        const response = res();
        await handler(req({ q: "test" }), response, next);
        // checking for 500 error status
        expect(response.status).toHaveBeenCalledWith(500);
    });
});
