// "use client";

// import { useSearchParams } from "next/navigation";
// import Link from "next/link";

// const classesData: Record<
//   string,
//   {
//     name: string;
//     students: {
//       name: string;
//       roll: string;
//       urn: string;
//       crn: string;
//       phone: string;
//       address: string;
//       track: string;
//       avgCgpa: string;
//       training: string;
//       certifications: string;
//       projects: string;
//       linkedin?: string;
//       github?: string;
//       photo: string;
//       certificatePdf?: string;
//       internshipPdf?: string;
//       researchPaperUrl?: string;
//     }[];
//   }
// > = {
//   "cse-final-year": {
//     name: "CSE Final Year",
//     students: [
//       {
//         name: "moyemoye",
//         roll: "2203542",
//         urn: "URN001",
//         crn: "CRN101",
//         phone: "+91-9876543210",
//         address: "123, Sector 15, Ludhiana, Punjab",
//         track: "Machine Learning",
//         avgCgpa: "9.1",
//         training: "AI Internship at XYZ Ltd.",
//         certifications: "Deep Learning Specialization",
//         projects: "AI Chatbot, Image Recognition",
//         linkedin: "https://linkedin.com/in/ritikagupta",
//         github: "https://github.com/ritikagupta",
//         photo: "https://randomuser.me/api/portraits/women/68.jpg",
//         certificatePdf: "/pdfs/ritika_certificate.pdf",
//         internshipPdf: "/pdfs/ritika_internship.pdf",
//         researchPaperUrl: "https://example.com/researchpaper",
//       },
//     ],
//   },
// };

// export default function StudentListPage() {
//   const searchParams = useSearchParams();
//   const classId = searchParams.get("classId");

//   if (!classId || !classesData[classId]) {
//     return <p className="p-6">Invalid class selected.</p>;
//   }

//   const classInfo = classesData[classId];
//   const sortedStudents = [...classInfo.students].sort((a, b) =>
//     a.roll.localeCompare(b.roll)
//   );

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">{classInfo.name} - Students</h1>
//       <table className="table-auto border-collapse border border-gray-300 w-full text-left">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border border-gray-300 px-4 py-2">Roll Number</th>
//             <th className="border border-gray-300 px-4 py-2">Name</th>
//             <th className="border border-gray-300 px-4 py-2">Track</th>
//             <th className="border border-gray-300 px-4 py-2">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sortedStudents.map((student) => (
//             <tr key={student.roll} className="hover:bg-gray-50">
//               <td className="border border-gray-300 px-4 py-2">{student.roll}</td>
//               <td className="border border-gray-300 px-4 py-2">{student.name}</td>
//               <td className="border border-gray-300 px-4 py-2">{student.track}</td>
//               <td className="border border-gray-300 px-4 py-2">
//                 <Link
//   href={`/dashboard/teacher/studentdetail?classId=${classId}&roll=${student.roll}`}
//   className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
// >
//   View Details
// </Link>

//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }



"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const classesData: Record<
  string,
  {
    name: string;
    students: {
      name: string;
      roll: string;
      urn: string;
      crn: string;
      phone: string;
      address: string;
      track: string;
      avgCgpa: string;
      training: string;
      certifications: string;
      projects: string;
      linkedin?: string;
      github?: string;
      photo: string;
      certificatePdf?: string;
      internshipPdf?: string;
      researchPaperUrl?: string;
    }[];
  }
> = {
  "cse-final-year": {
    name: "CSE Final Year",
    students: [
      {
        name: "moyemoye",
        roll: "2203542",
        urn: "URN001",
        crn: "CRN101",
        phone: "+91-9876543210",
        address: "123, Sector 15, Ludhiana, Punjab",
        track: "Machine Learning",
        avgCgpa: "9.1",
        training: "AI Internship at XYZ Ltd.",
        certifications: "Deep Learning Specialization",
        projects: "AI Chatbot, Image Recognition",
        linkedin: "https://linkedin.com/in/ritikagupta",
        github: "https://github.com/ritikagupta",
        photo: "https://randomuser.me/api/portraits/women/68.jpg",
        certificatePdf: "/pdfs/ritika_certificate.pdf",
        internshipPdf: "/pdfs/ritika_internship.pdf",
        researchPaperUrl: "https://example.com/researchpaper",
      },
    ],
  },
};

export default function StudentListPage() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Added useRouter
  const classId = searchParams.get("classId");

  if (!classId || !classesData[classId]) {
    return <p className="p-6">Invalid class selected.</p>;
  }

  const classInfo = classesData[classId];
  const sortedStudents = [...classInfo.students].sort((a, b) =>
    a.roll.localeCompare(b.roll)
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{classInfo.name} - Students</h1>
<Link
  href={`/dashboard/teacher/class`}
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



      <table className="table-auto border-collapse border border-gray-300 w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Roll Number</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Track</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((student) => (
            <tr key={student.roll} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{student.roll}</td>
              <td className="border border-gray-300 px-4 py-2">{student.name}</td>
              <td className="border border-gray-300 px-4 py-2">{student.track}</td>
              <td className="border border-gray-300 px-4 py-2">
                <Link
                  href={`/dashboard/teacher/studentdetail?classId=${classId}&roll=${student.roll}`}
                  className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
