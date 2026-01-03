import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const joinByCode = () => {
    if (!roomCode.trim()) {
      setError("Enter a room code");
      return;
    }
    setError("");
    // Use invite token route
    navigate(`/room/token/${roomCode}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 font-mono">
      <div className="w-full max-w-md">
        
        {/* Neon Heading */}
        <h2 className="mb-8 text-center text-4xl font-bold uppercase tracking-widest text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
          Join a Room
        </h2>

        {/* Cyber Card Container */}
        <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-zinc-950/50 p-8 text-center shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-sm">
          
          {/* Decorative top glow line */}
          <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl"></div>

          <p className="relative z-10 mb-6 text-sm font-medium text-gray-300">
            Enter an invite code to join an existing room:
          </p>

          <input
            value={roomCode}
            onChange={e => setRoomCode(e.target.value)}
            placeholder="Enter room invite code"
            className="relative z-10 mb-6 w-full bg-black/50 border border-cyan-500/50 p-4 text-center text-cyan-100 placeholder-zinc-600 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 rounded-lg shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]"
          />

          <button 
            onClick={joinByCode}
            className="relative z-10 w-full bg-cyan-500 py-3 font-bold uppercase tracking-widest text-black transition-all duration-200 hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] active:scale-95 rounded-lg"
          >
            Join Room
          </button>

          {error && (
            <div className="relative z-10 mt-4 text-sm font-bold text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)] animate-pulse">
              {error}
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-xs uppercase tracking-widest text-zinc-700">
          <p>Or create a new room in the Upload/Stream section above.</p>
        </div>
      </div>
    </div>
  );
}