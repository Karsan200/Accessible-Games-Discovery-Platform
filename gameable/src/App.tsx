import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import {Footer} from "./components/Footer.tsx";
import {Navigation} from "./components/Navigation.tsx";

import {Games} from "./pages/Games.tsx";
import {GamePage} from "./pages/GamePage.tsx";

function App() {
    return (
        <BrowserRouter>
            {/* Navigation */}
            <Navigation />

            {/* Routes */}
            <Routes>
                <Route path="/games" element={<Games />} />
                <Route path="/games/:id" element={<GamePage />} />
            </Routes>

            {/* Footers */}
            <Footer />
        </BrowserRouter>
    )
}

export default App
