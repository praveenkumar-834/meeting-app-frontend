import { useEffect, useState } from "react";
import API from "../services/api";

export default function History() {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await API.get("/meetings/history");
        setMeetings(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <h2 style={{ marginBottom: "20px" }}>Meeting History</h2>
          {meetings.length === 0 ? (
            <p>No meetings found.</p>
          ) : (
            meetings.map((meeting) => (
              <div
                key={meeting._id}
                style={{
                  padding: "14px 0",
                  borderBottom: "1px solid #eee"
                }}
              >
                <h3>{meeting.title}</h3>
                <p>Meeting ID: {meeting.meetingId}</p>
                <p>Status: {meeting.status}</p>
                <p>Host: {meeting.host?.name}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
