import './navbar.css'
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from "../../data/AuthContext.tsx";
import { settings } from "../../AppSettings.ts";
import { useEffect, useState } from "react";
import { getUserIdFromToken } from "../../data/TokenUtility";
import { ApiDataHelper } from "../../data/ApiDataHelper";
import {SearchHandler} from "../../data/SearchHandler.ts";
import {useRef} from "react";

export default function Navbar() {
    const { accessToken, setAccessToken } = useAuth();
    const navigate = useNavigate();
    const searchRef = useRef<HTMLInputElement | null>(null);
    const handleSearch = SearchHandler(searchRef, navigate);
    const [username, setUsername] = useState<string | null>(null);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    async function handleLogout() {
        try {
            await fetch(settings.apiBaseUrl + '/auth/logout', {
                method: 'POST',
                credentials: 'include' as RequestCredentials,
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setAccessToken(null);
            navigate('/');
        }
    }

    useEffect(() => {
        if (!accessToken) return;

        const userId = getUserIdFromToken(accessToken);
        if (!userId) return;

        async function fetchUserData() {
            try {
                const res = await ApiDataHelper(`/user/${userId}`, { method: "GET", headers: {} }, { accessToken, setAccessToken });
                if (!res.ok) return;
                const data = await res.json();
                setUsername(data.username);
                setProfilePicture(data.profilePicture || null);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            }
        }

        void fetchUserData();
    }, [accessToken, setAccessToken]);

    return (
        <nav className="nav">
            <div className="nav-header">
                <NavLink to="/" className="title">Game Able</NavLink>

                <div className="auth-section">
                    {username && profilePicture && (
                        <button
                            className="profile-pic-btn"
                            onClick={() => navigate('/dashboard')}
                            aria-label="Go to dashboard"
                        >
                            <img src={settings.apiBaseUrl + profilePicture} alt="Profile" />
                        </button>
                    )}

                    <button className="auth-button" aria-label="Logout" onClick={handleLogout}>
                        <span className="user-greeting">Hello{username ? `, ${username}` : ', User'}</span>
                        <span className="mask-icon-logout"/>
                    </button>
                </div>
            </div>
            <form className="search-container " onSubmit={handleSearch}>
                <input
                    ref={searchRef}
                    type="text"
                    name="search"
                    placeholder="Search games..."
                    className="search-bar"
                />
                <button type="submit" className="search-btn mask-icon-search" aria-label="Search">
                    <span style={{ display: "none" }}>Search</span>
                </button>
            </form>

            <ul>
                <li><NavLink to="/" className="home">Home</NavLink></li>
                <li><NavLink to="/wishlist" className="wishlist">Wishlist</NavLink></li>
                <li>
                    <NavLink
                        to={username ? `/profile/${username}` : "/profile"}
                        className="profile"
                    >
                        Profile
                    </NavLink>
                </li>
                <li><NavLink to="/settings" className="settings">Settings</NavLink></li>
            </ul>
        </nav>
    )
}
