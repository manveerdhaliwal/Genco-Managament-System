"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { User, Phone, Mail, BookOpen, Award, GraduationCap } from "lucide-react";

type Mentee = {
  _id: string;
  name: string;
  CRN: string;
  URN: string;
  email: string;
  section: string;
  year: number;
  branch: {
    _id: string;
    name: string;
  };
  studentInfo?: {
    fatherName: string;
    motherName: string;
    email: string;
    studentMobile: string;
    fatherMobile: string;
    motherMobile: string;
  };
};

export default function MentoringListPage() {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMentees();
  }, []);

  const fetchMentees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/teacher/mymentees", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to fetch mentees");
        setLoading(false);
        return;
      }

      setMentees(data.mentees || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching mentees:", err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  const filteredMentees = mentees.filter((mentee) => {
    const query = searchQuery.toLowerCase();
    return (
      mentee.name.toLowerCase().includes(query) ||
      mentee.CRN.toLowerCase().includes(query) ||
      mentee.URN.toLowerCase().includes(query) ||
      mentee.email.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your mentees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <Link
        href="/dashboard/teacher"
        className="mb-6 inline-flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full shadow hover:bg-green-600 transition duration-200"
        aria-label="Go back"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
        </svg>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-green-600" />
          My Mentees
        </h1>
        <p className="text-gray-600 mt-2">
          Students who have selected you as their advisor
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, CRN, URN, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Total Mentees</p>
          <p className="text-3xl font-bold text-gray-800">{mentees.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Filtered Results</p>
          <p className="text-3xl font-bold text-gray-800">{filteredMentees.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Unique Years</p>
          <p className="text-3xl font-bold text-gray-800">
            {new Set(mentees.map(m => m.year)).size}
          </p>
        </div>
      </div>

      {/* Mentees List */}
      {filteredMentees.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow text-center">
          <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">
            {searchQuery ? "No mentees found matching your search" : "No students have selected you as their advisor yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentees.map((mentee) => (
            <div
              key={mentee._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-200 overflow-hidden border border-gray-100"
            >
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{mentee.name}</h3>
                    <p className="text-sm opacity-90">Year {mentee.year} • Section {mentee.section}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className="text-sm"><strong>CRN:</strong> {mentee.CRN}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <Award className="w-4 h-4 text-gray-500" />
                  <span className="text-sm"><strong>URN:</strong> {mentee.URN}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm break-all">{mentee.email}</span>
                </div>

                {mentee.studentInfo?.studentMobile && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{mentee.studentInfo.studentMobile}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    <strong>Branch:</strong> {mentee.branch?.name || "N/A"}
                  </p>
                </div>

                {mentee.studentInfo && (
                  <div className="pt-3 border-t border-gray-200 space-y-1">
                    <p className="text-xs text-gray-600">
                      <strong>Father:</strong> {mentee.studentInfo.fatherName}
                    </p>
                    <p className="text-xs text-gray-600">
                      <strong>Mother:</strong> {mentee.studentInfo.motherName}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}