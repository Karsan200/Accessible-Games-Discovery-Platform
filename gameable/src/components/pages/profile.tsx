import { useNavigate } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Profile Page</h1>

            <div style={{ marginTop: 16 }}>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/my-reviews")}
                >
                    Manage my reviews
                </button>
            </div>
        </div>
    );
}


