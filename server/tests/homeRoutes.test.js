import { jest } from "@jest/globals";
import homeRouter from "../routes/homeRoutes.js";
import { Game, GameMedia, Review, Wishlist, Tag } from "../models/dbSetup.js";

// Mock request and response
const req = (body = {}) => ({ body });
const res = () => {
    const resObj = {};
    resObj.status = jest.fn().mockReturnValue(resObj);
    resObj.json = jest.fn().mockReturnValue(resObj);
    return resObj;
};

// Helper to get route handler
const getHandler = (path) => {
    return homeRouter.stack.find(
        (layer) => layer.route && layer.route.path === path
    ).route.stack[0].handle;
};

describe("Home Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /trending", () => {
        it("should return trending games with images and tags", async () => {
            const recentDate = expect.any(Date);

            // Mock Review and Wishlist
            Review.find = jest.fn().mockReturnValue({
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue([{ game_id: "g1" }, { game_id: "g2" }]),
            });

            Wishlist.find = jest.fn().mockReturnValue({
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue([{ game_id: "g1" }]),
            });

            // Mock Game
            Game.find = jest.fn().mockReturnValue({
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue([
                    { _id: "g1", title: "Game 1", description: "Desc 1", tagline: "Tag 1" },
                    { _id: "g2", title: "Game 2", description: "Desc 2", tagline: "Tag 2" },
                ]),
            });

            // Mock helper functions
            GameMedia.find = jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue([{ game_id: "g1", type: "icon", url: "icon1.png" }]),
            });

            Tag.find = jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue([{ game_id: "g1", name: "vision" }]),
            });

            const response = res();
            const handler = getHandler("/trending");

            await handler(req(), response);

            expect(response.json).toHaveBeenCalledWith([
                {
                    id: "g1",
                    image: "icon1.png",
                    name: "Game 1",
                    description: "Desc 1",
                    tagline: "Tag 1",
                    tags: ["Visual"],
                },
                {
                    id: "g2",
                    image: "",
                    name: "Game 2",
                    description: "Desc 2",
                    tagline: "Tag 2",
                    tags: [],
                },
            ]);
        });
    });

    describe("GET /top-sellers", () => {
        it("should return top-seller games with rating and tags", async () => {
            Review.aggregate = jest.fn().mockResolvedValue([
                { _id: "g1", avgRating: 4.5, reviewCount: 10 },
                { _id: "g2", avgRating: 4.0, reviewCount: 5 },
            ]);

            Game.find = jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue([
                    { _id: "g1", title: "Game 1", description: "Desc 1", tagline: "Tag 1" },
                    { _id: "g2", title: "Game 2", description: "Desc 2", tagline: "Tag 2" },
                ]),
            });

            GameMedia.find = jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue([{ game_id: "g1", type: "icon", url: "icon1.png" }]),
            });

            Tag.find = jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue([{ game_id: "g1", name: "vision" }]),
            });

            const response = res();
            const handler = getHandler("/top-sellers");

            await handler(req(), response);

            expect(response.json).toHaveBeenCalledWith([
                {
                    id: "g1",
                    image: "icon1.png",
                    title: "Game 1",
                    description: "Desc 1",
                    tagline: "Tag 1",
                    tags: ["Visual"],
                    rating: 4.5,
                    reviewCount: 10,
                },
                {
                    id: "g2",
                    image: "",
                    title: "Game 2",
                    description: "Desc 2",
                    tagline: "Tag 2",
                    tags: [],
                    rating: 4.0,
                    reviewCount: 5,
                },
            ]);
        });
    });

    describe("GET /hero", () => {
        it("should return hero games with images and tags and cache them", async () => {
            // Force cache empty
            const now = Date.now();
            jest.spyOn(global.Date, "now").mockReturnValue(now);

            Game.find = jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue([
                    { _id: "g1", title: "Game 1", description: "Desc 1", tagline: "Tag 1" },
                    { _id: "g2", title: "Game 2", description: "Desc 2", tagline: "Tag 2" },
                    { _id: "g3", title: "Game 3", description: "Desc 3", tagline: "Tag 3" },
                ]),
            });

            GameMedia.find = jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue([{ game_id: "g1", type: "cover", url: "cover1.png" }]),
            });

            Tag.find = jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue([{ game_id: "g1", name: "vision" }]),
            });

            const response = res();
            const handler = getHandler("/hero");

            await handler(req(), response);

            const jsonArg = response.json.mock.calls[0][0];
            expect(jsonArg.length).toBe(3);
            expect(jsonArg[0]).toHaveProperty("id");
            expect(jsonArg[0]).toHaveProperty("image");
            expect(jsonArg[0]).toHaveProperty("title");
            expect(jsonArg[0]).toHaveProperty("description");
            expect(jsonArg[0]).toHaveProperty("tags");
        });
    });
});
