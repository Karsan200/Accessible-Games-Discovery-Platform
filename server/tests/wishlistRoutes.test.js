import { jest } from "@jest/globals";
import wishlistRouter from "../routes/wishlistRoutes.js";
import { Wishlist, Game, GameMedia } from "../models/dbSetup.js";

// Mock request and response
const req = (body = {}, params = {}, query = {}) => ({
    body,
    params,
    query
});
const res = () => {
    const out = {};
    out.status = jest.fn().mockReturnValue(out);
    out.json = jest.fn().mockReturnValue(out);
    return out;
};

// Helper to get routes
function getRoute(path, method) {
    return wishlistRouter.stack.find(
        (layer) => layer.route && layer.route.path === path && layer.route.methods[method]
    ).route.stack[0].handle;
}

describe("Wishlist Routes", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("POST /add - creates new wishlist item", async () => {
        const handler = getRoute("/add", "post");
        const r = res();

        Wishlist.findOne = jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(null);
        Wishlist.find = jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([])
            })
        });
        Wishlist.create = jest.fn().mockResolvedValue({
            toObject: () => ({ _id: "w1", game_id: "g1", weight: 1 })
        });

        GameMedia.find = jest.fn().mockResolvedValue([{ url: "img.png" }]);
        Game.findById = jest.fn().mockResolvedValue({ _id: "g1", title: "Test Game" });

        await handler(req({ userId: "u1", gameId: "g1" }), r);

        expect(Wishlist.create).toHaveBeenCalled();
        expect(r.json).toHaveBeenCalledWith({
            _id: "w1",
            game_id: { _id: "g1", title: "Test Game" },
            weight: 1,
            media: [{ url: "img.png" }]
        });
    });

    it("POST /add - returns error if already active", async () => {
        const handler = getRoute("/add", "post");
        const r = res();

        Wishlist.findOne = jest.fn().mockResolvedValueOnce({ _id: "exists" });

        await handler(req({ userId: "u1", gameId: "g1" }), r);

        expect(r.status).toHaveBeenCalledWith(400);
        expect(r.json).toHaveBeenCalledWith({ error: "Game already in wishlist" });
    });

    it("POST /add - restores soft deleted item", async () => {
        const handler = getRoute("/add", "post");
        const r = res();

        Wishlist.findOne
            .mockResolvedValueOnce(null)  // not active
            .mockResolvedValueOnce({ _id: "deleted", removed_at: "old", save: jest.fn() }); // soft deleted

        Wishlist.find = jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([{ weight: 5 }])
            })
        });

        await handler(req({ userId: "u1", gameId: "g1" }), r);

        expect(r.json).toHaveBeenCalledWith({
            message: "Restored",
            id: "deleted"
        });
    });

    it("DELETE /:id - soft delete", async () => {
        const handler = getRoute("/:id", "delete");
        const r = res();

        Wishlist.findByIdAndUpdate = jest.fn().mockResolvedValue({});

        await handler(req({}, { id: "w1" }, {}), r);

        expect(Wishlist.findByIdAndUpdate).toHaveBeenCalled();
        expect(r.json).toHaveBeenCalledWith({ message: "Soft delete complete" });
    });

    it("DELETE /:id?hard=true - hard delete", async () => {
        const handler = getRoute("/:id", "delete");
        const r = res();

        Wishlist.findByIdAndDelete = jest.fn().mockResolvedValue({});

        await handler(req({}, { id: "w1" }, { hard: "true" }), r);

        expect(Wishlist.findByIdAndDelete).toHaveBeenCalled();
        expect(r.json).toHaveBeenCalledWith({ message: "Hard delete complete" });
    });

    it("PATCH /:id/weight updates weight", async () => {
        const handler = getRoute("/:id/weight", "patch");
        const r = res();

        Wishlist.findByIdAndUpdate = jest.fn().mockResolvedValue({});

        await handler(req({ weight: 10 }, { id: "w1" }), r);

        expect(Wishlist.findByIdAndUpdate).toHaveBeenCalledWith("w1", { weight: 10 });
        expect(r.json).toHaveBeenCalledWith({ message: "Weight updated" });
    });

    it("PUT /restore/:id restores item", async () => {
        const handler = getRoute("/restore/:id", "put");
        const r = res();

        Wishlist.findByIdAndUpdate = jest.fn().mockResolvedValue({});

        await handler(req({}, { id: "w1" }), r);

        expect(Wishlist.findByIdAndUpdate).toHaveBeenCalledWith("w1", { removed_at: null });
        expect(r.json).toHaveBeenCalledWith({ message: "Wishlist item restored" });
    });

    it("PUT /restore-last/:userId restores last removed item", async () => {
        const handler = getRoute("/restore-last/:userId", "put");
        const r = res();

        const fakeItem = {
            _id: "w1",
            user_id: "u1",
            removed_at: new Date(),
            save: jest.fn().mockResolvedValue(true)
        };

        Wishlist.findOne = jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(fakeItem)
        });

        await handler({ params: { userId: "u1" } }, r);

        expect(fakeItem.save).toHaveBeenCalled();

        expect(r.json).toHaveBeenCalledWith({
            message: "Last removed wishlist item restored",
            item: fakeItem
        });
    });

    it("PUT /restore-last/:userId returns 500 if it fails to find", async () => {
        const handler = getRoute("/restore-last/:userId", "put");
        const r = res();

        Wishlist.findOne = jest.fn().mockResolvedValue(null);

        await handler(req({}, { userId: "u1" }), r);

        expect(r.status).toHaveBeenCalledWith(500);
        expect(r.json).toHaveBeenCalledWith({ error: "Failed to restore last item" });
    });

});
