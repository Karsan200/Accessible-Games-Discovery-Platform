import { useEffect, useState } from 'react'
import './App.css'
import {Routes, Route, useNavigate} from 'react-router-dom';
import Navbar from './navbar.tsx'
import NavbarLoggedOut from "./navbarLoggedOut.tsx";
import UserNotLoggedIn from './errorPages/userNotLoggedIn';
import Footer from "./footer.tsx";

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [games, setGames] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetch("http://localhost:5000/api/games")
            .then((res) => res.json())
            .then((data) => setGames(data))
            .catch(console.error)
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
        navigate('/');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <>
            {isLoggedIn ? (
                <Navbar onLogout={handleLogout} />
            ) : (
                <NavbarLoggedOut onLogin={handleLogin} />
            )}

            <main className="main">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <h1>Game List</h1>
                                <ul>
                                    {games.map((g: any) => (
                                        <li key={g._id}>{g.title}</li>
                                    ))}
                                </ul>
                            </>
                        }
                    />
                    <Route path="/wishlist" element={<h1>Wishlist</h1>} />
                    <Route path="/profile" element={<h1>Profile</h1>} />
                    <Route
                        path="/errorPages/userNotLoggedIn"
                        element={<UserNotLoggedIn />}
                    />
                    <Route path="/settings" element={<h1>Settings</h1>} />
                </Routes>
            </main>

            <Footer />
        </>
    );
}

export default App
