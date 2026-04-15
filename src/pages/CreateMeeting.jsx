import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function CreateMeeting() {
  const [title, setTitle] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = { title };
      if (scheduledTime) payload.scheduledTime = scheduledTime;

      const { data } = await API.post("/meetings/create", payload);
      navigate(`/meeting/${data.meetingId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create meeting");
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: "600px" }}>
        <div className="card">
          <h2 style={{ marginBottom: "20px" }}>Create Meeting</h2>
          {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Meeting Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Schedule Time (optional)</label>
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
            <button className="btn" type="submit">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
}
