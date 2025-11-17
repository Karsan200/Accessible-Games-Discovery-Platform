import { useAuth } from "./AuthContext.tsx";
import { Authentication } from "./Authentication.ts";
import { HTTPError } from "../models/HttpError.ts";

export async function ApiDataHelper(url: string, init: any, hasRefreshed = false) {
    // Get access token from local storage
    const { accessToken, setAccessToken } = useAuth();

    // Add Authorization header if access token is available
    init.headers['Authorization'] = `Bearer ${accessToken}`;

    // Make the API request
    const data = await fetch(url, init);

    // If unauthorized, try to refresh the token once
    if (data.status === 401 && !hasRefreshed) {
        const newToken = await Authentication.refreshToken();
        if (newToken !== null) {
            setAccessToken(newToken);
            return ApiDataHelper(url, init, true); // Retry with new token
        }
        else {
            throw new HTTPError(401, "Unauthorized: Invalid or expired refresh token");
        }
    }
    else if (data.status === 401 && hasRefreshed) {
        throw new HTTPError(401, "Unauthorized: Invalid or expired refresh token");
    }

    return data;
}