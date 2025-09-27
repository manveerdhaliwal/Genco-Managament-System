"use client";

import Link from "next/link";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

import axios from "axios";


interface StudentFormData {
  fatherName: string;
  motherName: string;
  permanentAddress: string;
  email: string;
  category: string;
  dob: string;
  studentMobile: string;
  fatherMobile: string;
  motherMobile: string;
  admissionDate: string;
  passingYear: string;
  advisor: string; // NEW FIELD
}

interface Teacher {
  _id: string;
  name: string;
  email: string;
}

export default function StudentInfo() {

  const [formData, setFormData] = useState<StudentFormData>({
    fatherName: "",
    motherName: "",
    permanentAddress: "",
    email: "",
    category: "",
    dob: "",
    studentMobile: "",
    fatherMobile: "",
    motherMobile: "",
    admissionDate: "",
    passingYear: "",
    advisor: "", // default empty
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const categories = ["General", "OBC", "SC", "ST", "Other"];

  // Default test advisors
  const defaultTeachers: Teacher[] = [
    { _id: "1", name: "Test Teacher 1", email: "teacher1@test.com" },
    { _id: "2", name: "Test Teacher 2", email: "teacher2@test.com" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Normally fetch teachers from backend
        // const tRes = await axios.get("http://localhost:5000/api/teachers", {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // if (tRes.data.success) {
        //   setTeachers(tRes.data.data);
        // } else {
        //   setTeachers(defaultTeachers);
        // }

        // For now, use default test teachers
        setTeachers(defaultTeachers);

        // fetch student info
        const res = await axios.get("http://localhost:5000/api/student-info/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success && res.data.data) {
          setFormData({
            ...res.data.data,
            dob: res.data.data.dob?.split("T")[0] || "",
            admissionDate: res.data.data.admissionDate?.split("T")[0] || "",
            passingYear: res.data.data.passingYear?.toString() || "",
            advisor: res.data.data.advisor?._id || "",
          });
          setIsSubmitted(true);
        }
      } catch (err) {
        console.log("No existing info found");
        setTeachers(defaultTeachers); // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
     const res = await axios.post(
  "http://localhost:5000/api/student-info/save",
  formData,
  {
    withCredentials: true, // <--- this sends cookies
    headers: {
      "Content-Type": "application/json",
    },
  }
);
      if (res.data.success) {
        setIsSubmitted(true);
        alert("Info saved successfully!");
      }
    } catch (err) {
      console.error("Error saving student info:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    
    <div className="min-h-screen flex justify-center items-start p-6 bg-gray-100">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 mt-10 border border-gray-200">
  <Link
    href="/dashboard/student"
    className="mb-4 inline-flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition duration-200"
    aria-label="Go back"
  >
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
    </svg>
  </Link>
        <h2 className="text-3xl font-bold text-center mb-8 text-indigo-700">
          🎓 Student Information
        </h2>

        {!isSubmitted ? (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Father's Name */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Father&apos;s Name</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            {/* Mother's Name */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Mother&apos;s Name</label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            {/* Permanent Address */}
            <div className="md:col-span-3">
              <label className="block mb-1 text-gray-700 font-medium">Permanent Address</label>
              <textarea
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2"
                rows={2}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            {/* Advisor */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Advisor</label>
              <select
                name="advisor"
                value={formData.advisor}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
              >
                <option value="">Select Advisor</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name} ({teacher.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Student Mobile */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Student Mobile</label>
              <input
                type="tel"
                name="studentMobile"
                value={formData.studentMobile}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2"
                pattern="[0-9]{10}"
                placeholder="10-digit number"
              />
            </div>

            {/* Father Mobile */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Father Mobile</label>
              <input
                type="tel"
                name="fatherMobile"
                value={formData.fatherMobile}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2"
                pattern="[0-9]{10}"
                placeholder="10-digit number"
              />
            </div>

            {/* Mother Mobile */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Mother Mobile</label>
              <input
                type="tel"
                name="motherMobile"
                value={formData.motherMobile}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2"
                pattern="[0-9]{10}"
                placeholder="10-digit number"
              />
            </div>

            {/* Admission Date */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Admission Date</label>
              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            {/* Passing Year */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Passing Year</label>
              <input
                type="number"
                name="passingYear"
                value={formData.passingYear}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2"
                min={1900}
                max={2099}
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-3 flex justify-center">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all"
              >
                Submit 🚀
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-6 rounded-xl shadow-md border-l-4 border-indigo-600">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">
                👨‍👩‍👧 Personal Info
              </h3>
              <p><strong>Father&apos;s Name:</strong> {formData.fatherName}</p>
              <p><strong>Mother&apos;s Name:</strong> {formData.motherName}</p>
              <p><strong>Date of Birth:</strong> {formData.dob}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Permannent address:</strong> {formData.permanentAddress}</p>
              <p><strong>Category:</strong> {formData.category}</p>
              <p><strong>Student mobile:</strong> {formData.studentMobile}</p>
              <p><strong>Father mobile:</strong> {formData.fatherMobile}</p>
              <p><strong>Mother mobile:</strong> {formData.motherMobile}</p>
              <p><strong>Admission date:</strong> {formData.admissionDate}</p>
              <p><strong>Passing year:</strong> {formData.passingYear}</p>
              <p><strong>Advisor:</strong> 
                {teachers.find((t) => t._id === formData.advisor)?.name || "N/A"}
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-2 rounded-lg shadow-md transition-all"
              >
                Edit ✏️
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
