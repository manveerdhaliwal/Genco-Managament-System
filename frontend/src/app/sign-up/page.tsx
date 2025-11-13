"use client";

import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface Branch {
  _id: string;
  name: string;
}

export default function SignupPage() {
  const [role, setRole] = useState<"" | "teacher" | "student">("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const sections = ["A", "B", "C", "D", "E", "F"]; // ✅ Section options

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/branches");
        const data = await res.json();
        if (res.ok) setBranches(data.branches);
        else console.error("Failed to fetch branches:", data.message);
      } catch (err) {
        console.error("Error fetching branches:", err);
      }
    };
    fetchBranches();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setError("Please select a role!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role, ...formData }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      console.log("Signup successful:", data);
      alert("Signup successful!");
      setError("");
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EDF9FD]">
      <div className="flex w-full max-w-5xl shadow-2xl rounded-3xl overflow-hidden">
        {/* Left info panel */}
        <div
          className="hidden md:flex flex-col justify-center p-12 w-1/2"
          style={{ backgroundColor: "#CFCEFF" }}
        >
          <h2 className="text-4xl font-bold text-black mb-6">
            Create Your Account
          </h2>
          <p className="text-[#687076] text-lg">
            Choose your role and fill in the details to get started.
          </p>
        </div>

        {/* Right sign-up form */}
        <div className="w-full md:w-1/2 bg-white p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-black mb-8 text-center">
            Sign Up
          </h1>

          {error && (
            <p className="text-red-500 mb-4 text-center font-medium">{error}</p>
          )}

          <form className="flex flex-col gap-6" onSubmit={handleSignup}>
            {/* Role Selection */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "teacher" | "student")}
              className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CFCEFF] transition"
              style={{ backgroundColor: "#F1F0FF" }}
              required
            >
              <option value="">Select Role</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>

            {/* Common Fields */}
            {role && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  required
                  className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CFCEFF]"
                  style={{ backgroundColor: "#F1F0FF" }}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                  required
                  className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CFCEFF]"
                  style={{ backgroundColor: "#F1F0FF" }}
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                  required
                  className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CFCEFF]"
                  style={{ backgroundColor: "#F1F0FF" }}
                />

                {/* Password with show/hide */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CFCEFF] w-full pr-12"
                    style={{ backgroundColor: "#F1F0FF" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-black"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            )}

            {/* Teacher Fields */}
            {role === "teacher" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <select
                  name="branch"
                  onChange={handleChange}
                  required
                  className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CFCEFF]"
                  style={{ backgroundColor: "#F1F0FF" }}
                >
                  <option value="">Select Branch</option>
                  {branches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  name="Emp_id"
                  placeholder="Employee ID"
                  onChange={handleChange}
                  required
                  className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CFCEFF]"
                  style={{ backgroundColor: "#F1F0FF" }}
                />
              </div>
            )}

            {/* Student Fields */}
            {role === "student" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <select
                  name="branch"
                  onChange={handleChange}
                  required
                  className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CFCEFF]"
                  style={{ backgroundColor: "#F1F0FF" }}
                >
                  <option value="">Select Branch</option>
                  {branches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  name="year"
                  placeholder="Year"
                  onChange={handleChange}
                  required
                  className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CFCEFF]"
                  style={{ backgroundColor: "#F1F0FF" }}
                />

                {/* ✅ Section dropdown */}
                <select
                  name="section"
                  onChange={handleChange}
                  required
                  className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CFCEFF]"
                  style={{ backgroundColor: "#F1F0FF" }}
                >
                  <option value="">Select Section</option>
                  {sections.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  name="semester"
                  placeholder="Semester"
                  onChange={handleChange}
                  required
                  className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CFCEFF]"
                  style={{ backgroundColor: "#F1F0FF" }}
                />
                <input
                  type="text"
                  name="CRN"
                  placeholder="CRN"
                  onChange={handleChange}
                  required
                  className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CFCEFF]"
                  style={{ backgroundColor: "#F1F0FF" }}
                />
                <input
                  type="text"
                  name="URN"
                  placeholder="URN"
                  onChange={handleChange}
                  required
                  className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CFCEFF]"
                  style={{ backgroundColor: "#F1F0FF" }}
                />
              </div>
            )}

            {role && (
              <button
                type="submit"
                className="p-4 rounded-xl font-semibold transition transform hover:scale-105"
                style={{ backgroundColor: "#FAE27C", color: "#000" }}
              >
                Sign Up
              </button>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-[#687076]">
            Already have an account?{" "}
            <a href="/sign-in" className="font-medium underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
