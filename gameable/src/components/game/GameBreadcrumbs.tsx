import { Link } from "react-router-dom";

type Props = {
    gameTitle: string;
};

export function GameBreadcrumbs({ gameTitle }: Props) {
    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb small">
                <li className="breadcrumb-item">
                    <Link to="/games">Search Games</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                    {gameTitle}
                </li>
            </ol>
        </nav>
    );
}
