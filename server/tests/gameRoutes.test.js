import { jest } from "@jest/globals";
import gameRouter from "../routes/gameRoutes.js";
import { Game, GameMedia, Review, Tag, Genre } from "../models/dbSetup.js";
import * as youtubeUtils from "../utils/youtube.js";

// Helpers to mock req/res
const res = () => {
    const r = {};
    r.status = jest.fn().mockReturnValue(r); // allow chaining: res.status().json()
    r.json = jest.fn().mockReturnValue(r);
    return r;
};
const req = (params = {}, query = {}, body = {}) => ({ params, query, body });

describe("Game Routes", () => {
    afterEach(() => jest.clearAllMocks());

    describe("GET /api/games", () => {
        it("returns a list of games", async () => {
            const mockGames = [{ _id: "1", title: "Game1", description: "Desc1", release_date: new Date(), age_rating: 12 }];
            Game.find = jest.fn().mockImplementation(() => ({ lean: jest.fn().mockResolvedValue(mockGames) }));

            const handler = gameRouter.stack.find(layer => layer.route?.path === "/" && layer.route?.methods.get)
                .route.stack[0].handle;

            const response = res();
            await handler(req(), response);

            expect(Game.find).toHaveBeenCalledWith({}, "title description release_date age_rating");
            expect(response.json).toHaveBeenCalledWith(mockGames);
        });
    });

    describe("GET /api/games/:id", () => {
        it("returns full game data with media, tags, reviews, genres", async () => {
            const mockGame = { _id: "1", genre_ids: ["g1"] };
            const mockMedia = [{ type: "trailer", url: "url1" }];
            const mockTags = [{ name: "tag1" }];
            const mockReviews = [{ _id: "r1", rating: 8, body: "Nice", user_id: { _id: "u1", username: "user1", profilePicture: "pic" }, flagged: false, createdAt: new Date() }];
            const mockGenres = [{ name: "genre1" }];

            Game.findById = jest.fn().mockImplementation(() => ({ lean: jest.fn().mockResolvedValue(mockGame) }));
            GameMedia.find = jest.fn().mockImplementation(() => ({ lean: jest.fn().mockResolvedValue(mockMedia) }));
            Tag.find = jest.fn().mockImplementation(() => ({ lean: jest.fn().mockResolvedValue(mockTags) }));
            Review.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(mockReviews) })
            });
            Genre.find = jest.fn().mockImplementation(() => ({ lean: jest.fn().mockResolvedValue(mockGenres) }));

            const handler = gameRouter.stack.find(layer => layer.route?.path === "/:id" && layer.route?.methods.get)
                .route.stack[0].handle;

            const response = res();
            await handler(req({ id: "1" }), response);

            expect(Game.findById).toHaveBeenCalledWith("1");
            expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
                _id: "1",
                media: mockMedia,
                tags: mockTags,
                reviews: expect.any(Array),
                genres: mockGenres,
                rating: 8,
                reviewCount: 1
            }));
        });

        it("returns 404 if game not found", async () => {
            Game.findById = jest.fn().mockImplementation(() => ({ lean: jest.fn().mockResolvedValue(null) }));

            const handler = gameRouter.stack.find(layer => layer.route?.path === "/:id" && layer.route?.methods.get)
                .route.stack[0].handle;

            const response = res();
            await handler(req({ id: "999" }), response);

            expect(response.status).toHaveBeenCalledWith(404);
            expect(response.json).toHaveBeenCalledWith({ error: "Game not found" });
        });
    });

    describe("GET /api/games/:id/media", () => {
        it("returns media filtered by type if given", async () => {
            const mockMedia = [{ type: "trailer", url: "url1" }];
            GameMedia.find = jest.fn().mockImplementation(() => ({ lean: jest.fn().mockResolvedValue(mockMedia) }));

            const handler = gameRouter.stack.find(layer => layer.route?.path === "/:id/media" && layer.route?.methods.get)
                .route.stack[0].handle;

            const response = res();
            await handler(req({ id: "1" }, { type: "trailer" }), response);

            expect(GameMedia.find).toHaveBeenCalledWith({ game_id: "1", type: "trailer" });
            expect(response.json).toHaveBeenCalledWith(mockMedia);
        });
    });

    describe("POST /api/games/:id/media", () => {
        it("creates media with valid type", async () => {
            Game.findById = jest.fn().mockResolvedValue({ _id: "1" });
            youtubeUtils.toEmbedUrl = jest.fn().mockReturnValue("embedUrl");
            GameMedia.create = jest.fn().mockResolvedValue({ type: "trailer", url: "embedUrl" });

            const handler = gameRouter.stack.find(layer => layer.route?.path === "/:id/media" && layer.route?.methods.post)
                .route.stack[0].handle;

            const response = res();
            await handler(req({ id: "1" }, {}, { type: "trailer", url: "youtube.com/video" }), response);

            expect(GameMedia.create).toHaveBeenCalledWith(expect.objectContaining({ url: "embedUrl" }));
            expect(response.status).toHaveBeenCalledWith(201);
            expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ type: "trailer" }));
        });

        it("returns 400 for invalid media type", async () => {
            Game.findById = jest.fn().mockResolvedValue({ _id: "1" });

            const handler = gameRouter.stack.find(layer => layer.route?.path === "/:id/media" && layer.route?.methods.post)
                .route.stack[0].handle;

            const response = res();
            await handler(req({ id: "1" }, {}, { type: "invalid", url: "url" }), response);

            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({ error: "Invalid media type" });
        });
    });
});
