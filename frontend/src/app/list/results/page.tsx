"use client";

import { useState, useEffect } from "react";

type Subject = {
  name: string;
  marksObtained: number;
  totalMarks: number;
  status: "Passed" | "Failed" | "Detained" | "Reappear";
  supplyClearedYear?: number;
};

type Result = {
  examYear: number;
  semester: string;
  subjects: Subject[];
};

export default function ResultsSection() {
  const [results, setResults] = useState<Result[]>([]);
  const [mostRecent, setMostRecent] = useState<Result | null>(null);

  useEffect(() => {
    // Mock data
    const mockResults: Result[] = [
      {
        examYear: 2023,
        semester: "Semester 4",
        subjects: [
          { name: "Mathematics", marksObtained: 80, totalMarks: 100, status: "Passed" },
          { name: "Physics", marksObtained: 45, totalMarks: 100, status: "Reappear", supplyClearedYear: 2024 },
          { name: "Chemistry", marksObtained: 60, totalMarks: 100, status: "Passed" },
        ],
      },
      {
        examYear: 2022,
        semester: "Semester 3",
        subjects: [
          { name: "Mathematics", marksObtained: 50, totalMarks: 100, status: "Passed" },
          { name: "Physics", marksObtained: 30, totalMarks: 100, status: "Detained" },
          { name: "Chemistry", marksObtained: 55, totalMarks: 100, status: "Passed" },
        ],
      },
      {
        examYear: 2021,
        semester: "Semester 2",
        subjects: [
          { name: "Mathematics", marksObtained: 75, totalMarks: 100, status: "Passed" },
          { name: "Physics", marksObtained: 65, totalMarks: 100, status: "Passed" },
          { name: "Chemistry", marksObtained: 70, totalMarks: 100, status: "Passed" },
        ],
      },
    ];

    setResults(mockResults);
    const sorted = [...mockResults].sort((a, b) => b.examYear - a.examYear);
    setMostRecent(sorted[0]);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">📊 Student Results</h2>

      {/* Most Recent Result */}
      {mostRecent && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700">
            Most Recent Result: {mostRecent.semester} ({mostRecent.examYear})
          </h3>
          <table className="w-full table-auto border-collapse mt-2">
            <thead>
              <tr className="bg-indigo-100">
                <th className="border px-4 py-2">Subject</th>
                <th className="border px-4 py-2">Marks Obtained</th>
                <th className="border px-4 py-2">Total Marks</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Supply Cleared Year</th>
              </tr>
            </thead>
            <tbody>
              {mostRecent.subjects.map((subj, idx) => (
                <tr
                  key={idx}
                  className={subj.status === "Detained" || subj.status === "Reappear" ? "bg-red-50" : ""}
                >
                  <td className="border px-4 py-2">{subj.name}</td>
                  <td className="border px-4 py-2">{subj.marksObtained}</td>
                  <td className="border px-4 py-2">{subj.totalMarks}</td>
                  <td className="border px-4 py-2">{subj.status}</td>
                  <td className="border px-4 py-2">{subj.supplyClearedYear || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* All Previous Semesters */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">All Previous Semesters</h3>
        {results.map((res, idx) => (
          <div key={idx} className="mb-4 border rounded-lg p-4 bg-gray-50 shadow-sm">
            <h4 className="font-medium text-gray-700 mb-2">
              {res.semester} ({res.examYear})
            </h4>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Subject</th>
                  <th className="border px-4 py-2">Marks Obtained</th>
                  <th className="border px-4 py-2">Total Marks</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Supply Cleared Year</th>
                </tr>
              </thead>
              <tbody>
                {res.subjects.map((subj, sidx) => (
                  <tr
                    key={sidx}
                    className={subj.status === "Detained" || subj.status === "Reappear" ? "bg-red-50" : ""}
                  >
                    <td className="border px-4 py-2">{subj.name}</td>
                    <td className="border px-4 py-2">{subj.marksObtained}</td>
                    <td className="border px-4 py-2">{subj.totalMarks}</td>
                    <td className="border px-4 py-2">{subj.status}</td>
                    <td className="border px-4 py-2">{subj.supplyClearedYear || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
