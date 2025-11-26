import './navbar.css'
import {NavLink, useNavigate} from 'react-router-dom';
import {SearchHandler} from "../../data/SearchHandler.ts";
import {useRef} from "react";

export default function NavbarLoggedOut() {
    const navigate = useNavigate();
    const searchRef = useRef<HTMLInputElement | null>(null);
    const handleSearch = SearchHandler(searchRef, navigate);
    return (
        <>
            <nav className="nav">
                <div className="nav-header">
                    <NavLink to="/" className="title">Game Able</NavLink>
                    <button className="auth-section auth-button" aria-label="Login"
                            onClick={() => window.location.href = "/login"}>
                    <span className="auth-text">Login</span>
                    <span className="mask-icon-login"/>
                </button>
            </div>
            <form className="search-container " onSubmit={handleSearch}>
                <input
                    ref={searchRef}
                    type="text"
                    name="search"
                    placeholder="Search games..."
                    className="search-bar"/>
                <button type="submit" className="search-btn mask-icon-search" aria-label="Search"/>
            </form>
            <ul>
                <li><NavLink to="/" className="home">Home</NavLink></li>
                <li><NavLink to="/errorPages/userNotLoggedIn" className="wishlist">Wishlist</NavLink></li>
                <li><NavLink to="/errorPages/userNotLoggedIn" className="profile">Profile</NavLink></li>
                <li><NavLink to="/settings" className="settings">Settings</NavLink></li>
            </ul>
        </nav>
    </>
    )
}