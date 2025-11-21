import { BrowserRouter, Routes, Route } from 'react-router-dom';

import {Footer} from "./components/common/Footer.tsx";
import Navbar from "./components/common/Navigation.tsx";
import Breadcrumb from "./components/common/Breadcrumb.tsx";

import {Games} from "./pages/Games.tsx";
import {GamePage} from "./pages/GamePage.tsx";

function App() {
    return (
        <BrowserRouter>
            {/* Navigation */}
            <Navbar />
            <Breadcrumb />

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
