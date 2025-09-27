"use client";
import React, { useState } from "react";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

const ProfileSection = () => {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: "Ritika Gupta",
    rollNo: "2203542",
    department: "Computer Science Engineering",
    year: "2nd Year",
    dob: "2003-03-12",
    gender: "Female",
    address: "Ludhiana, Punjab",
    email: "ritika@example.com",
    phone: "+91 98765 43210",
    linkedin: "https://linkedin.com/in/ritika",
    github: "https://github.com/ritika",
    instagram: "https://instagram.com/ritika",
  });

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = URL.createObjectURL(e.target.files[0]);
      setProfilePic(file);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-8">
      {/* Header */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => alert("Logging out...")}
          className="px-5 py-2 rounded-xl bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8 grid md:grid-cols-3 gap-8">
        {/* Left: Profile */}
        <div className="col-span-1 flex flex-col items-center text-center">
          {/* Profile Photo */}
          <div className="relative">
            <img
              src={profilePic || "https://via.placeholder.com/150"}
              alt=""
              className="w-40 h-40 rounded-full border-4 border-indigo-300 shadow-lg object-cover"
            />
            <label className="absolute bottom-2 right-2 bg-indigo-500 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-indigo-600 transition">
              ✏️
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Info */}
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              className="mt-4 text-center border rounded-lg p-2 w-full"
            />
          ) : (
            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              {profileData.name}
            </h2>
          )}
          <p className="text-gray-500">Roll No: {profileData.rollNo}</p>
          <p className="text-lg font-medium text-indigo-600">
            {profileData.department}
          </p>
          <p className="text-sm mt-1 text-gray-500">{profileData.year}</p>

          {/* Edit / Save Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="mt-5 px-5 py-2 rounded-xl bg-indigo-500 text-white font-semibold shadow hover:bg-indigo-600 transition"
          >
            {isEditing ? "Save Profile" : "Edit Profile"}
          </button>

          {/* Social Links as Icons */}
          <div className="flex justify-center gap-6 mt-6 text-2xl text-gray-600">
            {profileData.linkedin && (
              <a
                href={""}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition"
              >
                <FaLinkedin />
              </a>
            )}
            {profileData.github && (
              <a
                href={""}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition"
              >
                <FaGithub />
              </a>
            )}
            {profileData.instagram && (
              <a
                href={""}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition"
              >
                <FaInstagram />
              </a>
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-gray-50 p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Personal Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dob"
                    value={profileData.dob}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  />
                ) : (
                  <p className="text-gray-700">{profileData.dob}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Gender
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="gender"
                    value={profileData.gender}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  />
                ) : (
                  <p className="text-gray-700">{profileData.gender}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-600">
                Address
              </label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={profileData.address}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
              ) : (
                <p className="text-gray-700">{profileData.address}</p>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Contact Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  />
                ) : (
                  <p className="text-gray-700">{profileData.email}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  />
                ) : (
                  <p className="text-gray-700">{profileData.phone}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
