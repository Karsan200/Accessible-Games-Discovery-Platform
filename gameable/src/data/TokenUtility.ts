import { jwtDecode } from "jwt-decode";

export function getUserIdFromToken(token: string | null): string | null {
    if (!token) return null;
    try {
        const decoded: any = jwtDecode(token);
        console.log(decoded)
        return decoded.userId || null;
    } catch (err) {
        console.error("Failed to decode token:", err);
        return null;
    }
}