import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../../data/TokenUtility";
import { Authentication } from "../../data/Authentication";
import { settings } from "../../AppSettings";
import "./Dashboard.css";

type UserData = {
    username: string;
    email: string;
    date_of_birth?: string;
    setting1: boolean;
    setting2: boolean;
    profilePicture?: string;
    profilePictureFile?: File;
};

type GameOption = {
    _id: string;
    title: string;
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
    const [allGames, setAllGames] = useState<GameOption[]>([]);
    const [favoriteGames, setFavoriteGames] = useState<string[]>([]);
    const [gameSearch, setGameSearch] = useState<string>("");

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
            const data: UserData = await res.json();
            setUserData(data);
            setFormData({
                username: data.username,
                email: data.email,
                date_of_birth: data.date_of_birth ? new Date(data.date_of_birth).toISOString().split("T")[0] : "",
                setting1: data.setting1,
                setting2: data.setting2,
                profilePicture: data.profilePicture || "",
                profilePictureFile: undefined,
            });
            setPreview(data.profilePicture ? `${settings.apiBaseUrl}${data.profilePicture}` : null);

            const favRes = await fetch(`${settings.apiBaseUrl}/user/${userId}/favorites`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (favRes.ok) {
                const favData: { favorite_games: GameOption[] } = await favRes.json();
                setFavoriteGames(favData.favorite_games?.map(g => g._id) || []);
            }

            const gamesRes = await fetch(`${settings.apiBaseUrl}/api/games`);
            if (gamesRes.ok) {
                const gamesData: GameOption[] = await gamesRes.json();
                setAllGames(gamesData);
            }
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "file" && files && files[0]) {
            setFormData(prev => ({ ...prev, profilePictureFile: files[0] }));
            setPreview(URL.createObjectURL(files[0]));
        } else {
            setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        }
    };

    const handleFavoriteToggle = (gameId: string) => {
        setFavoriteGames(prev => {
            if (prev.includes(gameId)) return prev.filter(id => id !== gameId);
            else if (prev.length < 4) return [...prev, gameId];
            else {
                alert("You can select up to 4 favorite games.");
                return prev;
            }
        });
    };

    const handleSubmit = async () => {
        try {
            const token = await Authentication.refreshToken();
            if (!token || !userData) return alert("Invalid session.");
            const userId = getUserIdFromToken(token);
            if (!userId) return alert("Invalid session.");

            if (formData.profilePictureFile) {
                const uploadData = new FormData();
                uploadData.append("profilePicture", formData.profilePictureFile);
                const uploadRes = await fetch(`${settings.apiBaseUrl}/user/${userId}/profile-picture`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: uploadData,
                });
                if (!uploadRes.ok) {
                    const err = await uploadRes.json();
                    return alert(err?.error || "Failed to upload profile picture.");
                }
            }

            const res = await fetch(`${settings.apiBaseUrl}/user/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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

            const favRes = await fetch(`${settings.apiBaseUrl}/user/${userId}/favorites`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ favorite_games: favoriteGames }),
            });
            if (!favRes.ok) {
                const err = await favRes.json();
                return alert(err?.error || "Failed to update favorite games.");
            }

            alert("Profile updated successfully!");
            setEditing(false);
            void fetchUserData();
        } catch (err) {
            console.error(err);
            alert("Error updating profile.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!userData) return <p>User not found.</p>;

    const filteredGames = allGames.filter(game =>
        game.title.toLowerCase().includes(gameSearch.toLowerCase())
    );

    return (
        <div className="container dashboard-container">
            <h2 className="mb-4">User Dashboard</h2>

            {!editing ? (
                <div>
                    {preview && <img src={preview} alt="Profile" className="profile-img mb-3" />}
                    <p><strong>Username:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Date of Birth:</strong> {userData.date_of_birth || "Not set"}</p>
                    <p><strong>Setting 1:</strong> {userData.setting1 ? "Enabled" : "Disabled"}</p>
                    <p><strong>Setting 2:</strong> {userData.setting2 ? "Enabled" : "Disabled"}</p>

                    {favoriteGames.length > 0 && (
                        <div>
                            <strong>Favorite Games:</strong>
                            <div className="favorite-games mt-2">
                                {allGames
                                    .filter(g => favoriteGames.includes(g._id))
                                    .map(g => (
                                        <div key={g._id} className="badge bg-primary p-2 rounded">
                                            {g.title}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-3">
                        <button className="btn btn-primary me-2" onClick={() => setEditing(true)}>Edit Profile</button>
                        <button className="btn btn-outline-success" onClick={() => navigate("/my-reviews")}>Edit Reviews</button>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="mb-3">
                        <label htmlFor="profilePicture" className="form-label">Profile Picture</label>
                        <input type="file" id="profilePicture" className="form-control" onChange={handleInputChange} />
                        {preview && <img src={preview} alt="Preview" className="profile-preview-img mt-2" />}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input type="text" name="username" value={formData.username} className="form-control" onChange={handleInputChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" value={formData.email} className="form-control" onChange={handleInputChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Date of Birth</label>
                        <input type="date" name="date_of_birth" value={formData.date_of_birth} className="form-control" onChange={handleInputChange} />
                    </div>

                    <div className="form-check mb-3">
                        <input type="checkbox" name="setting1" className="form-check-input" checked={formData.setting1} onChange={handleInputChange} />
                        <label className="form-check-label">Enable Setting 1</label>
                    </div>

                    <div className="form-check mb-3">
                        <input type="checkbox" name="setting2" className="form-check-input" checked={formData.setting2} onChange={handleInputChange} />
                        <label className="form-check-label">Enable Setting 2</label>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Favorite Games (up to 4)</label>
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Search games..."
                            value={gameSearch}
                            onChange={(e) => setGameSearch(e.target.value)}
                        />
                        <div className="d-flex flex-wrap gap-2">
                            {filteredGames.map(game => (
                                <button
                                    key={game._id}
                                    type="button"
                                    className={`btn favorite-game-btn ${favoriteGames.includes(game._id) ? "btn-success" : "btn-outline-secondary"}`}
                                    onClick={() => handleFavoriteToggle(game._id)}
                                >
                                    {game.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-3">
                        <button className="btn btn-success me-2" onClick={handleSubmit}>Save Changes</button>
                        <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
