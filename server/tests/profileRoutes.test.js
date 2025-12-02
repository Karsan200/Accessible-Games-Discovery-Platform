import { jest } from "@jest/globals";
import profileRouter, { updateProfilePicture } from "../routes/profileRoutes.js";
import { User, Game, GameMedia } from "../models/dbSetup.js";

// Mock request and response
const req = (params = {}, body = {}, file = null) => ({
    params,
    body,
    file,
});
const res = () => {
    const resObj = {};
    resObj.status = jest.fn().mockReturnValue(resObj);
    resObj.json = jest.fn().mockReturnValue(resObj);
    return resObj;
};

// Helper to get route handler
const getHandler = (path, method = "get") => {
    const layer = profileRouter.stack.find(
        (layer) => layer.route && layer.route.path === path && layer.route.methods[method]
    );
    return layer.route.stack[0].handle;
};

describe("Profile Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // ----------------- GET /username/:username -----------------
    describe("GET /username/:username", () => {
        it("returns public user info if user exists", async () => {
            User.findOne = jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue({
                    _id: "u1",
                    username: "user1",
                    profilePicture: "pic.png",
                }),
            });

            const response = res();
            const handler = getHandler("/username/:username");

            await handler(req({ username: "user1" }), response);

            expect(response.json).toHaveBeenCalledWith({
                _id: "u1",
                username: "user1",
                profilePicture: "pic.png",
            });
        });

        it("returns 404 if user not found", async () => {
            User.findOne = jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

            const response = res();
            const handler = getHandler("/username/:username");

            await handler(req({ username: "notfound" }), response);

            expect(response.status).toHaveBeenCalledWith(404);
            expect(response.json).toHaveBeenCalledWith({ error: "User not found" });
        });
    });

    // ----------------- GET /:id -----------------
    describe("GET /:id", () => {
        it("returns full user info if exists", async () => {
            const userData = { _id: "u1", username: "user1", email: "a@b.com" };
            User.findById = jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(userData) });

            const response = res();
            const handler = getHandler("/:id");

            await handler(req({ id: "u1" }), response);

            expect(response.json).toHaveBeenCalledWith(userData);
        });

        it("returns 404 if user not found", async () => {
            User.findById = jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

            const response = res();
            const handler = getHandler("/:id");

            await handler(req({ id: "u2" }), response);

            expect(response.status).toHaveBeenCalledWith(404);
            expect(response.json).toHaveBeenCalledWith({ error: "User not found" });
        });
    });

    // ----------------- PUT /:id -----------------
    describe("PUT /:id", () => {
        it("updates user if username/email available", async () => {
            User.findOne = jest.fn().mockResolvedValue(null);
            const updatedUser = { _id: "u1", username: "newname" };
            User.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedUser);

            const response = res();
            const handler = getHandler("/:id", "put");

            await handler(req({ id: "u1" }, { username: "newname", email: "new@mail.com" }), response);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
                "u1",
                {
                    username: "newname",
                    email: "new@mail.com",
                    date_of_birth: undefined,
                    setting1: undefined,
                    setting2: undefined,
                },
                { new: true }
            );
            expect(response.json).toHaveBeenCalledWith(updatedUser);
        });

        it("returns 400 if username taken", async () => {
            User.findOne = jest.fn().mockResolvedValue({ _id: "u2" });

            const response = res();
            const handler = getHandler("/:id", "put");

            await handler(req({ id: "u1" }, { username: "taken" }), response);

            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({ error: "Username already taken." });
        });

        it("returns 400 if email taken", async () => {
            User.findOne = jest.fn().mockResolvedValue({ _id: "u2" });

            const response = res();
            const handler = getHandler("/:id", "put");

            await handler(req({ id: "u1" }, { email: "taken@mail.com" }), response);

            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({ error: "Email already in use." });
        });
    });

    // ----------------- GET /:id/favorites -----------------
    describe("GET /:id/favorites", () => {
        it("returns favorite games with images", async () => {
            User.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue({
                    _id: "u1",
                    favorite_games: [{ _id: "g1", title: "Game 1" }],
                }),
            });

            GameMedia.findOne = jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue({ url: "img.png" }),
            });

            const response = res();
            const handler = getHandler("/:id/favorites");

            await handler(req({ id: "u1" }), response);

            expect(response.json).toHaveBeenCalledWith({
                favorite_games: [{ _id: "g1", title: "Game 1", image: "img.png" }],
            });
        });
    });

    // ----------------- PUT /:id/favorites -----------------
    describe("PUT /:id/favorites", () => {
        it("updates favorite games if valid", async () => {
            Game.find = jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    lean: jest.fn().mockResolvedValue([{ _id: "g1" }, { _id: "g2" }]),
                }),
            });

            User.findByIdAndUpdate = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue({
                    favorite_games: [{ _id: "g1" }, { _id: "g2" }],
                }),
            });

            const response = res();
            const handler = getHandler("/:id/favorites", "put");

            await handler(req({ id: "u1" }, { favorite_games: ["g1", "g2"] }), response);

            expect(response.json).toHaveBeenCalledWith({
                favorite_games: [{ _id: "g1" }, { _id: "g2" }],
            });
        });

        it("returns 400 if more than 7 games", async () => {
            const response = res();
            const handler = getHandler("/:id/favorites", "put");

            await handler(req({ id: "u1" }, { favorite_games: Array(8).fill("g") }), response);

            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({ error: "You can select up to 7 favorite games." });
        });

        it("returns 400 if some games invalid", async () => {
            Game.find = jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    lean: jest.fn().mockResolvedValue([{ _id: "g1" }]),
                }),
            });

            const response = res();
            const handler = getHandler("/:id/favorites", "put");

            await handler(req({ id: "u1" }, { favorite_games: ["g1", "g2"] }), response);

            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({ error: "One or more selected games are invalid." });
        });
    });

    // ----------------- POST /:id/profile-picture -----------------
    describe("POST /:id/profile-picture", () => {
        it("updates profile picture if file uploaded", async () => {
            const file = { filename: "pic.png" };
            User.findByIdAndUpdate = jest.fn().mockResolvedValue({ _id: "u1" });

            const response = res();

            // Call the function directly, bypassing multer
            await updateProfilePicture(req({ id: "u1" }, {}, file), response);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
                "u1",
                { profilePicture: "/uploads/profile_pics/pic.png" },
                { new: true }
            );

            expect(response.json).toHaveBeenCalledWith({
                message: "Profile picture updated.",
                profilePicture: "/uploads/profile_pics/pic.png",
            });
        });

        it("returns 400 if no file uploaded", async () => {
            const response = res();

            await updateProfilePicture(req({ id: "u1" }), response);

            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({ error: "No file uploaded." });
        });
    });
});
