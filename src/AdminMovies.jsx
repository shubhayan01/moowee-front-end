import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "./Api";

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(null);
  const [roomStatus, setRoomStatus] = useState("");
  const [createdRoom, setCreatedRoom] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const res = await API.get("/movies");
        setMovies(res.data);
      } catch (err) {
        console.error("Failed to load movies:", err);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  const createRoom = async (movieId) => {
    setCreating(movieId);
    try {
      const res = await API.post("/rooms/create", { movieId });
      const room = res.data.room;
      const code = res.data.roomCode;
      const link = res.data.inviteToken;
      const inviteLink = `${window.location.origin}/room/token/${link}`;
      setCreatedRoom({ roomId: room._id, roomCode: code, inviteLink });
      setRoomStatus("✓ Room created!");
      // Direct to token route
      setTimeout(() => navigate(`/room/token/${link}`), 1200);
    } catch (err) {
      setRoomStatus("Failed to create room: " + (err.response?.data?.message || err.message));
    } finally {
      setCreating(null);
    }
  };

  if (loading) return <div>Loading movies...</div>;

  return (
    <div style={{ marginBottom: 20 }}>
      <h2>📺 Select a Movie to Stream</h2>
      <div style={{ border: "1px solid #ddd", padding: 15, borderRadius: 5, backgroundColor: "#fafafa" }}>
        {movies.length === 0 ? (
          <p style={{ color: "#999" }}>No movies available yet.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 15 }}>
            {movies.map(movie => (
              <div
                key={movie._id}
                style={{
                  border: "1px solid #ccc",
                  padding: 15,
                  borderRadius: 5,
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                }}
              >
                <h4 style={{ margin: "0 0 10px 0" }}>{movie.title}</h4>
                <p style={{ margin: "5px 0", fontSize: "12px", color: "#666" }}>ID: {movie._id}</p>
                <button
                  onClick={() => createRoom(movie._id)}
                  disabled={creating === movie._id}
                  style={{
                    width: "100%",
                    padding: 10,
                    backgroundColor: creating === movie._id ? "#ccc" : "#4CAF50",
                    color: "#fff",
                    border: "none",
                    cursor: creating === movie._id ? "default" : "pointer",
                    borderRadius: 4
                  }}
                >
                  {creating === movie._id ? "Creating..." : "Create Room"}
                </button>
              </div>
            ))}
          </div>
        )}

        {createdRoom && (
          <div style={{ backgroundColor: "#e8f5e9", border: "2px solid #4CAF50", padding: 15, borderRadius: 5, marginTop: 15 }}>
            <h3 style={{ marginTop: 0 }}>✓ Room Created!</h3>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontWeight: "bold", display: "block", marginBottom: 5 }}>Room Code (viewers paste this):</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  readOnly
                  value={createdRoom.roomCode}
                  style={{ flex: 1, padding: 8, backgroundColor: "#fff", border: "1px solid #ccc", fontSize: "18px", fontWeight: "bold" }}
                />
                <button onClick={() => navigator.clipboard.writeText(createdRoom.roomCode)} style={{ padding: "8px 12px", backgroundColor: "#2196F3", color: "#fff", border: "none", cursor: "pointer", borderRadius: 4 }}>
                  Copy Code
                </button>
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontWeight: "bold", display: "block", marginBottom: 5 }}>Full Invite Link:</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  readOnly
                  value={createdRoom.inviteLink}
                  style={{ flex: 1, padding: 8, backgroundColor: "#fff", border: "1px solid #ccc", fontSize: "12px" }}
                />
                <button onClick={() => navigator.clipboard.writeText(createdRoom.inviteLink)} style={{ padding: "8px 12px", backgroundColor: "#2196F3", color: "#fff", border: "none", cursor: "pointer", borderRadius: 4 }}>
                  Copy Link
                </button>
              </div>
            </div>
            <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>Redirecting to room in 2 seconds...</p>
          </div>
        )}

        {roomStatus && <div style={{ marginTop: 10, color: createdRoom ? "green" : "red" }}>{roomStatus}</div>}
      </div>
    </div>
  );
}
