import { useNavigate } from "react-router-dom";
import "./Profile.css";


export default function Profile() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Profile Page</h1>

            <div className="profile-actions" style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px" }}>
                {/* Full-width button visually matching review boxes */}
                <button
                    className="manage-reviews-btn"
                    onClick={() => navigate("/my-reviews")}
                    aria-label="Manage my reviews"
                >
                    Manage my reviews
                </button>
            </div>
        </div>
    );
}