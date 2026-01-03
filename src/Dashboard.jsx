import { useState } from "react";
import Upload from "./Upload";
import AdminMovies from "./AdminMovies";
import Stream from "./Stream";
import Home from "./Home";

export default function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState("home");

  // Helper for tab styles to keep JSX clean
  const tabClass = (tabName) => {
    const isActive = activeTab === tabName;
    const base = "flex-1 px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 relative overflow-hidden group";
    const active = "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.6)] border-cyan-400";
    const inactive = "bg-zinc-900/50 text-cyan-500/60 border-zinc-800 hover:text-cyan-300 hover:bg-zinc-900 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]";
    
    return `${base} ${isActive ? active : inactive} border rounded-t-lg rounded-b-none`;
  };

  return (
    <div className="mx-auto w-full max-w-5xl p-4">
      {/* Neon Tab Navigation */}
      <div className="mb-8 flex gap-2 border-b border-cyan-500/30 px-2">
        <button onClick={() => setActiveTab("home")} className={tabClass("home")}>
          <span className="relative z-10">🏠 Home</span>
          {activeTab === "home" && <div className="absolute inset-0 bg-white/20 blur-xl" />}
        </button>

        <button onClick={() => setActiveTab("upload")} className={tabClass("upload")}>
          <span className="relative z-10">⬆️ Upload</span>
          {activeTab === "upload" && <div className="absolute inset-0 bg-white/20 blur-xl" />}
        </button>

        {user?.isAdmin ? (
          <button onClick={() => setActiveTab("select")} className={tabClass("select")}>
            <span className="relative z-10">📺 Select & Stream</span>
            {activeTab === "select" && <div className="absolute inset-0 bg-white/20 blur-xl" />}
          </button>
        ) : (
          <button onClick={() => setActiveTab("stream")} className={tabClass("stream")}>
            <span className="relative z-10">📹 Stream by ID</span>
            {activeTab === "stream" && <div className="absolute inset-0 bg-white/20 blur-xl" />}
          </button>
        )}
      </div>

      {/* Glowing Content Container */}
      <div className="relative rounded-xl border border-cyan-500/30 bg-black/40 p-6 shadow-[0_0_30px_-10px_rgba(6,182,212,0.15)] backdrop-blur-sm">
        {/* Decorative corner accents */}
        <div className="pointer-events-none absolute -top-[2px] -left-[2px] h-4 w-4 rounded-tl-xl border-t-2 border-l-2 border-cyan-400"></div>
        <div className="pointer-events-none absolute -top-[2px] -right-[2px] h-4 w-4 rounded-tr-xl border-t-2 border-r-2 border-cyan-400"></div>
        <div className="pointer-events-none absolute -bottom-[2px] -left-[2px] h-4 w-4 rounded-bl-xl border-b-2 border-l-2 border-cyan-400"></div>
        <div className="pointer-events-none absolute -bottom-[2px] -right-[2px] h-4 w-4 rounded-br-xl border-b-2 border-r-2 border-cyan-400"></div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "home" && <Home />}
          {activeTab === "upload" && <Upload />}
          {activeTab === "select" && user?.isAdmin && <AdminMovies />}
          {activeTab === "stream" && !user?.isAdmin && <Stream />}
        </div>
      </div>
    </div>
  );
}