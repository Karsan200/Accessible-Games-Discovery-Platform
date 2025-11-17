import { settings } from "../AppSettings.ts";

export class Authentication {
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