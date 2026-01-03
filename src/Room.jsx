import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "./Api";
import { io } from "socket.io-client";

export default function Room() {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [participants, setParticipants] = useState(0);
  const [isSyncing, setIsSyncing] = useState(true);

  const navigate = useNavigate();
  const { id, token } = useParams();
  const videoRef = useRef(null);
  const localVideoRef = useRef(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const localStreamRef = useRef(null);

  // Fetch room data
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await API.get(`/rooms/${id}`);
        const inviteToken = res.data.inviteToken || res.data.room?.inviteToken;
        if (inviteToken) navigate(`/room/token/${inviteToken}`, { replace: true });
      } catch (err) {
        setError("Unable to open room");
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await API.get(`/rooms/token/${token}`);
        setRoom(res.data);
        setError("");
      } catch (err) {
        setError("Invalid or expired room token");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // Socket.IO setup for syncing & chat
  useEffect(() => {
    if (!room) return;

    const socket = io("http://localhost:5000", {
      auth: { token: localStorage.getItem("token") },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("Join-room", room._id);
    });

    socket.on("participants", (data) => {
      setParticipants(data.count);
    });

    // Video sync events
    socket.on("play", (time) => {
      if (videoRef.current && isSyncing) {
        videoRef.current.currentTime = time;
        videoRef.current.play();
      }
    });

    socket.on("pause", (time) => {
      if (videoRef.current && isSyncing) {
        videoRef.current.currentTime = time;
        videoRef.current.pause();
      }
    });

    socket.on("seek", (time) => {
      if (videoRef.current && isSyncing) {
        videoRef.current.currentTime = time;
      }
    });

    // Chat
    socket.on("chat", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user-joined", (data) => {
      setMessages((prev) => [
        ...prev,
        { user: "System", message: `User ${data.id.slice(0, 5)} joined` },
      ]);
    });

    socket.on("user-left", (data) => {
      setMessages((prev) => [
        ...prev,
        { user: "System", message: `User ${data.id.slice(0, 5)} left` },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [room, isSyncing]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handlePlay = () => {
    if (videoRef.current && socketRef.current && room) {
      socketRef.current.emit("play", {
        roomId: room._id,
        time: videoRef.current.currentTime,
      });
    }
  };

  const handlePause = () => {
    if (videoRef.current && socketRef.current && room) {
      socketRef.current.emit("pause", {
        roomId: room._id,
        time: videoRef.current.currentTime,
      });
    }
  };

  const handleSeek = () => {
    if (videoRef.current && socketRef.current && room) {
      socketRef.current.emit("seek", {
        roomId: room._id,
        time: videoRef.current.currentTime,
      });
    }
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !socketRef.current || !room) return;

    socketRef.current.emit("chat", {
      roomId: room._id,
      message: messageInput,
      user: "You",
    });

    setMessages((prev) => [
      ...prev,
      { user: "You", message: messageInput },
    ]);
    setMessageInput("");
  };

  const toggleCamera = async () => {
    try {
      if (!cameraEnabled) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: micEnabled,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setCameraEnabled(true);
      } else {
        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null;
        }
        setCameraEnabled(false);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setError("Camera access denied");
    }
  };

  const toggleMic = async () => {
    try {
      if (!micEnabled) {
        if (cameraEnabled && localStreamRef.current) {
          const audioTrack = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          audioTrack.getTracks().forEach((track) => {
            localStreamRef.current.addTrack(track);
          });
        } else {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          localStreamRef.current = stream;
        }
        setMicEnabled(true);
      } else {
        localStreamRef.current
          ?.getAudioTracks()
          .forEach((track) => track.stop());
        setMicEnabled(false);
      }
    } catch (err) {
      console.error("Mic access denied:", err);
      setError("Mic access denied");
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/room/token/${token}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCode = () => {
    if (room?.roomCode) {
      navigator.clipboard.writeText(room.roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent mx-auto" />
          <p className="text-cyan-400">Loading room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-4">
        <div className="max-w-md text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-400">Error</h2>
          <p className="mb-6 text-zinc-400">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="rounded bg-cyan-500 px-6 py-2 font-bold text-black hover:bg-cyan-400"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center text-zinc-400">Room not found</div>
      </div>
    );
  }

  const videoSrc = room.movie
    ? `http://localhost:5000/api/stream/${room.movie._id}`
    : null;

  return (
    <div className="min-h-screen bg-black p-4 pb-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            {room.movie?.title || "Watch Room"} <span className="text-cyan-500">.</span>
          </h1>
          <div className="flex gap-6 text-sm text-zinc-400">
            <span>
              Room Code: <span className="font-mono font-bold text-cyan-400">{room.roomCode}</span>
            </span>
            <span>
              👥 Participants: <span className="font-bold text-cyan-400">{participants}</span>
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Video & Controls - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Main Video Player */}
            <div className="rounded-xl border border-cyan-500/30 bg-black overflow-hidden shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)]">
              {videoSrc ? (
                <video
                  ref={videoRef}
                  controls
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onSeeked={handleSeek}
                  className="h-auto w-full min-h-[400px] bg-black"
                >
                  <source src={videoSrc} type="video/mp4" />
                </video>
              ) : (
                <div className="flex h-[400px] items-center justify-center border-2 border-dashed border-cyan-500/30 text-zinc-600">
                  <span className="font-mono text-sm">NO VIDEO AVAILABLE</span>
                </div>
              )}
            </div>

            {/* Camera & Mic Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-cyan-500/30 bg-zinc-950/80 p-4 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-white">Camera</h3>
                  <button
                    onClick={toggleCamera}
                    className={`rounded px-4 py-2 font-bold transition ${
                      cameraEnabled
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-cyan-500 hover:bg-cyan-400 text-black"
                    }`}
                  >
                    {cameraEnabled ? "Off" : "On"}
                  </button>
                </div>
                {cameraEnabled ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className="w-full rounded bg-black"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center rounded bg-black border border-cyan-500/20 text-zinc-600">
                    Camera disabled
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-cyan-500/30 bg-zinc-950/80 p-4 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-white">Microphone</h3>
                  <button
                    onClick={toggleMic}
                    className={`rounded px-4 py-2 font-bold transition ${
                      micEnabled
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-cyan-500 hover:bg-cyan-400 text-black"
                    }`}
                  >
                    {micEnabled ? "Off" : "On"}
                  </button>
                </div>
                <div className="flex h-40 items-center justify-center rounded bg-black border border-cyan-500/20">
                  <p className="text-center text-sm text-zinc-600">
                    {micEnabled ? "🎤 Mic active" : "🔇 Mic disabled"}
                  </p>
                </div>
              </div>
            </div>

            {/* Sync Control */}
            <div className="rounded-xl border border-cyan-500/30 bg-zinc-950/80 p-4 backdrop-blur-xl flex items-center justify-between">
              <span className="text-white font-bold">Sync Playback</span>
              <button
                onClick={() => setIsSyncing(!isSyncing)}
                className={`rounded px-4 py-2 font-bold transition ${
                  isSyncing
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-600 hover:bg-gray-700"
                } text-white`}
              >
                {isSyncing ? "Synced" : "Not Synced"}
              </button>
            </div>
          </div>

          {/* Sidebar - Share, Info, Chat */}
          <div className="lg:col-span-1 space-y-6 max-h-screen overflow-y-auto">
            {/* Share Section */}
            <div className="rounded-xl border border-cyan-500/30 bg-zinc-950/80 p-6 backdrop-blur-xl sticky top-4">
              <h3 className="mb-4 text-lg font-bold text-white">
                Share <span className="text-cyan-400">Room</span>
              </h3>

              <div className="mb-4 space-y-2">
                <label className="block text-xs font-bold uppercase text-cyan-400">
                  Full Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/room/token/${token}`}
                    className="flex-1 rounded bg-black/50 border border-cyan-500/30 p-2 text-xs font-mono text-zinc-300 outline-none"
                  />
                  <button
                    onClick={copyLink}
                    className="rounded bg-cyan-500 px-3 py-2 font-bold text-black transition hover:bg-cyan-400 text-xs"
                  >
                    {copied ? "✓" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-cyan-400">
                  Room Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={room.roomCode}
                    className="flex-1 rounded bg-black/50 border border-cyan-500/30 p-2 text-lg font-bold text-cyan-300 outline-none text-center"
                  />
                  <button
                    onClick={copyCode}
                    className="rounded bg-cyan-500 px-3 py-2 font-bold text-black transition hover:bg-cyan-400 text-xs"
                  >
                    {copied ? "✓" : "Copy"}
                  </button>
                </div>
              </div>
            </div>

            {/* Chat */}
            <div className="rounded-xl border border-cyan-500/30 bg-zinc-950/80 backdrop-blur-xl flex flex-col h-96">
              <div className="border-b border-cyan-500/30 p-4">
                <h3 className="font-bold text-white text-sm">Chat</h3>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-xs text-zinc-600">No messages yet...</p>
                ) : (
                  messages.map((msg, i) => (
                    <div key={i} className="text-xs">
                      <span
                        className={
                          msg.user === "System"
                            ? "text-zinc-600"
                            : msg.user === "You"
                            ? "text-cyan-400 font-bold"
                            : "text-green-400 font-bold"
                        }
                      >
                        {msg.user}:
                      </span>
                      <p className="text-zinc-300 break-words">{msg.message}</p>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-cyan-500/30 p-3 flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type message..."
                  className="flex-1 rounded bg-black/50 border border-cyan-500/30 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
                <button
                  onClick={sendMessage}
                  className="rounded bg-cyan-500 px-3 py-2 font-bold text-black text-xs hover:bg-cyan-400"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}