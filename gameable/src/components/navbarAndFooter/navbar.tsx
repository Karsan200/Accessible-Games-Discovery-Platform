import './navbar.css'
import {NavLink, useNavigate} from 'react-router-dom';
import {useAuth} from "../../data/AuthContext.tsx";
import {settings} from "../../AppSettings.ts";
import {SearchHandler} from "../../data/SearchHandler.ts";
import {useRef} from "react";

export default function Navbar() {
    const { setAccessToken } = useAuth();
    const navigate = useNavigate();
    const searchRef = useRef<HTMLInputElement | null>(null);
    const handleSearch = SearchHandler(searchRef, navigate);

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

    return (
        <nav className="nav">
            <div className="nav-header">
                <NavLink to="/" className="title">Game Able</NavLink>
                <button className="auth-section auth-button logout-btn" aria-label="Logout" onClick={handleLogout}>
                    <span className="user-greeting">Hello, User</span>
                    <span className="mask-icon-logout"/>
                </button>
            </div>
            <form className="search-container " onSubmit={handleSearch}>
                <input
                    ref={searchRef}
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
                <li><NavLink to="/profile" className="profile">Profile</NavLink></li>
                <li><NavLink to="/settings" className="settings">Settings</NavLink></li>
            </ul>
        </nav>
    )
}
