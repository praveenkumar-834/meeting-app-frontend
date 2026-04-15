import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <h2>Welcome, {user?.name}</h2>
          <p style={{ margin: "12px 0 24px" }}>
            Create a new meeting or join an existing one.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/create" className="btn">Create Meeting</Link>
            <Link to="/join" className="btn btn-secondary">Join Meeting</Link>
            <Link to="/history" className="btn">Meeting History</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
