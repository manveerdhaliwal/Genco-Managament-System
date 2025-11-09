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
  advisor: string;
}

interface Teacher {
  _id: string;
  name: string;
  email: string;
  Emp_id?: string;
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
    advisor: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [error, setError] = useState("");

  const categories = ["General", "OBC", "SC", "ST", "Other"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        console.log("Token from localStorage:", token); // Debug log

        if (!token) {
          setError("No authentication token found. Please log in.");
          setLoading(false);
          return;
        }

        // Fetch advisors from same branch first
        const advisorsRes = await axios.get(
          "http://localhost:5000/api/advisors/my-advisors",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        console.log("Advisors response:", advisorsRes.data);

        if (advisorsRes.data.success) {
          setTeachers(advisorsRes.data.data);
        }

        // Try to fetch existing student info
        try {
          const studentInfoRes = await axios.get(
            "http://localhost:5000/api/student-info/me",
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );

          console.log("Student info response:", studentInfoRes.data);

          if (studentInfoRes.data.success && studentInfoRes.data.data) {
            const info = studentInfoRes.data.data;

            setFormData({
              fatherName: info.fatherName || "",
              motherName: info.motherName || "",
              permanentAddress: info.permanentAddress || "",
              email: info.email || "",
              category: info.category || "",
              dob: info.dob?.split("T")[0] || "",
              studentMobile: info.studentMobile || "",
              fatherMobile: info.fatherMobile || "",
              motherMobile: info.motherMobile || "",
              admissionDate: info.admissionDate?.split("T")[0] || "",
              passingYear: info.passingYear?.toString() || "",
              advisor: info.advisor?._id || "",
            });

            setIsSubmitted(true);
          }
        } catch (infoErr: any) {
          // If 404, student hasn't filled info yet - that's okay
          if (infoErr.response?.status !== 404) {
            console.error("Error fetching student info:", infoErr);
          }
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to fetch advisors");
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
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setIsSubmitted(true);
        alert("Info saved successfully!");
      }
    } catch (err: any) {
      console.error("Error saving student info:", err);
      alert(err.response?.data?.message || "Failed to save information");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-red-50 border-2 border-red-200 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-red-700 mb-2">⚠️ Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

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
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Father's Name */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Father&apos;s Name
              </label>
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
              <label className="block mb-1 text-gray-700 font-medium">
                Mother&apos;s Name
              </label>
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
              <label className="block mb-1 text-gray-700 font-medium">
                Permanent Address
              </label>
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
              <label className="block mb-1 text-gray-700 font-medium">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            {/* Advisor - UPDATED */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Advisor (Same Branch)
              </label>
              <select
                name="advisor"
                value={formData.advisor}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
              >
                <option value="">Select Advisor</option>
                {teachers.length > 0 ? (
                  teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name} - {teacher.email}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No advisors available
                  </option>
                )}
              </select>
              {teachers.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  No teachers found in your branch
                </p>
              )}
            </div>

            {/* Student Mobile */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Student Mobile
              </label>
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
              <label className="block mb-1 text-gray-700 font-medium">
                Father Mobile
              </label>
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
              <label className="block mb-1 text-gray-700 font-medium">
                Mother Mobile
              </label>
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
              <label className="block mb-1 text-gray-700 font-medium">
                Admission Date
              </label>
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
              <label className="block mb-1 text-gray-700 font-medium">
                Passing Year
              </label>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <p>
                  <strong>Father&apos;s Name:</strong> {formData.fatherName}
                </p>
                <p>
                  <strong>Mother&apos;s Name:</strong> {formData.motherName}
                </p>
                <p>
                  <strong>Date of Birth:</strong> {formData.dob}
                </p>
                <p>
                  <strong>Email:</strong> {formData.email}
                </p>
                <p>
                  <strong>Category:</strong> {formData.category}
                </p>
                <p>
                  <strong>Student Mobile:</strong> {formData.studentMobile}
                </p>
                <p>
                  <strong>Father Mobile:</strong> {formData.fatherMobile}
                </p>
                <p>
                  <strong>Mother Mobile:</strong> {formData.motherMobile}
                </p>
                <p>
                  <strong>Admission Date:</strong> {formData.admissionDate}
                </p>
                <p>
                  <strong>Passing Year:</strong> {formData.passingYear}
                </p>
              </div>
              <div className="mt-3">
                <p>
                  <strong>Permanent Address:</strong> {formData.permanentAddress}
                </p>
              </div>
              <div className="mt-4 p-4 bg-white rounded-lg border-2 border-indigo-200">
                <p className="text-lg">
                  <strong>📚 Academic Advisor:</strong>{" "}
                  {teachers.find((t) => t._id === formData.advisor)?.name || "N/A"}
                </p>
              </div>
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