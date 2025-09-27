// "use client";
// import Link from "next/link";
// import { useState } from "react";

// type CertificateType = "technical" | "cultural" | "sports";

// type CertificateData = {
//   eventName: string;
//   eventDate: string;
// };

// type SubmittedCertificate = {
//   studentName: string;
//   type: CertificateType;
//   data: CertificateData;
//   fileType: string;
//   preview: string;
//   year: string; // "Final", "3rd", "2nd"
//   section: string; // e.g., "A", "B"
// };

// // Hardcoded data for demo
// const allCertificates: SubmittedCertificate[] = [
//   {
//     studentName: "Ritika Gupta",
//     type: "technical",
//     data: { eventName: "AI Hackathon", eventDate: "2025-05-20" },
//     fileType: "application/pdf",
//     preview: "/pdfs/ritika_certificate.pdf",
//     year: "Final",
//     section: "A",
//   },
//   {
//     studentName: "John Doe",
//     type: "sports",
//     data: { eventName: "Football Championship", eventDate: "2025-03-15" },
//     fileType: "image/png",
//     preview: "/images/football_certificate.png",
//     year: "3rd",
//     section: "B",
//   },
//   {
//     studentName: "Alice Smith",
//     type: "cultural",
//     data: { eventName: "Dance Competition", eventDate: "2025-04-10" },
//     fileType: "image/jpeg",
//     preview: "/images/dance_certificate.jpg",
//     year: "Final",
//     section: "B",
//   },
//   {
//     studentName: "Bob Johnson",
//     type: "technical",
//     data: { eventName: "Robotics Workshop", eventDate: "2025-02-18" },
//     fileType: "application/pdf",
//     preview: "/pdfs/bob_certificate.pdf",
//     year: "2nd",
//     section: "A",
//   },
// ];

// const years = ["Final", "3rd", "2nd"];
// const sections = ["All", "A", "B"];

// export default function TCertificationsPage() {
//   const [selectedYear, setSelectedYear] = useState<string | null>(null);
//   const [selectedSection, setSelectedSection] = useState("All");
//   const [selectedPreview, setSelectedPreview] = useState<SubmittedCertificate | null>(null);

//   const filteredCertificates = allCertificates.filter(cert => {
//     return cert.year === selectedYear && (selectedSection === "All" || cert.section === selectedSection);
//   });

//   return (
//     <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF]">
//       <div className="max-w-6xl mx-auto flex flex-col gap-6">
//         <Link
//   href={`/dashboard/teacher`}
//   className="mb-4 inline-flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition duration-200"
//   aria-label="Go back"
// >
//   <svg
//     className="w-6 h-6"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     viewBox="0 0 24 24"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
//   </svg>
// </Link>

//         {!selectedYear && (
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
//         )}

//         {selectedYear && (
//           <>
//             <div className="flex justify-between items-center">
//               <h1 className="text-3xl font-bold text-indigo-700 mb-4">{selectedYear} Year Certificates</h1>
//               <button
//                 onClick={() => setSelectedYear(null)}
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
//                   <option key={sec} value={sec}>{sec}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto shadow-md rounded-2xl bg-white">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-indigo-100">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Student</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Section</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Type</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Event Name</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Event Date</th>
//                     <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Preview</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {filteredCertificates.map((cert, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 text-sm text-gray-800">{cert.studentName}</td>
//                       <td className="px-6 py-4 text-sm text-gray-800">{cert.section}</td>
//                       <td className="px-6 py-4 text-sm text-gray-800">{cert.type.toUpperCase()}</td>
//                       <td className="px-6 py-4 text-sm text-gray-800">{cert.data.eventName}</td>
//                       <td className="px-6 py-4 text-sm text-gray-800">{cert.data.eventDate}</td>
//                       <td className="px-6 py-4 text-center">
//                         <button
//                           onClick={() => setSelectedPreview(cert)}
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

