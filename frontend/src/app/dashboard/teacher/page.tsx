// "use client";

// import { useState } from "react";

// interface ClassData {
//   id: number;
//   name: string;
//   students: number;
//   subjects: string[];
// }

// export default function TeacherDashboard() {
//   const [classes, setClasses] = useState<ClassData[]>([
//     {
//       id: 1,
//       name: "CSE Final Year",
//       students: 60,
//       subjects: ["Machine Learning", "Compiler Design", "Cloud Computing"],
//     },
//     {
//       id: 2,
//       name: "CSE 3rd Year",
//       students: 55,
//       subjects: ["Data Structures", "Operating Systems", "DBMS"],
//     },
//     {
//       id: 3,
//       name: "CSE 2nd Year",
//       students: 58,
//       subjects: ["OOPs", "Computer Networks", "Software Engineering"],
//     },
//     {
//       id: 4,
//       name: "CSE 1st Year",
//       students: 62,
//       subjects: ["Mathematics I", "Physics", "Programming Fundamentals"],
//     },
//   ]);

//   return (
//     <div className="p-6 space-y-8">
//       {/* Heading */}
//       <h1 className="text-2xl font-bold text-gray-800">
//         Teacher Dashboard
//       </h1>

//       {/* Classes Section */}
//       <section className="bg-white shadow rounded-lg p-6">
//         <h2 className="text-xl font-semibold mb-4">My Classes</h2>

//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {classes.map((cls) => (
//             <div
//               key={cls.id}
//               className="border rounded-lg p-4 bg-gray-50 shadow hover:shadow-md transition"
//             >
//               <h3 className="text-lg font-semibold text-gray-700 mb-2">
//                 {cls.name}
//               </h3>
//               <p className="text-sm text-gray-600 mb-2">
//                 Students: {cls.students}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Subjects: {cls.subjects.join(", ")}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }




"use client";

import { useState } from "react";

interface ClassData {
  id: number;
  name: string;
  students: number;
  subjects: string[];
}

export default function TeacherDashboard() {
  const [classes] = useState<ClassData[]>([
    { id: 1, name: "CSE Final Year", students: 60, subjects: ["ML", "Compiler", "Cloud"] },
    { id: 2, name: "CSE 3rd Year", students: 55, subjects: ["DS", "OS", "DBMS"] },
    { id: 3, name: "CSE 2nd Year", students: 58, subjects: ["OOPs", "CN", "SE"] },
    { id: 4, name: "CSE 1st Year", students: 62, subjects: ["Math I", "Physics", "Programming"] },
  ]);

  const [search, setSearch] = useState("");

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = classes.reduce((acc, cls) => acc + cls.students, 0);

  return (
    <div className="p-6 space-y-8 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF] min-h-screen">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-indigo-700">👩‍🏫 Teacher Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
          <p className="text-gray-500">Total Classes</p>
          <h2 className="text-2xl font-bold text-indigo-700">{classes.length}</h2>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
          <p className="text-gray-500">Total Students</p>
          <h2 className="text-2xl font-bold text-indigo-700">{totalStudents}</h2>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
          <p className="text-gray-500">Pending Assignments</p>
          <h2 className="text-2xl font-bold text-indigo-700">12</h2>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search classes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
        />
      </div>

      {/* Classes Section */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map(cls => (
          <div key={cls.id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition relative group">
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">{cls.name}</h3>
            <p className="text-gray-600 mb-1">Students: {cls.students}</p>
            <p className="text-gray-600 mb-4">
              Subjects: {cls.subjects.join(", ")}
            </p>
            <button className="absolute bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-2xl font-semibold opacity-0 group-hover:opacity-100 transition">
              View Students
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
