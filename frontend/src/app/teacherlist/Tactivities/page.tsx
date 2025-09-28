"use client";
import Link from "next/link";
import { useState } from "react";

interface ActivityData {
  studentName: string;
  section: string;
  year: string;
  societyName: string;
  role: string;
  duration: string;
  description: string;
}

// Dummy data; can be replaced with API fetch
const allActivities: ActivityData[] = [
  {
    studentName: "Ritika Gupta",
    section: "A",
    year: "Final",
    societyName: "Coding Club",
    role: "President",
    duration: "Jan 2024 - May 2024",
    description: "Organized coding contests and workshops.",
  },
  {
    studentName: "Aman Sharma",
    section: "B",
    year: "3rd",
    societyName: "Robotics Society",
    role: "Member",
    duration: "Feb 2024 - Jun 2024",
    description: "Assisted in robot design and competitions.",
  },
  {
    studentName: "Neha Singh",
    section: "A",
    year: "Final",
    societyName: "Drama Club",
    role: "Secretary",
    duration: "Mar 2023 - Jul 2023",
    description: "Managed events and rehearsals for plays.",
  },
];

const years = ["Final", "3rd", "2nd"];
const sections = ["All", "A", "B"];

export default function TeacherActivitiesPage() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | null>(null);

  const filteredActivities = allActivities
    .filter(a => a.year === selectedYear)
    .filter(a => selectedSection === "All" || a.section === selectedSection);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF]">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Back Button */}
        <Link
          href={`/dashboard/teacher`}
          className="mb-4 inline-flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition duration-200"
          aria-label="Go back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>

        {/* Year Selection */}
        {!selectedYear && (
          <>
            <h1 className="text-3xl font-bold text-indigo-700 mb-4">Select Year</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {years.map((year) => (
                <div
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-xl transition"
                >
                  <h2 className="text-xl font-semibold text-indigo-700">{year} Year</h2>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Activities Table */}
        {selectedYear && (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-indigo-700 mb-4">{selectedYear} Year Activities</h1>
              <button
                onClick={() => {
                  setSelectedYear(null);
                  setSelectedSection("All");
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
              >
                Back
              </button>
            </div>

            {/* Section Filter */}
            <div className="mb-4 flex gap-4 items-center">
              <span className="font-medium text-gray-700">Filter by Section:</span>
              <select
                className="border border-gray-300 rounded-xl px-4 py-2"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                {sections.map((sec) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto shadow-md rounded-2xl bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Student</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Section</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Society</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Duration</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredActivities.map((activity, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{activity.studentName}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{activity.section}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{activity.societyName}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{activity.role}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{activity.duration}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedActivity(activity)}
                          className="bg-indigo-600 text-white px-4 py-1 rounded-xl hover:bg-indigo-700 transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Popup / Modal */}
        {selectedActivity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-6 max-w-3xl w-full relative">
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">{selectedActivity.studentName} - {selectedActivity.societyName}</h2>
              <p className="mb-2"><strong>Section:</strong> {selectedActivity.section}</p>
              <p className="mb-2"><strong>Role:</strong> {selectedActivity.role}</p>
              <p className="mb-2"><strong>Duration:</strong> {selectedActivity.duration}</p>
              <p className="mb-2"><strong>Description:</strong> {selectedActivity.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
