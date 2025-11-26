import './App.css'
import Navbar from './components/navbarAndFooter/navbar.tsx'
import NavbarLoggedOut from "./components/navbarAndFooter/navbarLoggedOut.tsx";
import UserNotLoggedIn from './components/navbarAndFooter/errorPages/userNotLoggedIn';
import AboutUs from "./components/navbarAndFooter/footerPages/aboutUs.tsx";
import ContactUs from "./components/navbarAndFooter/footerPages/contactUs.tsx";
import AccessibilityStatement from "./components/navbarAndFooter/footerPages/acessibilityStatement.tsx";
import "./theme.scss"

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {AuthProvider, useAuth} from "./data/AuthContext.tsx";

import Footer from "./components/navbarAndFooter/footer.tsx";

import { Games } from "./components/pages/Games.tsx";
import {GamePage} from "./components/pages/GamePage.tsx";
import { Register } from "./components/pages/Register.tsx";
import { Login } from "./components/pages/Login.tsx";
import { Home } from "./components/pages/Home.tsx";
import { Wishlist } from "./components/pages/Wishlist.tsx";
import Profile from "./components/pages/profile.tsx";
import MyReviews from "./components/pages/MyReviews.tsx";
import Dashboard from "./components/pages/Dashboard.tsx";

function AppContent() {
    const { accessToken } = useAuth();
    const isLoggedIn = accessToken !== null;


    return (
        <>
            {isLoggedIn ? (
                <Navbar />
            ) : (
                <NavbarLoggedOut />
            )}
            <main className="main">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/games/:id" element={<GamePage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/my-reviews" element={<MyReviews />} />
                    <Route path="/errorPages/userNotLoggedIn" element={<UserNotLoggedIn />}/>
                    <Route path="/settings" element={<h1>Settings</h1>} />
                    <Route path="/footerPages/aboutUs" element={<AboutUs />} />
                    <Route path="/footerPages/contactUs" element={<ContactUs />} />
                    <Route path="/footerPages/accessibilityStatement" element={<AccessibilityStatement />}/>
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/dashboard" element={<Dashboard />} />
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
