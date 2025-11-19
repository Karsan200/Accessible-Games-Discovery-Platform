import express from "express";
import {adminPermissionsController} from "../../controllers/admin/adminPermissionsController";

const router = express.Router();
const _adminPermissionsController = new adminPermissionsController()

// Update user permissions
router.put("/api/admin/permissions", async (req, res) => {
    return await _adminPermissionsController.setUserPermissions(req, res)
})

export default router;