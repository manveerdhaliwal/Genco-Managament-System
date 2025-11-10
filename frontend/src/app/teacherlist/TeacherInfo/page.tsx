// "use client";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import axios from "axios";

// interface StudentData {
//   _id?: string;
//   name: string;
//   urn: string;
//   section: string;
//   fatherName: string;
//   motherName: string;
//   permanentAddress: string;
//   email: string;
//   category: string;
//   dob: string;
//   studentMobile: string;
//   fatherMobile: string;
//   motherMobile: string;
//   admissionDate: string;
//   passingYear: string;
//   advisorName: string;
// }

// const years = ["Final", "3rd", "2nd"];
// const sections = ["All", "A", "B"];

// export default function TeacherStudentInfoPage() {
//   const [selectedYear, setSelectedYear] = useState<string | null>(null);
//   const [selectedSection, setSelectedSection] = useState("All");
//   const [students, setStudents] = useState<StudentData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         setLoading(true);

//         // 🔹 You can replace this with a real backend call:
//         // const res = await axios.get("http://localhost:5000/api/student-info/advisor-students", { withCredentials: true });
//         // if (res.data.success) setStudents(res.data.data);

//         // 🔹 For demo, using hardcoded data:
//         const mockData: StudentData[] = [
//           {
//             _id: "1",
//             name: "Ritika Gupta",
//             urn: "2203542",
//             section: "A",
//             fatherName: "Mr. Rajesh Gupta",
//             motherName: "Mrs. Neha Gupta",
//             permanentAddress: "H.No 23, Model Town, Ludhiana",
//             email: "ritika@gmail.com",
//             category: "General",
//             dob: "2004-08-20",
//             studentMobile: "9876543210",
//             fatherMobile: "9988776655",
//             motherMobile: "8877665544",
//             admissionDate: "2022-08-10",
//             passingYear: "2026",
//             advisorName: "Prof. Mehta",
//           },
//           {
//             _id: "2",
//             name: "Aarav Sharma",
//             urn: "2203555",
//             section: "B",
//             fatherName: "Mr. Rakesh Sharma",
//             motherName: "Mrs. Pooja Sharma",
//             permanentAddress: "H.No 9, Civil Lines, Ludhiana",
//             email: "aarav@gmail.com",
//             category: "OBC",
//             dob: "2003-07-12",
//             studentMobile: "9871234567",
//             fatherMobile: "9812345678",
//             motherMobile: "9786543210",
//             admissionDate: "2022-08-10",
//             passingYear: "2026",
//             advisorName: "Prof. Mehta",
//           },
//         ];

//         setStudents(mockData);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch students");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, []);

//   const filteredStudents = students
//     .filter((s) => s.section === selectedSection || selectedSection === "All")
//     .sort((a, b) => a.urn.localeCompare(b.urn));

//   if (loading) return <p className="p-6">Loading students...</p>;
//   if (error) return <p className="p-6 text-red-500">{error}</p>;

//   return (
//     <div className="min-h-screen p-6 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF]">
//       <div className="max-w-6xl mx-auto flex flex-col gap-6">
//         <Link
//           href={`/dashboard/teacher`}
//           className="mb-4 inline-flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition duration-200"
//           aria-label="Go back"
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
//           </svg>
//         </Link>

//         {!selectedYear ? (
//           <>
//             <h1 className="text-3xl font-bold text-indigo-700 mb-4">Select Year</h1>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//               {years.map((year) => (
//                 <div
//                   key={year}
//                   onClick={() => setSelectedYear(year)}
//                   className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-xl transition"
//                 >
//                   <h2 className="text-xl font-semibold text-indigo-700">{year} Year</h2>
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="flex justify-between items-center">
//               <h1 className="text-3xl font-bold text-indigo-700 mb-4">
//                 {selectedYear} Year Students
//               </h1>
//               <button
//                 onClick={() => {
//                   setSelectedYear(null);
//                   setSelectedSection("All");
//                 }}
//                 className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
//               >
//                 Back
//               </button>
//             </div>

