import { useState } from "react";
import { API } from "./Api";

export default function Signup({ onSignup }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validation
    if (!name.trim()) return setError("Name is required");
    if (!email.trim()) return setError("Email is required");
    if (password.length < 6)
      return setError("Password must be at least 6 characters");
    if (password !== confirmPassword)
      return setError("Passwords do not match");

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await API.post("/auth/signup", {
        name,
        email,
        password,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setSuccess("Account created successfully!");
      onSignup?.({ token, ...user });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const disabled =
    loading || !name.trim() || !email.trim() || !password || !confirmPassword;

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#070A12] via-[#070A12] to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.18),transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-md items-center px-6 py-10">
        <div className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
          <div className="p-8">
            <div className="mb-8">
              <div className="text-sm font-medium tracking-wide text-blue-200/70">
                MOOWEE
              </div>
              <h1 className="mt-2 text-2xl font-semibold">Create Account</h1>
              <p className="mt-2 text-sm text-white/60">
                Join MOOWEE to start watch parties and share experiences.
              </p>
            </div>

            <form onSubmit={signup} className="space-y-5">
              <Input
                label="Full Name"
                id="name"
                value={name}
                onChange={setName}
                placeholder="John Doe"
              />

              <Input
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@company.com"
              />

              <Input
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Create a strong password"
              />

              <Input
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Confirm your password"
              />

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-100">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={disabled}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold
                           transition hover:bg-blue-400 disabled:opacity-50"
              >
                {loading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <div className="text-center text-xs text-white/45">
                Your data is secure and encrypted.
              </div>
            </form>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />

          <div className="px-8 py-5 text-center text-xs text-white/45">
            Already have an account?{" "}
            <a href="/" className="text-blue-400 font-semibold">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small reusable input component */
function Input({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white/80">
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="block w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white
                     placeholder:text-white/30 outline-none
                     focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/15"
        />
      </div>
    </div>
  );
}
