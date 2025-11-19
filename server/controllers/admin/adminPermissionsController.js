import {permissionsService} from "../../logic/permissionsService";
import {httpError} from "../../errors/httpError";

export class adminPermissionsController {
    constructor(props) {
        this.permissionsService = new permissionsService();
    }

    async setUserPermissions(req, res) {
        try {
            // Check the current user has admin permissions
            permissionsService.verify(req.currentUser, ['isAdmin'])

            // Update the user's permissions
            const body = req.body;

            await this.permissionsService.setUserPermissions(body.userId, body.permissions)
        }
        catch (error) {
            // Check if the error is known
            if (error instanceof httpError) {
                return res.status(error.statusCode).json({ error: error.message });
            }

            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}