//             {/* Section Filter */}
//             <div className="mb-4 flex gap-4 items-center">
//               <span className="font-medium text-gray-700">Filter by Section:</span>
//               <select
//                 className="border border-gray-300 rounded-xl px-4 py-2"
//                 value={selectedSection}
//                 onChange={(e) => setSelectedSection(e.target.value)}
//               >
//                 {sections.map((sec) => (
//                   <option key={sec} value={sec}>
//                     {sec}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto shadow-md rounded-2xl bg-white">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-indigo-100">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">URN</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Section</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Category</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">View</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {filteredStudents.map((student) => (
//                     <tr key={student._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 text-sm text-gray-800">{student.urn}</td>
//                       <td className="px-6 py-4 text-sm text-gray-800">{student.name}</td>
//                       <td className="px-6 py-4 text-sm text-gray-800">{student.section}</td>
//                       <td className="px-6 py-4 text-sm text-gray-800">{student.category}</td>
//                       <td className="px-6 py-4 text-center">
//                         <button
//                           onClick={() => setSelectedStudent(student)}
//                           className="bg-indigo-600 text-white px-4 py-1 rounded-xl hover:bg-indigo-700 transition"
//                         >
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}

//         {/* Student Details Modal */}
//         {selectedStudent && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-3xl p-6 max-w-3xl w-full relative overflow-y-auto max-h-[90vh]">
//               <button
//                 onClick={() => setSelectedStudent(null)}
//                 className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
//               >
//                 &times;
//               </button>

//               <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
//                 {selectedStudent.name} ({selectedStudent.urn})
//               </h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
//                 <p><strong>Father's Name:</strong> {selectedStudent.fatherName}</p>
//                 <p><strong>Mother's Name:</strong> {selectedStudent.motherName}</p>
//                 <p><strong>Email:</strong> {selectedStudent.email}</p>
//                 <p><strong>DOB:</strong> {selectedStudent.dob}</p>
//                 <p><strong>Category:</strong> {selectedStudent.category}</p>
//                 <p><strong>Student Mobile:</strong> {selectedStudent.studentMobile}</p>
//                 <p><strong>Father Mobile:</strong> {selectedStudent.fatherMobile}</p>
//                 <p><strong>Mother Mobile:</strong> {selectedStudent.motherMobile}</p>
//                 <p><strong>Admission Date:</strong> {selectedStudent.admissionDate}</p>
//                 <p><strong>Passing Year:</strong> {selectedStudent.passingYear}</p>
//                 <p className="md:col-span-2"><strong>Permanent Address:</strong> {selectedStudent.permanentAddress}</p>
//                 <p className="md:col-span-2"><strong>Advisor:</strong> {selectedStudent.advisorName}</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }






"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

interface StudentData {
  _id?: string;
  name: string;
  urn: string;
  section: string;
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
  advisorName: string;
}

const years = ["Final", "3rd", "2nd"];
const sections = ["All", "A", "B"];

