import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './navbar.tsx'

function App() {

    const [games, setGames] = useState([]);
    useEffect(() => {
        fetch("http://localhost:5000/api/games")
            .then((res) => res.json())
            .then((data) => setGames(data))
            .catch(console.error)
    }, []);

    return (
        <div>
            <Navbar />
            <h1>Game List</h1>
            <ul>
                {games.map((g: any) => (
                    <li key={g._id}>{g.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default App
