import { ApiDataHelper } from "./ApiDataHelper";
import type { AuthContextType } from "./AuthContext";

export async function getUsernameById(userId: string, auth: AuthContextType): Promise<string | null> {
    try {
        const response = await ApiDataHelper(`/user/${userId}`, { method: "GET", headers: {} }, auth);
        if (!response.ok) return null;
        const data = await response.json();
        return data.username ?? null;
    } catch (err) {
        console.error("Failed to fetch username:", err);
        return null;
    }
}
