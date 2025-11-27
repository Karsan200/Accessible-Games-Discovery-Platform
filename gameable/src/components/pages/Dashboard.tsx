import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../../data/TokenUtility";
import { Authentication } from "../../data/Authentication";
import { settings } from "../../AppSettings";

type UserData = {
    username: string;
    email: string;
    date_of_birth?: string;
    setting1: boolean;
    setting2: boolean;
    profilePicture?: string;
    profilePictureFile?: File;
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
    const [errors, setErrors] = useState<{ email?: string; username?: string }>({});

    const navigate = useNavigate();

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
            setPreview(URL.createObjectURL(files[0]));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async () => {
        setErrors({});
        if (!validateEmail(formData.email)) {
            setErrors({ email: "Please enter a valid email address." });
            return;
        }

        try {
            const token = await Authentication.refreshToken();
            if (!token) return alert("You must be logged in.");
            const userId = getUserIdFromToken(token);
            if (!userId) return alert("Invalid session.");

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
                if (err?.error === "Username already taken.") {
                    setErrors({ username: err.error });
                    return;
                } else if (err?.error === "Email already in use.") {
                    setErrors({ email: err.error });
                    return;
                }
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
            <h2 className="mb-4">User Dashboard</h2>

            {!editing ? (
                <div>
                    {preview && (
                        <img
                            src={`${preview}?t=${Date.now()}`}
                            alt="Profile picture"
                            className="rounded-circle mb-3 img-fluid"
                            width={150}
                            height={150}
                        />
                    )}

                    <div className="table-responsive">
                        <table className="table table-bordered align-middle">
                            <tbody>
                            <tr>
                                <th scope="row">Username</th>
                                <td>{userData.username}</td>
                            </tr>
                            <tr>
                                <th scope="row">Email</th>
                                <td>{userData.email}</td>
                            </tr>
                            <tr>
                                <th scope="row">Date of Birth</th>
                                <td>
                                    {userData.date_of_birth
                                        ? new Date(userData.date_of_birth).toLocaleDateString()
                                        : "Not set"}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">Setting 1</th>
                                <td>{userData.setting1 ? "Enabled" : "Disabled"}</td>
                            </tr>
                            <tr>
                                <th scope="row">Setting 2</th>
                                <td>{userData.setting2 ? "Enabled" : "Disabled"}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Buttons - View Mode */}
                    <div className="d-flex flex-column align-items-center gap-2 mt-3">
                        <button
                            className="btn btn-outline-success"
                            style={{ width: "50%" }}
                            onClick={() => navigate("/my-reviews")}
                        >
                            Edit Reviews
                        </button>
                        <button
                            className="btn btn-primary"
                            style={{ width: "50%" }}
                            onClick={() => setEditing(true)}
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="table-responsive">
                        <table className="table table-bordered align-middle">
                            <tbody>
                            <tr>
                                <th scope="row">
                                    <label htmlFor="profilePicture" className="form-label m-0">
                                        Profile Picture
                                    </label>
                                </th>
                                <td>
                                    <input
                                        type="file"
                                        id="profilePicture"
                                        accept="image/*"
                                        className="form-control"
                                        onChange={handleChange}
                                        aria-label="Upload new profile picture"
                                    />
                                    {preview && (
                                        <img
                                            src={preview}
                                            alt="Profile preview"
                                            className="rounded-circle mt-2 img-fluid"
                                            width={100}
                                            height={100}
                                        />
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <th scope="row">
                                    <label htmlFor="username" className="form-label m-0">
                                        Username
                                    </label>
                                </th>
                                <td>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        className={`form-control ${errors.username ? "is-invalid" : ""}`}
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                    {errors.username && (
                                        <div className="invalid-feedback">{errors.username}</div>
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <th scope="row">
                                    <label htmlFor="email" className="form-label m-0">
                                        Email
                                    </label>
                                </th>
                                <td>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">{errors.email}</div>
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <th scope="row">
                                    <label htmlFor="date_of_birth" className="form-label m-0">
                                        Date of Birth
                                    </label>
                                </th>
                                <td>
                                    <input
                                        type="date"
                                        id="date_of_birth"
                                        name="date_of_birth"
                                        className="form-control"
                                        value={formData.date_of_birth}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <th scope="row">
                                    <label htmlFor="setting1" className="m-0">
                                        Setting 1
                                    </label>
                                </th>
                                <td>
                                    <div className="form-check">
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
                                </td>
                            </tr>

                            <tr>
                                <th scope="row">
                                    <label htmlFor="setting2" className="m-0">
                                        Setting 2
                                    </label>
                                </th>
                                <td>
                                    <div className="form-check">
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
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Buttons - Edit Mode */}
                    <div className="d-flex flex-column align-items-center gap-2 mt-3">
                        <button
                            className="btn btn-outline-success"
                            style={{ width: "50%" }}
                            onClick={() => navigate("/my-reviews")}
                        >
                            Edit Reviews
                        </button>
                        <button className="btn btn-success" style={{ width: "50%" }} onClick={handleSubmit}>
                            Save Changes
                        </button>
                        <button
                            className="btn btn-secondary"
                            style={{ width: "50%" }}
                            onClick={() => setEditing(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
