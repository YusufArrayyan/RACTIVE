"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-secondary)" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold" style={{ background: "var(--accent)" }}>
            R
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "Satoshi, -apple-system, sans-serif" }}>
            Welcome back
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Sign in to your RACTIVE workspace
          </p>
        </div>

        {/* Card */}
        <div className="glass-card-solid p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "var(--red-light)", color: "var(--red)" }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm mt-6" style={{ color: "var(--text-tertiary)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold" style={{ color: "var(--accent)" }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
