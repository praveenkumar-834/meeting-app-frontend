import { useEffect, useRef } from "react";

export default function VideoPlayer({ stream, name, muted = false }) {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="video-box">
      <video ref={videoRef} autoPlay playsInline muted={muted} />
      <p style={{ marginTop: "8px" }}>{name}</p>
    </div>
  );
}
