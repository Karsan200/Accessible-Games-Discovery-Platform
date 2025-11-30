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
        profilePicture: "",
        profilePictureFile: undefined,
    });
    const [preview, setPreview] = useState<string | null>(null);
    const [allGames, setAllGames] = useState<GameOption[]>([]);
    const [favoriteGames, setFavoriteGames] = useState<string[]>([]);
    const [gameSearch, setGameSearch] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    const fetchUserData = async () => {
        setLoading(true);
        setErrorMessage(null);
        try {
            const token = await Authentication.refreshToken();
            if (!token) {
                setErrorMessage("You must be logged in.");
                return;
            }

            const userId = getUserIdFromToken(token);
            if (!userId) {
                setErrorMessage("Invalid session.");
                return;
            }

            const res = await fetch(`${settings.apiBaseUrl}/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                setErrorMessage("Failed to load user data.");
                return;
            }
            const data: UserData = await res.json();

            setUserData(data);
            setFormData({
                username: data.username,
                email: data.email,
                date_of_birth: data.date_of_birth
                    ? new Date(data.date_of_birth).toISOString().split("T")[0]
                    : "",
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
            setErrorMessage("Error fetching user data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchUserData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, files } = e.target;
        if (type === "file" && files && files[0]) {
            setFormData(prev => ({ ...prev, profilePictureFile: files[0] }));
            setPreview(URL.createObjectURL(files[0]));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFavoriteToggle = (gameId: string) => {
        if (favoriteGames.includes(gameId)) {
            setFavoriteGames(prev => prev.filter(id => id !== gameId));
        } else if (favoriteGames.length < 7) {
            setFavoriteGames(prev => [...prev, gameId]);
        } else {
            setErrorMessage("You can select up to 7 favorite games.");
        }
    };

    const handleSubmit = async () => {
        setErrorMessage(null);
        try {
            const token = await Authentication.refreshToken();
            if (!token || !userData) {
                setErrorMessage("Invalid session.");
                return;
            }
            const userId = getUserIdFromToken(token);
            if (!userId) {
                setErrorMessage("Invalid session.");
                return;
            }

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
                    setErrorMessage(err?.error || "Failed to upload profile picture.");
                    return;
                }
            }

            const res = await fetch(`${settings.apiBaseUrl}/user/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    date_of_birth: formData.date_of_birth,
                }),
            });
            if (!res.ok) {
                const err = await res.json();
                setErrorMessage(err?.error || "Failed to update user data.");
                return;
            }

            const favRes = await fetch(`${settings.apiBaseUrl}/user/${userId}/favorites`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ favorite_games: favoriteGames }),
            });
            if (!favRes.ok) {
                const err = await favRes.json();
                setErrorMessage(err?.error || "Failed to update favorite games.");
                return;
            }

            setEditing(false);
            void fetchUserData();
        } catch (err) {
            console.error(err);
            setErrorMessage("Error updating profile.");
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
                <div className="card shadow-sm p-4">
                    <div className="row align-items-center">
                        <div className="col-md-3 text-center">
                            {preview ? (
                                <img src={preview} alt="Profile" className="profile-img mb-3" />
                            ) : (
                                <div className="profile-placeholder mb-3">
                                    {userData.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="col-md-9">
                            <h4 className="mb-3">{userData.username}</h4>
                            <p><strong>Email:</strong> {userData.email}</p>
                            <p>
                                <strong>Date of Birth:</strong>{" "}
                                {userData.date_of_birth
                                    ? new Date(userData.date_of_birth).toLocaleDateString()
                                    : "Not set"}
                            </p>

                            {favoriteGames.length > 0 && (
                                <div className="mt-3">
                                    <strong>Favorite Games:</strong>
                                    <div className="favorite-games mt-2">
                                        {allGames
                                            .filter(g => favoriteGames.includes(g._id))
                                            .map(g => (
                                                <span key={g._id} className="badge bg-primary me-1 mb-1">
                                        {g.title}
                                    </span>
                                            ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-4">
                                <button className="btn btn-primary me-2" onClick={() => setEditing(true)}>
                                    Edit Profile
                                </button>
                                <button className="btn btn-outline-success" onClick={() => navigate("/my-reviews")}>
                                    Edit Reviews
                                </button>
                            </div>
                        </div>
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

                    <div className="mb-3">
                        <label className="form-label">Favorite Games (up to 7)</label>
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

                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                    <div className="mt-3">
                        <button className="btn btn-success me-2" onClick={handleSubmit}>Save Changes</button>
                        <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
