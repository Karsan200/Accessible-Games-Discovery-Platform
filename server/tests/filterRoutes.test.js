const filterRouter = require("../routes/filterRoutes.js").default;
const { Game, Genre, Tag, AccessibilityGroup } = require("../models/dbSetup.js");
const mongoose = require("mongoose");

//
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
    return filterRouter.stack.find(
        (layer) =>
            layer.route &&
            layer.route.methods.get &&
            (layer.route.path === "/" || layer.route.path === "")
    )?.route.stack[0].handle;
};

// handler for extracting the options route handler
const getOptionsHandler = () => {
    return filterRouter.stack.find(
        (layer) =>
            layer.route &&
            layer.route.methods.get &&
            layer.route.path === "/options"
    )?.route.stack[0].handle;
};

// remove logged errors before and after tests (the errors are expected, but this just cleans it up after)
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
});
afterAll(() => {
    console.log.mockRestore();
    console.warn.mockRestore();
    console.error.mockRestore();
});

// resetting mocks before each test
beforeEach(() => {
    jest.clearAllMocks();

    Genre.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
    });

    AccessibilityGroup.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
        select: jest.fn().mockReturnThis(),
    });

    Tag.find = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue([]),
    });

    Game.aggregate = jest.fn().mockReturnValue({
        allowDiskUse: jest.fn().mockResolvedValue([]),
    });
});

// tests for options route
describe("GET /api/search/options", () => {
    it("returns genres and accessibility options", async () => {
        // filtering for genres
        Genre.find = jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue([
                { name: "Action" },
                { name: "RPG" },
            ]),
        });

        // filtering for accessibility groups
        AccessibilityGroup.find = jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue([
                { name: "Visual" },
                { name: "Audio" },
            ]),
        });

        const handler = getOptionsHandler();
        const response = res();
        await handler(req(), response, next);

        // checking that the response contains the expected genres and accessibility options
        expect(response.json).toHaveBeenCalledWith({
            genres: ["Action", "RPG"],
            accessibility: ["Visual", "Audio"],
        });
    });

    it("handles database errors", async () => {
        Genre.find = jest.fn().mockImplementation(() => {
            throw new Error("DB error");
        });

        const handler = getOptionsHandler();
        const response = res();
        await handler(req(), response, next);

        // expecting a 500 status on error
        expect(response.status).toHaveBeenCalledWith(500);
    });
});

// tests for search route
describe("GET /api/search", () => {
    it("returns results for plain text query", async () => {
        Game.aggregate = jest.fn().mockReturnValue({
            allowDiskUse: jest.fn().mockResolvedValue([
                { id: "1", title: "Test Game", avgRating: 4 },
            ]),
        });

        const handler = getSearchHandler();
        const response = res();

        await handler(req({ q: "test" }), response, next);

        // checking if the response contains the expected game
        expect(Game.aggregate).toHaveBeenCalled();
        expect(response.json).toHaveBeenCalled();
    });

    it("handles genre filtering", async () => {
        Genre.find = jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue([
                { _id: new mongoose.Types.ObjectId() },
            ]),
        });

        const handler = getSearchHandler();
        const response = res();
        await handler(req({ q: "test", genre: "Action" }), response, next);

        expect(Game.aggregate).toHaveBeenCalled();
        expect(response.json).toHaveBeenCalled();
    });

    it("handles accessibility filtering", async () => {
        const fakeId = new mongoose.Types.ObjectId();

        // mocking AccessibilityGroup to return a specific ID for the given accessibility filter
        AccessibilityGroup.find = jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue([{ _id: fakeId }]),
        });
        Tag.find = jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue([
                { game_id: fakeId, accessibility_group_id: fakeId },
            ]),
        });

        const handler = getSearchHandler();
        const response = res();
        await handler(req({ accessibility: "Visual" }), response, next);

        // checking if the correct response is sent
        expect(Game.aggregate).toHaveBeenCalled();
        expect(response.json).toHaveBeenCalled();
    });

    it("handles sort by rating", async () => {
        const handler = getSearchHandler();
        const response = res();

        await handler(req({ sort: "rating" }), response, next);

        expect(Game.aggregate).toHaveBeenCalled();
        expect(response.json).toHaveBeenCalled();
    });

    it("handles sort by accessibility", async () => {
        const handler = getSearchHandler();
        const response = res();

        await handler(req({ sort: "accessibility" }), response, next);

        expect(Game.aggregate).toHaveBeenCalled();
        expect(response.json).toHaveBeenCalled();
    });

    it("returns empty results safely", async () => {
        Game.aggregate = jest.fn().mockReturnValue({
            allowDiskUse: jest.fn().mockResolvedValue([]),
        });

        const handler = getSearchHandler();
        const response = res();
        await handler(req({ q: "nothing" }), response, next);

        expect(response.json).toHaveBeenCalledWith([]);
    });

    it("handles aggregation failure", async () => {
        // mocking Game.aggregate to throw an error
        Game.aggregate = jest.fn().mockImplementation(() => {
            throw new Error("Aggregation failed");
        });

        const handler = getSearchHandler();
        const response = res();
        await handler(req({ q: "test" }), response, next);

        // expecting a 500 status on error
        expect(response.status).toHaveBeenCalledWith(500);
    });
});
