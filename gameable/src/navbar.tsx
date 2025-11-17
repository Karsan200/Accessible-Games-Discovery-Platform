import './navbar.css'
import searchIcon from './assets/searchIcon.svg'
import logout from './assets/logout.svg'

export default function Navbar() {
    return (
        <nav className="nav">
            <div className="nav-header">
                <a href="/" className="title">Game Able</a>
                <button className="logout-btn mask-icon-logout" aria-label="Logout">
                    <img src={logout} alt="Logout" />
                </button>
            </div>
            <form className="search-container">
                <input
                    type="text"
                    name="search"
                    placeholder="Search games..."
                    className="search-bar"
                />
                <button type="submit" className="search-btn mask-icon-search" aria-label="Search">
                    <img src={searchIcon} alt={"Search Icon"}/>
                </button>
            </form>
            <ul>
                <li><a href="/" className="home">Home</a></li>
                <li><a href="/wishlist" className="wishlist">Wishlist</a></li>
                <li><a href="/profile" className="profile">Profile</a></li>
                <li><a href="/settings" className="settings">Settings</a></li>
            </ul>
        </nav>
    )
}
