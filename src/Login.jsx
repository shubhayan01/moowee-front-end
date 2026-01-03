import { useState } from "react";
import { API } from "./Api";

export default function Login({ onLogin, onSignupClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e?.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });
      const token = res.data.token;

      localStorage.setItem("token", token);
      onLogin({ token, ...res.data.user });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || !email.trim() || !password;

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      {/* Subtle, professional background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#070A12] via-[#070A12] to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.18),transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-md items-center px-6 py-10">
        <div className="w-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
            <div className="p-8">
              <div className="mb-8">
                <div className="text-sm font-medium tracking-wide text-blue-200/70">
                  MOOWEE
                </div>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  Sign in
                </h1>
                <p className="mt-2 text-sm text-white/60">
                  Use your email and password to access your account.
                </p>
              </div>

              <form onSubmit={login} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white/80"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      autoComplete="email"
                      className="block w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30
                                 outline-none transition
                                 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/15"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-white/80"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="block w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30
                                 outline-none transition
                                 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/15"
                    />
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={disabled}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white
                             shadow-[0_10px_30px_rgba(59,130,246,0.25)]
                             transition
                             hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20
                             disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading && (
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    />
                  )}
                  {loading ? "Signing in..." : "Sign in"}
                </button>

                <div className="pt-1 text-center text-xs text-white/45">
                  Protected by secure authentication.
                </div>
              </form>
            </div>

            {/* Subtle accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
            <div className="px-8 py-5 text-center text-xs text-white/45">
              Don't have an account?{" "}
              <button
                onClick={onSignupClick}
                className="text-blue-400 hover:text-blue-300 font-semibold transition"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}