"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "teacher" | "student">("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // URLs for each role
  const roleUrls: Record<"admin" | "teacher" | "student", string> = {
    admin: "/dashboard/admin",
    teacher: "/dashboard/teacher",
    student: "/dashboard/student",
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ include cookies
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed!");
        setLoading(false);
        return;
      }

      console.log("Login success:", data);

      // ✅ IMPORTANT: Store the token in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("Token stored in localStorage:", data.token);
      } else {
        console.warn("No token received from backend!");
      }

      // ✅ Store user info
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("User info stored:", data.user);
      }

      // ✅ Redirect based on role
      router.push(roleUrls[role]);
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EDF9FD]">
      {/* Card */}
      <div className="flex w-full max-w-4xl shadow-2xl rounded-3xl overflow-hidden">
        {/* Left info panel */}
        <div
          className="hidden md:flex flex-col justify-center p-12 w-1/2"
          style={{ backgroundColor: "#CFCEFF" }}
        >
          <h2 className="text-4xl font-bold text-black mb-6">Welcome Back!</h2>
          <p className="text-[#687076] text-lg">
            Login to access your dashboard. Select your role and enter credentials to continue.
          </p>
        </div>

        {/* Right login form */}
        <div className="w-full md:w-1/2 bg-white p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-black mb-8 text-center">
            Sign In
          </h1>

          {error && (
            <p className="text-red-500 mb-4 text-center font-medium">{error}</p>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CFCEFF] transition"
              style={{ backgroundColor: "#F1F0FF" }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CFCEFF] transition"
              style={{ backgroundColor: "#F1F0FF" }}
            />

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "admin" | "teacher" | "student")
              }
              className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CFCEFF] transition"
              style={{ backgroundColor: "#F1F0FF" }}
            >
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="p-4 rounded-xl font-semibold transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#FAE27C", color: "#000" }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#687076]">
            Forgot your password? Contact admin.
          </p>
        </div>
      </div>
    </div>
  );
}