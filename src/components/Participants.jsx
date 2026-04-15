export default function Participants({ participants }) {
  return (
    <div className="card">
      <h3 style={{ marginBottom: "12px" }}>Participants</h3>
      {participants.length === 0 ? (
        <p>No participants yet</p>
      ) : (
        participants.map((p, index) => <p key={index}>{p.userName}</p>)
      )}
    </div>
  );
}
