import './navbar.css'
import { NavLink } from 'react-router-dom';

interface NavbarProps {
    onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
    return (
        <nav className="nav">
            <div className="nav-header">
                <NavLink to="/" className="title">Game Able</NavLink>
                <button className="auth-section auth-button" aria-label="Logout" onClick={onLogout}>
                    <span className="user-greeting">Hello, User</span>
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
                <li><NavLink to="/profile" className="profile">Profile</NavLink></li>
                <li><NavLink to="/settings" className="settings">Settings</NavLink></li>
            </ul>
        </nav>
    )
}
