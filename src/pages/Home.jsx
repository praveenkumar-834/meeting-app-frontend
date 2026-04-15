import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page">
      <div className="container">
        <div className="card" style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "42px", marginBottom: "16px" }}>
            React + Node Meeting App
          </h1>
          <p style={{ marginBottom: "24px" }}>
            Create meetings, join by meeting ID, use video/audio, and chat in realtime.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" className="btn">Get Started</Link>
            <Link to="/join" className="btn btn-secondary">Join Meeting</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
