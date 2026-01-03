import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "./Api";

export default function Stream() {
  const [id, setId] = useState("");
  const [roomStatus, setRoomStatus] = useState("");
  const [createdRoom, setCreatedRoom] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [movies, setMovies] = useState([]);

  const navigate = useNavigate();
  const src = id ? `http://localhost:5000/api/stream/${id}` : "";

  useEffect(() => {
    API.get("/movies")
      .then(res => setMovies(res.data))
      .catch(() => setMovies([]));
  }, []);

  const createRoom = async () => {
    if (!id) {
      setRoomStatus("Enter a movie ID first");
      return;
    }

    try {
      const res = await API.post("/rooms/create", { movieId: id });
      const room = res.data.room || res.data;
      const token = res.data.inviteToken || room.inviteToken;

      const inviteLink = `${window.location.origin}/room/token/${token}`;

      setCreatedRoom({
        roomId: room._id,
        roomCode: res.data.roomCode,
        inviteLink,
      });

      setRoomStatus("✓ Room created");

      // Navigate directly to the token route to avoid extra lookup/redirect
      setTimeout(() => navigate(`/room/token/${token}`), 1200);
    } catch (err) {
      setRoomStatus(
        "Failed to create room: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl p-4 pb-20">
      {/* Neon Header */}
      <h2 className="mb-8 text-center text-4xl font-black uppercase tracking-[0.2em] text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
        Stream by <span className="text-cyan-400">ID</span>
      </h2>

      {/* Main Control Panel */}
      <div className="relative rounded-xl border border-cyan-500/30 bg-zinc-950/80 p-8 shadow-[0_0_30px_-10px_rgba(6,182,212,0.2)] backdrop-blur-sm">
        
        {/* Decorative Grid Background */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

        <div className="relative z-10 space-y-6">
          {/* Input Field */}
          <div className="group">
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-cyan-500/70">
              Target Movie ID
            </label>
            <input
              placeholder="Paste movie _id here..."
              value={id}
              onChange={e => setId(e.target.value)}
              className="w-full rounded bg-black/50 border border-cyan-500/30 p-4 font-mono text-lg text-cyan-100 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] placeholder:text-zinc-700"
            />
          </div>

          {/* Create Button */}
          <button 
            onClick={createRoom}
            className="w-full rounded bg-gradient-to-r from-cyan-600 to-blue-600 py-4 font-bold uppercase tracking-widest text-white transition-all duration-300 hover:from-cyan-500 hover:to-blue-500 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] active:scale-[0.99]"
          >
            Initialize Room
          </button>

          {/* Movie Selector */}
          {movies.length > 0 && (
            <div className="relative mt-4">
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">
                Or Select from Database
              </label>
              <div className="relative">
                <select
                  value={id}
                  onChange={e => setId(e.target.value)}
                  className="w-full appearance-none rounded bg-black/50 border border-zinc-700 p-4 font-mono text-zinc-300 outline-none focus:border-cyan-500 focus:text-cyan-100 cursor-pointer transition-colors"
                >
                  <option value="" className="bg-zinc-900 text-zinc-400">Select movie...</option>
                  {movies.map(m => (
                    <option key={m._id} value={m._id} className="bg-zinc-900 text-zinc-200">
                      {m.title}
                    </option>
                  ))}
                </select>
                {/* Custom Arrow */}
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-cyan-500">
                  ▼
                </div>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {roomStatus && (
            <div className={`text-center font-mono text-sm font-bold ${createdRoom ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`}>
              {roomStatus}
            </div>
          )}

          {/* Success / Link Section */}
          {createdRoom && (
            <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                <span className="text-xs text-cyan-500">ACCESS GRANTED</span>
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
              </div>
              
              <div className="flex gap-2">
                <input
                  readOnly
                  value={createdRoom.inviteLink}
                  className="flex-1 rounded bg-black border border-green-500/50 p-3 text-xs font-mono text-green-400"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(createdRoom.inviteLink)}
                  className="rounded border border-cyan-500/50 bg-cyan-900/20 px-4 text-xs font-bold text-cyan-400 transition hover:bg-cyan-500 hover:text-black"
                >
                  COPY
                </button>
              </div>
              
              <div className="mt-4 text-center text-xs text-zinc-500">
                Redirecting to host view...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      <h3 className="mt-12 mb-6 text-xl font-bold uppercase tracking-widest text-zinc-400">
        Signal Preview
      </h3>

      <div className="relative group rounded-xl border border-zinc-800 bg-black overflow-hidden shadow-2xl">
        {/* Neon Border Glow on Hover */}
        <div className="absolute inset-0 rounded-xl border border-transparent transition-all duration-500 group-hover:border-cyan-500/50" />
        
        {videoLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
          </div>
        )}

        {id ? (
          <video
            key={id}
            controls
            onLoadStart={() => setVideoLoading(true)}
            onCanPlay={() => setVideoLoading(false)}
            onError={() => setRoomStatus("Video load failed")}
            className="h-auto w-full min-h-[300px] bg-black"
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <div className="flex h-[300px] items-center justify-center border-2 border-dashed border-zinc-800 text-zinc-600">
            <span className="font-mono text-sm">NO SIGNAL DETECTED</span>
          </div>
        )}
      </div>
    </div>
  );
}