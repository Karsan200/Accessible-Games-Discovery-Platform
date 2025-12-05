// tests/reviewRoutes.test.js
import { jest } from "@jest/globals";
import reviewRouter from "../routes/reviewRoute.js";
import { Review, Game } from "../models/dbSetup.js";

// Helpers to mock req/res
const res = () => {
    const r = {};
    r.status = jest.fn().mockReturnValue(r); // chainable
    r.json = jest.fn().mockReturnValue(r);
    return r;
};
const req = (params = {}, body = {}) => ({ params, body });

describe("Review Routes", () => {
    afterEach(() => jest.clearAllMocks());

    describe("POST /:gameId", () => {
        it("creates a new review", async () => {
            const mockGame = { _id: "g1" };
            const mockReview = { _id: "r1", user_id: "u1", game_id: "g1", rating: 5, body: "Great!" };

            Game.findById = jest.fn().mockResolvedValue(mockGame);
            Review.findOne = jest.fn().mockResolvedValue(null); // no existing review
            Review.create = jest.fn().mockResolvedValue(mockReview);

            const handler = reviewRouter.stack.find(layer => layer.route?.path === "/:gameId" && layer.route?.methods.post)
                .route.stack[0].handle;

            const response = res();
            await handler(req({ gameId: "g1" }, { user_id: "u1", rating: 5, body: "Great!" }), response);

            expect(Review.findOne).toHaveBeenCalledWith({ game_id: "g1", user_id: "u1" });
            expect(Review.create).toHaveBeenCalledWith(expect.objectContaining({ body: "Great!" }));
            expect(response.status).toHaveBeenCalledWith(201);
            expect(response.json).toHaveBeenCalledWith({ message: "Review created", review: mockReview });
        });

        it("returns 400 if duplicate review exists", async () => {
            Review.findOne = jest.fn().mockResolvedValue({ _id: "r1" });

            const handler = reviewRouter.stack.find(layer => layer.route?.path === "/:gameId" && layer.route?.methods.post)
                .route.stack[0].handle;

            const response = res();
            await handler(req({ gameId: "g1" }, { user_id: "u1", rating: 5 }), response);

            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({ error: "User has already reviewed this game" });
        });

        it("returns 404 if game does not exist", async () => {
            Review.findOne = jest.fn().mockResolvedValue(null);
            Game.findById = jest.fn().mockResolvedValue(null);

            const handler = reviewRouter.stack.find(layer => layer.route?.path === "/:gameId" && layer.route?.methods.post)
                .route.stack[0].handle;

            const response = res();
            await handler(req({ gameId: "g1" }, { user_id: "u1", rating: 5 }), response);

            expect(response.status).toHaveBeenCalledWith(404);
            expect(response.json).toHaveBeenCalledWith({ error: "Game not found" });
        });
    });

    describe("GET /user/:userId", () => {
        it("returns all reviews for a user", async () => {
            const mockReviewsRaw = [
                { _id: "r1", rating: 5, body: "Nice", createdAt: new Date(), game_id: { _id: "g1", title: "Game1" } },
            ];
            Review.find = jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(mockReviewsRaw) }) });

            const handler = reviewRouter.stack.find(layer => layer.route?.path === "/user/:userId" && layer.route?.methods.get)
                .route.stack[0].handle;

            const response = res();
            await handler(req({ userId: "u1" }), response);

            expect(response.json).toHaveBeenCalledWith({ reviews: mockReviewsRaw.map(r => ({
                    _id: r._id,
                    rating: r.rating,
                    body: r.body,
                    game: { _id: "g1", title: "Game1" },
                    createdAt: r.createdAt
                }))});
        });
    });

    describe("PUT /:reviewId", () => {
        it("updates a review if user owns it", async () => {
            const mockReview = { _id: "r1", user_id: "u1", save: jest.fn() };
            Review.findById = jest.fn().mockResolvedValue(mockReview);

            const handler = reviewRouter.stack.find(layer => layer.route?.path === "/:reviewId" && layer.route?.methods.put)
                .route.stack[0].handle;

            const response = res();
            await handler(req({ reviewId: "r1" }, { user_id: "u1", rating: 4, body: "Updated" }), response);

            expect(mockReview.save).toHaveBeenCalled();
            expect(response.json).toHaveBeenCalledWith({ message: "Review updated", review: mockReview });
        });

        it("returns 403 if user does not own review", async () => {
            const mockReview = { user_id: "u2", save: jest.fn() };
            Review.findById = jest.fn().mockResolvedValue(mockReview);

            const handler = reviewRouter.stack.find(layer => layer.route?.path === "/:reviewId" && layer.route?.methods.put)
                .route.stack[0].handle;

            const response = res();
            await handler(req({ reviewId: "r1" }, { user_id: "u1", rating: 4 }), response);

            expect(response.status).toHaveBeenCalledWith(403);
            expect(response.json).toHaveBeenCalledWith({ error: "Not authorized to update this review" });
        });
    });

    describe("DELETE /:reviewId", () => {
        it("deletes a review if user owns it", async () => {
            const mockReview = { _id: "r1", user_id: "u1" };
            Review.findById = jest.fn().mockResolvedValue(mockReview);
            Review.deleteOne = jest.fn().mockResolvedValue({});

            const handler = reviewRouter.stack.find(layer => layer.route?.path === "/:reviewId" && layer.route?.methods.delete)
                .route.stack[0].handle;

            const response = res();
            await handler(req({ reviewId: "r1" }, { user_id: "u1" }), response);

            expect(Review.deleteOne).toHaveBeenCalledWith({ _id: "r1" });
            expect(response.json).toHaveBeenCalledWith({ message: "Review deleted" });
        });

        it("returns 403 if user does not own review", async () => {
            const mockReview = { user_id: "u2" };
            Review.findById = jest.fn().mockResolvedValue(mockReview);

            const handler = reviewRouter.stack.find(layer => layer.route?.path === "/:reviewId" && layer.route?.methods.delete)
                .route.stack[0].handle;

            const response = res();
            await handler(req({ reviewId: "r1" }, { user_id: "u1" }), response);

            expect(response.status).toHaveBeenCalledWith(403);
            expect(response.json).toHaveBeenCalledWith({ error: "Not authorized to delete this review" });
        });
    });
});