//         {/* Modal / Popup */}
//         {selectedPreview && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-3xl p-4 max-w-4xl w-full relative">
//               <button
//                 onClick={() => setSelectedPreview(null)}
//                 className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
//               >
//                 &times;
//               </button>
//               <h2 className="text-xl font-semibold mb-4">{selectedPreview.studentName} - {selectedPreview.type.toUpperCase()}</h2>
//               {selectedPreview.fileType === "application/pdf" ? (
//                 <iframe
//                   src={selectedPreview.preview}
//                   className="w-full h-96"
//                   title="Certificate PDF"
//                 ></iframe>
//               ) : (
//                 <img
//                   src={selectedPreview.preview}
//                   alt="Certificate"
//                   className="w-full h-96 object-contain"
//                 />
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



"use client";
import Link from "next/link";
import { useState } from "react";

type CertificateType = "technical" | "cultural" | "sports";

type CertificateData = {
  eventName: string;
  eventDate: string;
};

type SubmittedCertificate = {
  studentName: string;
  urn: string; // Added URN
  type: CertificateType;
  data: CertificateData;
  fileType: string;
  preview: string;
  year: string; // "Final", "3rd", "2nd"
  section: string; // e.g., "A", "B"
};

// Hardcoded data for demo
const allCertificates: SubmittedCertificate[] = [
  {
    studentName: "Ritika Gupta",
    urn: "2203542",
    type: "technical",
    data: { eventName: "AI Hackathon", eventDate: "2025-05-20" },
    fileType: "application/pdf",
    preview: "/pdfs/ritika_certificate.pdf",
    year: "Final",
    section: "A",
  },
  {
    studentName: "John Doe",
    urn: "2203545",
    type: "sports",
    data: { eventName: "Football Championship", eventDate: "2025-03-15" },
    fileType: "image/png",
    preview: "/images/football_certificate.png",
    year: "3rd",
    section: "B",
  },
  {
    studentName: "Alice Smith",
    urn: "2203543",
    type: "cultural",
    data: { eventName: "Dance Competition", eventDate: "2025-04-10" },
    fileType: "image/jpeg",
    preview: "/images/dance_certificate.jpg",
    year: "Final",
    section: "B",
  },
  {
    studentName: "Bob Johnson",
    urn: "2203541",
    type: "technical",
    data: { eventName: "Robotics Workshop", eventDate: "2025-02-18" },
    fileType: "application/pdf",
    preview: "/pdfs/bob_certificate.pdf",
    year: "2nd",
    section: "A",
  },
];

const years = ["Final", "3rd", "2nd"];
const sections = ["All", "A", "B"];

export default function TCertificationsPage() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedPreview, setSelectedPreview] = useState<SubmittedCertificate | null>(null);

  const filteredCertificates = allCertificates
    .filter(cert => cert.year === selectedYear && (selectedSection === "All" || cert.section === selectedSection))
    .sort((a, b) => a.urn.localeCompare(b.urn)); // Sorting by URN

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF]">
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

        {selectedYear && (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-indigo-700 mb-4">{selectedYear} Year Certificates</h1>
              <button
                onClick={() => setSelectedYear(null)}
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
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">URN</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Student</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Section</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Event Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Event Date</th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCertificates.map((cert, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{cert.urn}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{cert.studentName}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{cert.section}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{cert.type.toUpperCase()}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{cert.data.eventName}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{cert.data.eventDate}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedPreview(cert)}
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

        {/* Modal / Popup */}
        {selectedPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-4 max-w-4xl w-full relative">
              <button
                onClick={() => setSelectedPreview(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">{selectedPreview.studentName} - {selectedPreview.type.toUpperCase()}</h2>
              {selectedPreview.fileType === "application/pdf" ? (
                <iframe
                  src={selectedPreview.preview}
                  className="w-full h-96"
                  title="Certificate PDF"
                ></iframe>
              ) : (
                <img
                  src={selectedPreview.preview}
                  alt="Certificate"
                  className="w-full h-96 object-contain"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
