"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  FaGraduationCap,
  FaIdCard,
  FaLayerGroup,
  FaUniversity,
  FaArrowLeft,
} from "react-icons/fa";

const StudentProfile = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });

        if (res.data.success) {
          setProfile(res.data.user);
        }
      } catch (err) {
        console.error("Profile fetch error", err);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <p className="text-center mt-20 text-lg text-gray-600">
        Loading profile…
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 p-6 md:p-10">
      {/* Back */}
      <Link
        href="/dashboard/student"
        className="inline-flex items-center gap-2 mb-6 text-indigo-700 font-semibold hover:underline"
      >
        <FaArrowLeft /> Back to Dashboard
      </Link>

      {/* Profile Card */}
      <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
{/* Header */}
<div className="p-8 bg-white border-b flex flex-col md:flex-row items-center gap-6">
  <div className="w-28 h-28 rounded-full bg-gray-100 border-4 border-gray-200 flex items-center justify-center text-4xl font-bold text-gray-700">
    {profile.name?.charAt(0)}
  </div>

  <div className="text-center md:text-left">
    <h1 className="text-3xl font-bold text-gray-800">
      {profile.name}
    </h1>
    <p className="text-gray-500">{profile.email}</p>
  </div>
</div>


        {/* Details */}
        <div className="p-8 grid md:grid-cols-2 gap-6">
          <Info
            icon={<FaIdCard />}
            label="CRN"
            value={profile.CRN}
          />
          <Info
            icon={<FaIdCard />}
            label="URN"
            value={profile.URN || "—"}
          />
          <Info
            icon={<FaLayerGroup />}
            label="Section"
            value={profile.section}
          />
          <Info
            icon={<FaGraduationCap />}
            label="Year"
            value={profile.year}
          />
          <Info
            icon={<FaGraduationCap />}
            label="Semester"
            value={profile.semester}
          />
          <Info
            icon={<FaUniversity />}
            label="Branch"
            value={profile.branch?.name || "Not Assigned"}
          />
        </div>
      </div>
    </div>
  );
};

// ✨ Reusable Info Card
const Info = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition">
    <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default StudentProfile;


