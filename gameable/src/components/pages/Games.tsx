import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type GameSummary = {
    _id: string;
    title: string;
};

export function Games() {
    const [games, setGames] = useState<GameSummary[]>([]);

    useEffect(() => {
        let mounted = true;
        fetch("http://localhost:5000/api/games")
            .then((res) => {
                if (!res.ok) throw new Error(res.statusText);
                return res.json();
            })
            .then((data) => {
                if (!mounted) return;
                setGames(Array.isArray(data) ? (data as GameSummary[]) : []);
            })
            .catch((err) => {
                console.error(err);
                if (mounted) setGames([]);
            });
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div>
            <div>
                <h1>Game List</h1>
                <ul>
                    {games.map((g) => (
                        <li key={g._id}>
                            <Link to={`/games/${g._id}`}>{g.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
