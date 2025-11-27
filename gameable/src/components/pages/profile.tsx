import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface PublicUser {
    username: string;
    profilePicture: string | null;
}

export default function Profile() {
    const { username } = useParams();
    const [userData, setUserData] = useState<PublicUser | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!username) return;

        fetch(`http://localhost:5000/user/username/${username}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) setError(data.error);
                else setUserData(data);
            })
            .catch(() => setError("Failed to load profile"));
    }, [username]);

    if (error) return <h2>{error}</h2>;
    if (!userData) return <h2>Loading...</h2>;

    return (
        <div className="profile-page">
            <h1>{userData.username}</h1>

            {userData.profilePicture ? (
                <img
                    src={`http://localhost:5000${userData.profilePicture}`}
                    alt={`${userData.username}'s profile`}
                    style={{ width: "150px", height: "150px", borderRadius: "50%" }}
                />
            ) : (
                <p>No profile picture.</p>
            )}
        </div>
    );
}
