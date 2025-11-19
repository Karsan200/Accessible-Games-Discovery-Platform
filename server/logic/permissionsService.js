import {httpError} from "../errors/httpError";
import {User} from "../models/dbSetup";

export class permissionsService {

    /**
     * Set permissions for a user
     * @param userId ID of the user
     * @param permissions object representing the permissions to set, e.g. `{ manageGames: true, moderateReviews: false }`
     * - **must include all permissions on the user schema**
     * @returns Promise<void>
     */
    async setUserPermissions(userId, permissions) {
        // Validate that all permissions are included
        const validPermissions = ['isAdmin', 'manageGames', 'manageUsers', 'moderateReviews'];
        for (const perm of validPermissions) {
            if (!(perm in permissions)) {
                // Set the missing permission to false
                permissions[perm] = false;
            }
        }

        // Find the user
        const user = await User.findOne({ _id: userId });
        if (!user) {
            throw new httpError(404, "User not found");
        }

        // Set permissions
        user.permissions = permissions;
        await user.save();
    }

    /**
     * Verify that a user has the required permissions
     * @param user document representing the user (req.currentUser)
     * @param requiredPermissions array of required permissions, e.g. `['isAdmin', 'manageGames']`
     * @throws httpError 403 if the user lacks any of the required permissions
     * @returns void
     */
    static verify(user, requiredPermissions) {
        // If the user is an admin they have all permissions
        if (user.isAdmin) {
            return
        }

        for (const permission of requiredPermissions) {
            if (user.permissions[permission] !== true) {
                throw new httpError(403, `User lacks required permission: ${permission}`);
            }
        }
    }
}