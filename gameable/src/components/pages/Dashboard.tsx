// Dashboard.tsx
import { useEffect, useState } from "react";
import { getUserIdFromToken } from "../../data/TokenUtility";
import { Authentication } from "../../data/Authentication";
import { settings } from "../../AppSettings";

type UserData = {
    username: string;
    email: string;
    date_of_birth?: string;
    setting1: boolean;
    setting2: boolean;
};

export default function Dashboard() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState<UserData>({
        username: "",
        email: "",
        date_of_birth: "",
        setting1: false,
        setting2: false,
    });

    // Fetch current user data
    const fetchUserData = async () => {
        setLoading(true);
        try {
            const token = await Authentication.refreshToken();
            if (!token) {
                alert("You must be logged in to access this page.");
                return;
            }

            const userId = getUserIdFromToken(token);
            if (!userId) return alert("Invalid session.");

            const res = await fetch(`${settings.apiBaseUrl}/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                alert("Failed to load user data.");
                return;
            }

            const data = await res.json();
            setUserData(data);
            setFormData({
                username: data.username,
                email: data.email,
                date_of_birth: data.date_of_birth
                    ? new Date(data.date_of_birth).toISOString().split("T")[0]
                    : "",
                setting1: data.setting1,
                setting2: data.setting2,
            });
        } catch (err) {
            console.error(err);
            alert("Error fetching user data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchUserData();
    }, []);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Submit updated user data
    const handleSubmit = async () => {
        try {
            const token = await Authentication.refreshToken();
            if (!token) return alert("You must be logged in.");
            const userId = getUserIdFromToken(token);
            if (!userId) return alert("Invalid session.");

            const res = await fetch(`${settings.apiBaseUrl}/user/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const err = await res.json();
                return alert(err?.error || "Failed to update user data.");
            }

            alert("Profile updated successfully!");
            setEditing(false);
            void fetchUserData();
        } catch (err) {
            console.error(err);
            alert("Error updating user data.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!userData) return <p>User not found.</p>;

    return (
        <div className="container my-4">
            <h2>User Dashboard</h2>

            {!editing ? (
                <div>
                    <p><strong>Username:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p>
                        <strong>Date of Birth:</strong>{" "}
                        {userData.date_of_birth
                            ? new Date(userData.date_of_birth).toLocaleDateString()
                            : "Not set"}
                    </p>
                    <p><strong>Setting 1:</strong> {userData.setting1 ? "Enabled" : "Disabled"}</p>
                    <p><strong>Setting 2:</strong> {userData.setting2 ? "Enabled" : "Disabled"}</p>

                    <button
                        className="btn btn-primary"
                        onClick={() => setEditing(true)}
                    >
                        Edit Profile
                    </button>
                </div>
            ) : (
                <div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="form-control"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="date_of_birth" className="form-label">Date of Birth</label>
                        <input
                            type="date"
                            id="date_of_birth"
                            name="date_of_birth"
                            className="form-control"
                            value={formData.date_of_birth}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-check mb-2">
                        <input
                            type="checkbox"
                            id="setting1"
                            name="setting1"
                            className="form-check-input"
                            checked={formData.setting1}
                            onChange={handleChange}
                        />
                        <label htmlFor="setting1" className="form-check-label">
                            Enable Setting 1
                        </label>
                    </div>

                    <div className="form-check mb-3">
                        <input
                            type="checkbox"
                            id="setting2"
                            name="setting2"
                            className="form-check-input"
                            checked={formData.setting2}
                            onChange={handleChange}
                        />
                        <label htmlFor="setting2" className="form-check-label">
                            Enable Setting 2
                        </label>
                    </div>

                    <button className="btn btn-success me-2" onClick={handleSubmit}>
                        Save Changes
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditing(false)}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}
