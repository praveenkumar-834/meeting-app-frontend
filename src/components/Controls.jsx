export default function Controls({
  isAudioOn,
  isVideoOn,
  onToggleAudio,
  onToggleVideo,
  onLeave
}) {
  return (
    <div className="controls">
      <button className="btn" onClick={onToggleAudio}>
        {isAudioOn ? "Mute Audio" : "Unmute Audio"}
      </button>
      <button className="btn" onClick={onToggleVideo}>
        {isVideoOn ? "Stop Video" : "Start Video"}
      </button>
      <button className="btn btn-secondary" onClick={onLeave}>
        Leave Meeting
      </button>
    </div>
  );
}
