import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Room from "./Room";
import AdminPanel from "./AdminPanel";
import ProtectedRoute from "./ProtectedRoute";

function AuthPages({ user, setUser, onUserLogin }) {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route 
        path="/signup" 
        element={
          <Signup 
            onSignup={(userData) => {
              setUser(userData);
              localStorage.setItem("user", JSON.stringify(userData));
              navigate("/");
            }}
          />
        } 
      />
      <Route 
        path="/" 
        element={
          <Login 
            onLogin={(userData) => {
              setUser(userData);
              localStorage.setItem("user", JSON.stringify(userData));
              navigate("/");
            }}
            onSignupClick={() => navigate("/signup")}
          />
        } 
      />
    </Routes>
  );
}

function AppContent({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* Neon Navbar */}
      <div className="sticky top-0 z-50 border-b border-cyan-500/30 bg-black/80 px-6 py-4 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo with Glow */}
          <h1 className="text-2xl font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] md:text-3xl">
            MOOWEE <span className="text-cyan-500">.</span>
          </h1>

          <div className="flex items-center gap-6">
            {/* User Info - Monospace Style */}
            <span className="hidden text-sm font-mono text-cyan-500/80 md:block">
              UID: {user?.email || "GUEST"} 
              {user?.isAdmin && <span className="ml-2 rounded bg-cyan-500/20 px-2 py-0.5 text-xs text-cyan-400 border border-cyan-500/30">ADMIN</span>}
            </span>

            {/* Neon Logout Button */}
            <button 
              onClick={handleLogout}
              className="rounded-md border border-red-500/50 bg-transparent px-5 py-2 text-sm font-bold uppercase tracking-wider text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-black hover:shadow-[0_0_20px_rgba(248,113,113,0.6)]"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/room/:id" element={<ProtectedRoute user={user}><Room /></ProtectedRoute>} />
          <Route path="/room/token/:token" element={<ProtectedRoute user={user}><Room /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute user={user} adminOnly><AdminPanel /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      setUser({ token, ...storedUser });
    }
  }, []);

  return (
    <Router>
      {!user ? (
        <AuthPages user={user} setUser={setUser} onUserLogin={() => {}} />
      ) : (
        <AppContent user={user} setUser={setUser} />
      )}
    </Router>
  );
}

export default App;