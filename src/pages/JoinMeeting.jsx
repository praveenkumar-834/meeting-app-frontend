import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function JoinMeeting() {
  const [meetingId, setMeetingId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/meetings/join", { meetingId });
      navigate(`/meeting/${meetingId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join meeting");
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: "500px" }}>
        <div className="card">
          <h2 style={{ marginBottom: "20px" }}>Join Meeting</h2>
          {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}
          <form onSubmit={handleJoin}>
            <div className="form-group">
              <label>Meeting ID</label>
              <input value={meetingId} onChange={(e) => setMeetingId(e.target.value)} required />
            </div>
            <button className="btn" type="submit">Join</button>
          </form>
        </div>
      </div>
    </div>
  );
}
