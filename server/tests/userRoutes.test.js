import { jest } from "@jest/globals";
import userRouter from "../routes/userRoutes.js";
import { User } from "../models/dbSetup.js";

// Mock request and response
const req = (body = {}, currentUser = { _id: "u1" }) => ({
    body,
    currentUser,
});
const res = () => {
    const resObj = {};
    resObj.status = jest.fn().mockReturnValue(resObj);
    resObj.json = jest.fn().mockReturnValue(resObj);
    return resObj;
};

describe("User Routes - fontType and fontSize", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("PATCH /me/font should update fontType", async () => {
        const mockUpdatedUser = { _id: "u1", fontType: true };

        // Mock findByIdAndUpdate().lean() chain
        User.findByIdAndUpdate = jest.fn().mockImplementation(() => ({
            lean: jest.fn().mockResolvedValue(mockUpdatedUser),
        }));

        const handler = userRouter.stack.find(
            (layer) => layer.route && layer.route.path === "/me/font" && layer.route.methods.patch
        ).route.stack[0].handle;

        const response = res();

        await handler(req({ fontType: true }), response);

        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
            "u1",
            { fontType: true },
            { new: true }
        );
        expect(response.json).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it("PATCH /me/fontSize should update fontSize", async () => {
        const mockUpdatedUser = { _id: "u1", fontSize: true };

        User.findByIdAndUpdate = jest.fn().mockImplementation(() => ({
            lean: jest.fn().mockResolvedValue(mockUpdatedUser),
        }));

        const handler = userRouter.stack.find(
            (layer) => layer.route && layer.route.path === "/me/fontSize" && layer.route.methods.patch
        ).route.stack[0].handle;

        const response = res();

        await handler(req({ fontSize: true }), response);

        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
            "u1",
            { fontSize: true },
            { new: true }
        );
        expect(response.json).toHaveBeenCalledWith(mockUpdatedUser);
    });
});
