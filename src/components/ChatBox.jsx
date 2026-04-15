import { useState } from "react";

export default function ChatBox({ messages, onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <strong>{msg.userName}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
