import { useEffect, useState } from "react";
import { API } from "./Api";

export default function MovieList({ onSelect }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    API.get("/movies").then(res => setMovies(res.data));
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header with Neon Underline */}
      <div className="mb-8 flex items-end justify-between border-b border-cyan-500/30 pb-4">
        <h3 className="text-2xl font-bold uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
          Movie <span className="text-cyan-400">Database</span>
        </h3>
        <span className="font-mono text-xs text-cyan-500/60">{movies.length} ENTRIES</span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {movies.map((m) => (
          <div 
            key={m._id}
            className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/50 transition-all duration-300 hover:border-cyan-500/50 hover:bg-zinc-900 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
          >
            {/* Decorative Side Glow */}
            <div className="absolute left-0 top-0 h-full w-1 bg-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_10px_rgba(6,182,212,1)]" />

            <button 
              onClick={() => onSelect(m)}
              className="flex w-full items-center justify-between p-4 text-left outline-none"
            >
              <span className="font-mono text-sm font-medium text-zinc-300 group-hover:text-cyan-100 group-hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.5)] transition-all">
                {m.title}
              </span>
              
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 text-xs text-zinc-500 transition-all group-hover:border-cyan-500 group-hover:bg-cyan-500 group-hover:text-black group-hover:shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                ▶
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {movies.length === 0 && (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-zinc-800 text-zinc-600 font-mono text-sm">
          NO DATA FOUND IN SECTOR...
        </div>
      )}
    </div>
  );
}