export default function TeacherStudentInfoPage() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState("All");
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/student-info", {
          withCredentials: true,
        });

        if (res.data.success) {
          const mapped = res.data.data.map((s: any) => ({
            _id: s._id,
            name: s.student?.name || "N/A",
            urn: s.urn || "N/A",
            section: s.section || "N/A",
            fatherName: s.fatherName || "N/A",
            motherName: s.motherName || "N/A",
            permanentAddress: s.permanentAddress || "N/A",
            email: s.student?.email || "N/A",
            category: s.category || "N/A",
            dob: s.dob ? new Date(s.dob).toISOString().split("T")[0] : "N/A",
            studentMobile: s.studentMobile || "N/A",
            fatherMobile: s.fatherMobile || "N/A",
            motherMobile: s.motherMobile || "N/A",
            admissionDate: s.admissionDate ? new Date(s.admissionDate).toISOString().split("T")[0] : "N/A",
            passingYear: s.passingYear || "N/A",
            advisorName: s.advisor?.name || "N/A",
          }));
          setStudents(mapped);
        } else {
          setError(res.data.message || "No student info found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch student info");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students
    .filter((s) => s.section === selectedSection || selectedSection === "All")
    .sort((a, b) => a.urn.localeCompare(b.urn));

  if (loading) return <p className="p-6">Loading students...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF]">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <Link
          href={`/dashboard/teacher`}
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

        {!selectedYear ? (
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
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-indigo-700 mb-4">
                {selectedYear} Year Students
              </h1>
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
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto shadow-md rounded-2xl bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">URN</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Section</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{student.urn}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{student.section}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{student.category}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedStudent(student)}
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

        {/* Student Details Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-6 max-w-3xl w-full relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
              >
                &times;
              </button>

              <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
                {selectedStudent.name} ({selectedStudent.urn})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <p><strong>Father's Name:</strong> {selectedStudent.fatherName}</p>
                <p><strong>Mother's Name:</strong> {selectedStudent.motherName}</p>
                <p><strong>Email:</strong> {selectedStudent.email}</p>
                <p><strong>DOB:</strong> {selectedStudent.dob}</p>
                <p><strong>Category:</strong> {selectedStudent.category}</p>
                <p><strong>Student Mobile:</strong> {selectedStudent.studentMobile}</p>
                <p><strong>Father Mobile:</strong> {selectedStudent.fatherMobile}</p>
                <p><strong>Mother Mobile:</strong> {selectedStudent.motherMobile}</p>
                <p><strong>Admission Date:</strong> {selectedStudent.admissionDate}</p>
                <p><strong>Passing Year:</strong> {selectedStudent.passingYear}</p>
                <p className="md:col-span-2"><strong>Permanent Address:</strong> {selectedStudent.permanentAddress}</p>
                <p className="md:col-span-2"><strong>Advisor:</strong> {selectedStudent.advisorName}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




// "use client";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import axios from "axios";

// interface StudentData {
//   _id?: string;
//   name: string;
//   urn: string;
//   section: string;
//   fatherName: string;
//   motherName: string;
//   permanentAddress: string;
//   email: string;
//   category: string;
//   dob: string;
//   studentMobile: string;
//   fatherMobile: string;
//   motherMobile: string;
//   admissionDate: string;
//   passingYear: string;
//   advisorName: string;
// }

// const years = ["Final", "3rd", "2nd"];
// const sections = ["All", "A", "B"];

// export default function TeacherStudentInfoPage() {
//   const [selectedYear, setSelectedYear] = useState<string | null>(null);
//   const [selectedSection, setSelectedSection] = useState("All");
//   const [students, setStudents] = useState<StudentData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get("http://localhost:5000/api/student-info", {
//           withCredentials: true,
//         });

//         if (res.data.success) {
//           const mapped = res.data.data.map((s: any) => ({
//             _id: s._id,
//             name: s.student?.name || "N/A",
//             urn: s.student?.URN || "N/A",           // ✅ URN from Student model
//             section: s.student?.section || "N/A",   // ✅ Section from Student model
//             fatherName: s.fatherName || "N/A",
//             motherName: s.motherName || "N/A",
//             permanentAddress: s.permanentAddress || "N/A",
//             email: s.student?.email || "N/A",
//             category: s.category || "N/A",
//             dob: s.dob ? new Date(s.dob).toISOString().split("T")[0] : "N/A",
//             studentMobile: s.studentMobile || "N/A",
//             fatherMobile: s.fatherMobile || "N/A",
//             motherMobile: s.motherMobile || "N/A",
//             admissionDate: s.admissionDate
//               ? new Date(s.admissionDate).toISOString().split("T")[0]
//               : "N/A",
//             passingYear: s.passingYear || "N/A",
//             advisorName: s.advisor?.name || "N/A",
//           }));
//           setStudents(mapped);
//         } else {
//           setError(res.data.message || "No student info found");
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch student info");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, []);

//   const filteredStudents = students
//     .filter((s) => s.section === selectedSection || selectedSection === "All")
//     .sort((a, b) => a.urn.localeCompare(b.urn));

//   if (loading) return <p className="p-6">Loading students...</p>;
//   if (error) return <p className="p-6 text-red-500">{error}</p>;

//   return (
//     <div className="min-h-screen p-6 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF]">
//       <div className="max-w-6xl mx-auto flex flex-col gap-6">
//         <Link
//           href={`/dashboard/teacher`}
//           className="mb-4 inline-flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition duration-200"
//           aria-label="Go back"
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
//           </svg>
//         </Link>

//         {!selectedYear ? (
//           <>
//             <h1 className="text-3xl font-bold text-indigo-700 mb-4">Select Year</h1>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//               {years.map((year) => (
//                 <div
//                   key={year}
//                   onClick={() => setSelectedYear(year)}
//                   className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-xl transition"
//                 >
//                   <h2 className="text-xl font-semibold text-indigo-700">{year} Year</h2>
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="flex justify-between items-center">
//               <h1 className="text-3xl font-bold text-indigo-700 mb-4">
//                 {selectedYear} Year Students
//               </h1>
//               <button
//                 onClick={() => {
//                   setSelectedYear(null);
//                   setSelectedSection("All");
//                 }}
//                 className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
//               >
//                 Back
//               </button>
//             </div>

//             {/* Section Filter */}
//             <div className="mb-4 flex gap-4 items-center">
//               <span className="font-medium text-gray-700">Filter by Section:</span>
//               <select
//                 className="border border-gray-300 rounded-xl px-4 py-2"
//                 value={selectedSection}
//                 onChange={(e) => setSelectedSection(e.target.value)}
//               >
//                 {sections.map((sec) => (
//                   <option key={sec} value={sec}>
//                     {sec}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto shadow-md rounded-2xl bg-white">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-indigo-100">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">URN</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Section</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Category</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">View</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {filteredStudents.map((student) => (
//                     <tr key={student._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 text-sm text-gray-800">{student.urn}</td>
//                       <td className="px-6 py-4 text-sm text-gray-800">{student.name}</td>
//                       <td className="px-6 py-4 text-sm text-gray-800">{student.section}</td>
//                       <td className="px-6 py-4 text-sm text-gray-800">{student.category}</td>
//                       <td className="px-6 py-4 text-center">
//                         <button
//                           onClick={() => setSelectedStudent(student)}
//                           className="bg-indigo-600 text-white px-4 py-1 rounded-xl hover:bg-indigo-700 transition"
//                         >
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}

//         {/* Student Details Modal */}
//         {selectedStudent && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-3xl p-6 max-w-3xl w-full relative overflow-y-auto max-h-[90vh]">
//               <button
//                 onClick={() => setSelectedStudent(null)}
//                 className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
//               >
//                 &times;
//               </button>

//               <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
//                 {selectedStudent.name} ({selectedStudent.urn})
//               </h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
//                 <p><strong>URN:</strong> {selectedStudent.urn}</p>
//                 <p><strong>Section:</strong> {selectedStudent.section}</p>
//                 <p><strong>Father's Name:</strong> {selectedStudent.fatherName}</p>
//                 <p><strong>Mother's Name:</strong> {selectedStudent.motherName}</p>
//                 <p><strong>Email:</strong> {selectedStudent.email}</p>
//                 <p><strong>DOB:</strong> {selectedStudent.dob}</p>
//                 <p><strong>Category:</strong> {selectedStudent.category}</p>
//                 <p><strong>Student Mobile:</strong> {selectedStudent.studentMobile}</p>
//                 <p><strong>Father Mobile:</strong> {selectedStudent.fatherMobile}</p>
//                 <p><strong>Mother Mobile:</strong> {selectedStudent.motherMobile}</p>
//                 <p><strong>Admission Date:</strong> {selectedStudent.admissionDate}</p>
//                 <p><strong>Passing Year:</strong> {selectedStudent.passingYear}</p>
//                 <p className="md:col-span-2"><strong>Permanent Address:</strong> {selectedStudent.permanentAddress}</p>
//                 <p className="md:col-span-2"><strong>Advisor:</strong> {selectedStudent.advisorName}</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
