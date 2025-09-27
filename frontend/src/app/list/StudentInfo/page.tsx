"use client";

import { useState, ChangeEvent, FormEvent } from "react";

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
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = ["General", "OBC", "SC", "ST", "Other"];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex justify-center items-start p-6 bg-gray-100">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 mt-10 border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-8 text-indigo-700">
          🎓 Student Information
        </h2>

        {!isSubmitted ? (
          // ===== FORM =====
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
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
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-200"
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
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-200"
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
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-200"
                rows={2}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 focus:ring-2 focus:ring-indigo-200"
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
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-200"
              />
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
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-200"
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
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-200"
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
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-200"
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
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-200"
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
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-200"
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
          // ===== SUBMITTED DETAILS =====
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="bg-indigo-50 p-6 rounded-xl shadow-md border-l-4 border-indigo-600">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">
                👨‍👩‍👧 Personal Info
              </h3>
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
                <strong>Category:</strong> {formData.category}
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-teal-50 p-6 rounded-xl shadow-md border-l-4 border-teal-400">
              <h3 className="text-xl font-semibold text-teal-700 mb-3">
                📞 Contact Info
              </h3>
              <p>
                <strong>Email:</strong> {formData.email}
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
                <strong>Address:</strong> {formData.permanentAddress}
              </p>
            </div>

            {/* Academic Info */}
            <div className="bg-yellow-50 p-6 rounded-xl shadow-md border-l-4 border-yellow-400">
              <h3 className="text-xl font-semibold text-yellow-700 mb-3">
                📘 Academic Info
              </h3>
              <p>
                <strong>Admission Date:</strong> {formData.admissionDate}
              </p>
              <p>
                <strong>Passing Year:</strong> {formData.passingYear}
              </p>
            </div>

            {/* Edit Button */}
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



