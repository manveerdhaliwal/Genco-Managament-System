// "use client";

// import Link from "next/link";
// import React, { useState, useEffect } from "react";
// import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
// import axios from "axios";

// const ProfileSection = () => {
//   const [profilePic, setProfilePic] = useState<string | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [profileData, setProfileData] = useState<any>(null);

//   // Fetch profile data from backend
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/student/me", {
//   withCredentials: true,
// });

//         if (res.data.success) {
//           setProfileData(res.data.student);
//         } else {
//           console.error("Failed to fetch profile:", res.data.message);
//         }
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//       }
//     };
//     fetchProfile();
//   }, []);

//   // Handle input change for editing
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setProfileData((prev: any) => ({ ...prev, [name]: value }));
//   };

//   // Handle image upload (unchanged)
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = URL.createObjectURL(e.target.files[0]);
//       setProfilePic(file);
//     }
//   };

//   if (!profileData) return <p className="text-center mt-10">Loading profile...</p>;

//   return (
//     <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-8">
//       <Link
//         href="/dashboard/student"
//         className="mb-4 inline-flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition duration-200"
//         aria-label="Go back"
//       >
//         <svg
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
//         </svg>
//       </Link>

//       <div className="flex justify-end mb-6">
//         {/* <button
//           onClick={() => alert("Logging out...")}
//           className="px-5 py-2 rounded-xl bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition"
//         >
//           Logout
//         </button> */}
//       </div>

//       <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8 grid md:grid-cols-3 gap-8">
//         {/* Left: Profile */}
//         <div className="col-span-1 flex flex-col items-center text-center">
//           <div className="relative">
//             <img
//               src={profilePic || "https://via.placeholder.com/150"}
//               alt=""
//               className="w-40 h-40 rounded-full border-4 border-indigo-300 shadow-lg object-cover"
//             />
//             <label className="absolute bottom-2 right-2 bg-indigo-500 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-indigo-600 transition">
//               ✏️
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleImageUpload}
//               />
//             </label>
//           </div>

//           {isEditing ? (
//             <input
//               type="text"
//               name="name"
//               value={profileData.name}
//               onChange={handleChange}
//               className="mt-4 text-center border rounded-lg p-2 w-full"
//             />
//           ) : (
//             <h2 className="mt-4 text-2xl font-bold text-gray-800">{profileData.name}</h2>
//           )}

//           <p className="text-gray-500">Roll No: {profileData.rollNo}</p>
//           <p className="text-lg font-medium text-indigo-600">{profileData.department}</p>
//           <p className="text-sm mt-1 text-gray-500">{profileData.year}</p>

//           <button
//             onClick={() => setIsEditing(!isEditing)}
//             className="mt-5 px-5 py-2 rounded-xl bg-indigo-500 text-white font-semibold shadow hover:bg-indigo-600 transition"
//           >
//             {isEditing ? "Save Profile" : "Edit Profile"}
//           </button>

//           <div className="flex justify-center gap-6 mt-6 text-2xl text-gray-600">
//             {profileData.linkedin && (
//               <a
//                 href={profileData.linkedin}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="hover:text-blue-600 transition"
//               >
//                 <FaLinkedin />
//               </a>
//             )}
//             {profileData.github && (
//               <a
//                 href={profileData.github}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="hover:text-gray-900 transition"
//               >
//                 <FaGithub />
//               </a>
//             )}
//             {profileData.instagram && (
//               <a
//                 href={profileData.instagram}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="hover:text-pink-500 transition"
//               >
//                 <FaInstagram />
//               </a>
//             )}
//           </div>
//         </div>

//         {/* Right: Details */}
//         <div className="col-span-2 space-y-6">
//           {/* Personal Info */}
//           <div className="bg-gray-50 p-6 rounded-xl shadow">
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
//             <div className="grid md:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Date of Birth</label>
//                 {isEditing ? (
//                   <input
//                     type="date"
//                     name="dob"
//                     value={profileData.dob}
//                     onChange={handleChange}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 ) : (
//                   <p className="text-gray-700">{profileData.dob}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Gender</label>
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     name="gender"
//                     value={profileData.gender}
//                     onChange={handleChange}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 ) : (
//                   <p className="text-gray-700">{profileData.gender}</p>
//                 )}
//               </div>
//             </div>

