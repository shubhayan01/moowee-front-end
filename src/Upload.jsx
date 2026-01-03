import { useState } from "react";
import { API } from "./Api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedId, setUploadedId] = useState("");

  const upload = async () => {
    if (!file) return setStatus("Select a file first");
    if (!title.trim()) return setStatus("Enter a title first");

    setUploading(true);
    setStatus("");
    const form = new FormData();
    form.append("movie", file);
    form.append("title", title);
    form.append("tittle", title);

    try {
      const res = await API.post("/movies/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const movieId = res.data.movie._id;
      setUploadedId(movieId);
      setStatus("✓ Uploaded successfully!");
      setFile(null);
      setTitle("");
    } catch (err) {
      setStatus("❌ Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl p-4 pb-20">
      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-5xl font-black uppercase tracking-widest text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
          Data <span className="text-cyan-400">Upload</span>
        </h2>
        <div className="mx-auto mt-2 h-1 w-32 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      </div>

      {/* Main Terminal Box */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-zinc-950/80 p-8 shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)] backdrop-blur-xl">
        
        {/* Background Grid Effect */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />

        <div className="relative z-10">
          {/* Title Input */}
          <div className="mb-8">
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-cyan-500/80">
              Target Designation (Title)
            </label>
            <input
              type="text"
              placeholder="Enter movie title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded bg-black/60 border border-cyan-500/30 p-4 font-mono text-lg text-cyan-100 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] placeholder:text-cyan-900/50"
            />
          </div>

          {/* File Drop Zone */}
          <div className="mb-8">
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-cyan-500/80">
              Select Payload (Video File)
            </label>
            <div className="relative group">
              <input
                type="file"
                accept="video/*"
                onChange={e => setFile(e.target.files[0])}
                className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
              />
              <div className="rounded-lg border-2 border-dashed border-cyan-800 bg-cyan-900/10 p-8 text-center transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-900/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                <div className="text-cyan-500 group-hover:text-cyan-300 transition-colors">
                  <svg className="mx-auto mb-3 h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="font-mono text-sm font-bold uppercase">Click to Upload or Drag Here</p>
                  <p className="mt-1 text-xs text-cyan-800 group-hover:text-cyan-600">{file ? file.name : "Supports MP4, MOV, AVI"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <button
            onClick={upload}
            disabled={uploading}
            className={`w-full rounded py-4 font-black uppercase tracking-[0.2em] text-black transition-all duration-300
              ${uploading 
                ? 'cursor-not-allowed bg-cyan-800/50 text-cyan-500/50 shadow-none' 
                : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] active:scale-[0.99]'
              }`}
          >
            {uploading ? "Processing..." : "Initialize Upload"}
          </button>

          {/* Status Log */}
          {status && (
            <div className={`mt-6 border-l-4 p-4 font-mono text-sm font-bold uppercase animate-in fade-in slide-in-from-bottom-2
              ${status.includes("✓") 
                ? 'border-green-500 bg-green-900/10 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
                : 'border-red-500 bg-red-900/10 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              }`}>
              {status}
            </div>
          )}

          {/* Success / ID Box */}
          {uploadedId && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative rounded-lg border border-green-500/50 bg-black/40 p-1">
                <div className="absolute -top-3 left-4 bg-black px-2 text-xs font-bold text-green-400">
                  ACCESS KEY GENERATED
                </div>
                <div className="p-4">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-green-500/60">
                    Movie ID
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      readOnly
                      value={uploadedId}
                      className="flex-1 rounded bg-green-900/10 border border-green-500/30 p-3 font-mono text-green-400 outline-none"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(uploadedId)}
                      className="rounded border border-green-500/50 bg-green-900/20 px-6 font-bold uppercase text-green-400 transition hover:bg-green-500 hover:text-black"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-green-800">
                    Use this ID to stream the movie or create a watch party.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}