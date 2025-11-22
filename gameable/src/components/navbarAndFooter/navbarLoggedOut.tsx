import './navbar.css'
import { NavLink } from 'react-router-dom';

export default function NavbarLoggedOut() {
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
            <form className="search-container">
                <input
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