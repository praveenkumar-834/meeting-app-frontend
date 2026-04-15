import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Peer from "simple-peer";
import socket from "../services/socket";
import { useAuth } from "../context/AuthContext";
import VideoPlayer from "../components/VideoPlayer";
import ChatBox from "../components/ChatBox";
import Controls from "../components/Controls";
import Participants from "../components/Participants";

export default function MeetingRoom() {
  const { id: meetingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const peersRef = useRef([]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        socket.emit("join-meeting", {
          meetingId,
          userName: user?.name || "Guest"
        });

        socket.on("all-users", (users) => {
          const createdPeers = [];

          users.forEach((remoteUser) => {
            const peer = createPeer(
              remoteUser.socketId,
              socket.id,
              currentStream,
              user?.name || "Guest"
            );
            peersRef.current.push({
              peerId: remoteUser.socketId,
              peer,
              userName: remoteUser.userName
            });
            createdPeers.push({
              peer,
              peerId: remoteUser.socketId,
              userName: remoteUser.userName
            });
          });

          setPeers(createdPeers);
          setParticipants(users);
        });

        socket.on("user-joined", (payload) => {
          const peer = addPeer(payload, currentStream);
          peersRef.current.push({
            peerId: payload.socketId,
            peer,
            userName: payload.userName
          });

          setPeers((prev) => [
            ...prev,
            { peer, peerId: payload.socketId, userName: payload.userName }
          ]);
          setParticipants((prev) => [
            ...prev,
            { socketId: payload.socketId, userName: payload.userName }
          ]);
        });

        socket.on("user-joined-signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerId === payload.callerId);
          if (item) {
            item.peer.signal(payload.signal);
          }
        });

        socket.on("receiving-returned-signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerId === payload.id);
          if (item) {
            item.peer.signal(payload.signal);
          }
        });

        socket.on("receive-message", (message) => {
          setMessages((prev) => [...prev, message]);
        });

        socket.on("user-left", ({ socketId }) => {
          const peerObj = peersRef.current.find((p) => p.peerId === socketId);
          if (peerObj) peerObj.peer.destroy();

          peersRef.current = peersRef.current.filter((p) => p.peerId !== socketId);
          setPeers((prev) => prev.filter((p) => p.peerId !== socketId));
          setParticipants((prev) => prev.filter((p) => p.socketId !== socketId));
        });
      })
      .catch((error) => {
        console.error("Media error:", error);
      });

    return () => {
      socket.off("all-users");
      socket.off("user-joined");
      socket.off("user-joined-signal");
      socket.off("receiving-returned-signal");
      socket.off("receive-message");
      socket.off("user-left");
    };
  }, [meetingId, user?.name]);

  const createPeer = (userToSignal, callerId, currentStream, userName) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: currentStream
    });

    peer.on("signal", (signal) => {
      socket.emit("sending-signal", {
        userToSignal,
        callerId,
        signal,
        userName
      });
    });

    return peer;
  };

  const addPeer = (payload, currentStream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: currentStream
    });

    peer.on("signal", (signal) => {
      socket.emit("returning-signal", {
        signal,
        callerId: payload.socketId
      });
    });

    return peer;
  };

  const handleSendMessage = (text) => {
    socket.emit("send-message", {
      meetingId,
      message: text,
      userName: user?.name || "Guest"
    });
  };

  const handleToggleAudio = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsAudioOn(track.enabled);
    });
  };

  const handleToggleVideo = () => {
    if (!stream) return;
    stream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsVideoOn(track.enabled);
    });
  };

  const handleLeave = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    peersRef.current.forEach(({ peer }) => peer.destroy());
    navigate("/dashboard");
  };

  return (
    <div className="page">
      <div className="container">
        <div className="grid grid-2">
          <div>
            <div className="card">
              <h2>Meeting Room</h2>
              <p style={{ marginTop: "8px" }}>Meeting ID: {meetingId}</p>

              <div className="video-grid">
                {stream && (
                  <VideoPlayer
                    stream={stream}
                    name={`${user?.name || "Guest"} (You)`}
                    muted
                  />
                )}
                {peers.map((peerObj) => (
                  <PeerVideo
                    key={peerObj.peerId}
                    peer={peerObj.peer}
                    name={peerObj.userName}
                  />
                ))}
              </div>

              <Controls
                isAudioOn={isAudioOn}
                isVideoOn={isVideoOn}
                onToggleAudio={handleToggleAudio}
                onToggleVideo={handleToggleVideo}
                onLeave={handleLeave}
              />
            </div>
          </div>

          <div className="grid" style={{ gap: "16px" }}>
            <Participants participants={participants} />
            <ChatBox messages={messages} onSend={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PeerVideo({ peer, name }) {
  const ref = useRef();

  useEffect(() => {
    peer.on("stream", (remoteStream) => {
      if (ref.current) {
        ref.current.srcObject = remoteStream;
      }
    });

    return () => {
      peer.removeAllListeners("stream");
    };
  }, [peer]);

  return (
    <div className="video-box">
      <video ref={ref} autoPlay playsInline />
      <p style={{ marginTop: "8px" }}>{name}</p>
    </div>
  );
}