//             <div className="mt-4">
//               <label className="text-sm font-medium text-gray-600">Address</label>
//               {isEditing ? (
//                 <textarea
//                   name="address"
//                   value={profileData.address}
//                   onChange={handleChange}
//                   className="w-full border rounded-lg p-2"
//                 />
//               ) : (
//                 <p className="text-gray-700">{profileData.address}</p>
//               )}
//             </div>
//           </div>

//           {/* Contact Info */}
//           <div className="bg-gray-50 p-6 rounded-xl shadow">
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Contact Information</h3>
//             <div className="grid md:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Email</label>
//                 {isEditing ? (
//                   <input
//                     type="email"
//                     name="email"
//                     value={profileData.email}
//                     onChange={handleChange}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 ) : (
//                   <p className="text-gray-700">{profileData.email}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Phone</label>
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     name="phone"
//                     value={profileData.phone}
//                     onChange={handleChange}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 ) : (
//                   <p className="text-gray-700">{profileData.phone}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileSection;





// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Link from "next/link";

// const StudentProfile = () => {
//   const [profile, setProfile] = useState<any>(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/auth/me", {
//           withCredentials: true,
//         });

//         if (res.data.success) {
//           setProfile(res.data.user);
//         }
//       } catch (err) {
//         console.error("Profile fetch error", err);
//       }
//     };

//     fetchProfile();
//   }, []);

//   if (!profile) {
//     return <p className="text-center mt-10">Loading profile...</p>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <Link
//         href="/dashboard/student"
//         className="text-indigo-600 font-semibold mb-6 inline-block"
//       >
//         ← Back to Dashboard
//       </Link>

//       <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
//         <h1 className="text-3xl font-bold mb-6">Student Profile</h1>

//         <div className="space-y-3 text-gray-700">
//           <p><b>Name:</b> {profile.name}</p>
//           <p><b>Username:</b> {profile.username}</p>
//           <p><b>Email:</b> {profile.email}</p>
//           <p><b>CRN:</b> {profile.CRN}</p>
//           <p><b>URN:</b> {profile.URN || "—"}</p>
//           <p><b>Section:</b> {profile.section}</p>
//           <p><b>Year:</b> {profile.year}</p>
//           <p><b>Semester:</b> {profile.semester}</p>
//           <p><b>Branch:</b> {profile.branch?.name}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentProfile;



// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Link from "next/link";

// const StudentProfile = () => {
//   const [profile, setProfile] = useState<any>(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/auth/me", {
//           withCredentials: true,
//         });

//         if (res.data.success) {
//           setProfile(res.data.user);
//         }
//       } catch (err) {
//         console.error("Profile fetch error", err);
//       }
//     };

//     fetchProfile();
//   }, []);

//   if (!profile) {
//     return <p className="text-center mt-10">Loading profile...</p>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
//       {/* Back */}
//       <Link
//         href="/dashboard/student"
//         className="inline-block mb-6 text-indigo-600 font-semibold hover:underline"
//       >
//         ← Back to Dashboard
//       </Link>

//       {/* Card */}
//       <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
//         {/* Header */}
//         <div className="flex items-center gap-6 mb-8">
//           <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
//             {profile.name?.charAt(0)}
//           </div>

//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">
//               {profile.name}
//             </h1>
//             <p className="text-gray-500">{profile.email}</p>
//           </div>
//         </div>

//         {/* Info Grid */}
//         <div className="grid md:grid-cols-2 gap-6">
//           {/* <Info label="Username" value={profile.username} /> */}
//           <Info label="CRN" value={profile.CRN} />
//           <Info label="URN" value={profile.URN || "—"} />
//           <Info label="Section" value={profile.section} />
//           <Info label="Year" value={profile.year} />
//           <Info label="Semester" value={profile.semester} />
//           <Info
//             label="Branch"
//             value={profile.branch?.name || "Not Assigned"}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// // Reusable info component
// const Info = ({ label, value }: { label: string; value: string }) => (
//   <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
//     <p className="text-sm text-gray-500">{label}</p>
//     <p className="text-lg font-semibold text-gray-800">{value}</p>
//   </div>
// );

// export default StudentProfile;



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
