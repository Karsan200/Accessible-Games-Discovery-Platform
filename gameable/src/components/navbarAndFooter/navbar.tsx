import './navbar.css'
import {NavLink, useNavigate} from 'react-router-dom';
import {useAuth} from "../../data/AuthContext.tsx";
import {settings} from "../../AppSettings.ts";
import {useEffect, useState} from "react";
import { getUserIdFromToken } from "../../data/TokenUtility";
import { ApiDataHelper } from "../../data/ApiDataHelper";

export default function Navbar() {
    const { accessToken, setAccessToken } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>(null);

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

        async function fetchUsername() {
            try {
                const res = await ApiDataHelper(`/user/${userId}`, { method: "GET", headers: {} }, { accessToken, setAccessToken });
                if (!res.ok) return;
                const data = await res.json();
                setUsername(data.username);
            } catch (err) {
                console.error("Failed to fetch username:", err);
            }
        }

        void fetchUsername();
    }, [accessToken, setAccessToken]);

    return (
        <nav className="nav">
            <div className="nav-header">
                <NavLink to="/" className="title">Game Able</NavLink>
                <button className="auth-section auth-button" aria-label="Logout" onClick={handleLogout}>
                    <span className="user-greeting">Hello{username ? `, ${username}` : ', User'}</span>
                    <span className="mask-icon-logout"/>
                </button>
            </div>
            <form className="search-container">
                <input
                    type="text"
                    name="search"
                    placeholder="Search games..."
                    className="search-bar"
                />
                <button type="submit" className="search-btn mask-icon-search" aria-label="Search"/>
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
                <li><NavLink to="/dashboard" className="settings">Dashboard</NavLink></li>
            </ul>
        </nav>
    )
}
