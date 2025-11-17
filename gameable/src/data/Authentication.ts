import { settings } from "../AppSettings.ts";

export class Authentication {
    /**
     * Refresh the access token using the refresh token stored in HTTP-only cookies.
     * @returns New access token if successful, otherwise null
     */
    static async refreshToken(): Promise<string | null> {
        // request new access token from backend
        const response = await fetch(settings.apiBaseUrl + '/auth/refresh', {
            method: 'GET',
            credentials: 'include'
        })

        // User is not authenticated
        if (!response.ok) {
            return null
        }

        const data = await response.json();

        return data.accessToken;
    }
}