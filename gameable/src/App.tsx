import './App.css'
import Navbar from './components/navbarAndFooter/navbar.tsx'
import NavbarLoggedOut from "./components/navbarAndFooter/navbarLoggedOut.tsx";
import UserNotLoggedIn from './components/navbarAndFooter/errorPages/userNotLoggedIn';
import AboutUs from "./components/navbarAndFooter/footerPages/aboutUs.tsx";
import ContactUs from "./components/navbarAndFooter/footerPages/contactUs.tsx";
import AccessibilityStatement from "./components/navbarAndFooter/footerPages/acessibilityStatement.tsx";
import "./theme.scss"

import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import {AuthProvider, useAuth} from "./data/AuthContext.tsx";

import Footer from "./components/navbarAndFooter/footer.tsx";
import { Navigation } from "./components/Navigation.tsx";

import { Games } from "./components/navbarAndFooter/pages/Games.tsx";
import { Register } from "./components/navbarAndFooter/pages/Register.tsx";
import { Login } from "./components/navbarAndFooter/pages/Login.tsx";
import { Home } from "./components/navbarAndFooter/pages/Home.tsx";
import {settings} from "./AppSettings.ts";

function AppContent() {
    const { accessToken, setAccessToken } = useAuth();
    const navigate = useNavigate();
    const isLoggedIn = accessToken !== null;

    const handleLogout = async () => {
        try {
            await fetch(settings.apiBaseUrl + '/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setAccessToken(null);
            navigate('/');
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <>
            {isLoggedIn ? (
                <Navbar onLogout={handleLogout} />
            ) : (
                <NavbarLoggedOut onLogin={handleLoginClick} />
            )}
            <Navigation />

            <main className="main">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/wishlist" element={<h1>Wishlist</h1>} />
                    <Route path="/profile" element={<h1>Profile</h1>} />
                    <Route path="/errorPages/userNotLoggedIn" element={<UserNotLoggedIn />}/>
                    <Route path="/settings" element={<h1>Settings</h1>} />
                    <Route path="/footerPages/aboutUs" element={<AboutUs />} />
                    <Route path="/footerPages/contactUs" element={<ContactUs />} />
                    <Route path="/footerPages/accessibilityStatement" element={<AccessibilityStatement />}/>
                </Routes>
            </main>

            <Footer />
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </BrowserRouter>
    );
}
export default App
