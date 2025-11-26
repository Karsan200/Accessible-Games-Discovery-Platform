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
    profilePicture?: string; // URL
    profilePictureFile?: File; // selected file
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
        profilePicture: "",
        profilePictureFile: undefined,
    });
    const [preview, setPreview] = useState<string | null>(null);

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const token = await Authentication.refreshToken();
            if (!token) return alert("You must be logged in.");

            const userId = getUserIdFromToken(token);
            if (!userId) return alert("Invalid session.");

            const res = await fetch(`${settings.apiBaseUrl}/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) return alert("Failed to load user data.");

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
                profilePicture: data.profilePicture || "",
                profilePictureFile: undefined,
            });
            setPreview(data.profilePicture ? `${settings.apiBaseUrl}${data.profilePicture}` : null);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "file" && files && files[0]) {
            setFormData(prev => ({ ...prev, profilePictureFile: files[0] }));
            setPreview(URL.createObjectURL(files[0])); // live preview
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            const token = await Authentication.refreshToken();
            if (!token) return alert("You must be logged in.");
            const userId = getUserIdFromToken(token);
            if (!userId) return alert("Invalid session.");

            // Upload profile picture
            if (formData.profilePictureFile) {
                const uploadData = new FormData();
                uploadData.append("profilePicture", formData.profilePictureFile);

                const uploadRes = await fetch(
                    `${settings.apiBaseUrl}/user/${userId}/profile-picture`,
                    {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                        body: uploadData,
                    }
                );

                if (!uploadRes.ok) {
                    const err = await uploadRes.json();
                    return alert(err?.error || "Failed to upload profile picture.");
                }
            }

            // Update other user data
            const res = await fetch(`${settings.apiBaseUrl}/user/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    date_of_birth: formData.date_of_birth,
                    setting1: formData.setting1,
                    setting2: formData.setting2,
                }),
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
                    {preview && (
                        <img
                            src={`${preview}?t=${Date.now()}`} // cache busting
                            alt="Profile"
                            className="rounded-circle mb-3"
                            width={150}
                            height={150}
                        />
                    )}
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

                    <button className="btn btn-primary" onClick={() => setEditing(true)}>
                        Edit Profile
                    </button>
                </div>
            ) : (
                <div>
                    <div className="mb-3">
                        <label htmlFor="profilePicture" className="form-label">Profile Picture</label>
                        <input
                            type="file"
                            id="profilePicture"
                            accept="image/*"
                            className="form-control"
                            onChange={handleChange}
                        />
                        {preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                className="rounded-circle mt-2"
                                width={100}
                                height={100}
                            />
                        )}
                    </div>

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
                        <label htmlFor="setting1" className="form-check-label">Enable Setting 1</label>
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
                        <label htmlFor="setting2" className="form-check-label">Enable Setting 2</label>
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
