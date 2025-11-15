import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import {Footer} from "./components/Footer.tsx";
import {Navigation} from "./components/Navigation.tsx";

import {Games} from "./pages/Games.tsx";
import {Home} from "./pages/Home.tsx";

function App() {
    return (
        <BrowserRouter>
            // Navigation
            <Navigation />

            // Routes
            <Routes>
                <Route path="/games" element={<Games />} />
                <Route path="/home" element={<Home />} />/
            </Routes>

            // Footer
            <Footer />
        </BrowserRouter>
    )
}

export default App
