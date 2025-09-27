"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Full classes data with detailed info
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
        name: "Ritika Gupta",
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
      {
        name: "Aman Sharma",
        roll: "2203540",
        urn: "URN002",
        crn: "CRN102",
        phone: "+91-9876543201",
        address: "45, Model Town, Ludhiana, Punjab",
        track: "Data Science",
        avgCgpa: "8.7",
        training: "Data Analysis Internship at ABC Ltd.",
        certifications: "Data Science Certification",
        projects: "Data Analysis, Visualization Dashboard",
        linkedin: "https://linkedin.com/in/amansharma",
        github: "https://github.com/amansharma",
        photo: "https://randomuser.me/api/portraits/men/70.jpg",
        certificatePdf: "/pdfs/aman_certificate.pdf",
        internshipPdf: "/pdfs/aman_internship.pdf",
        researchPaperUrl: "https://example.com/researchpaper2",
      },
    ],
  },
  "cse-3rd-year": {
    name: "CSE 3rd Year",
    students: [
      {
        name: "Rohit Verma",
        roll: "2203539",
        urn: "URN003",
        crn: "CRN103",
        phone: "+91-9876543211",
        address: "67, Civil Lines, Ludhiana, Punjab",
        track: "Data Science",
        avgCgpa: "8.5",
        training: "Data Visualization Internship",
        certifications: "Data Analysis Certification",
        projects: "Dashboard Creation, Data Mining",
        linkedin: "https://linkedin.com/in/rohitverma",
        github: "https://github.com/rohitverma",
        photo: "https://randomuser.me/api/portraits/men/71.jpg",
        certificatePdf: "/pdfs/rohit_certificate.pdf",
        internshipPdf: "/pdfs/rohit_internship.pdf",
        researchPaperUrl: "https://example.com/researchpaper3",
      },
      {
        name: "Simran Kaur",
        roll: "2203543",
        urn: "URN004",
        crn: "CRN104",
        phone: "+91-9876543212",
        address: "89, Model Town, Ludhiana, Punjab",
        track: "Machine Learning",
        avgCgpa: "9.2",
        training: "NLP Internship at DEF Ltd.",
        certifications: "AI & ML Certification",
        projects: "Chatbot, Text Classification",
        linkedin: "https://linkedin.com/in/simrankaur",
        github: "https://github.com/simrankaur",
        photo: "https://randomuser.me/api/portraits/women/69.jpg",
        certificatePdf: "/pdfs/simran_certificate.pdf",
        internshipPdf: "/pdfs/simran_internship.pdf",
        researchPaperUrl: "https://example.com/researchpaper4",
      },
    ],
  },
};

export default function StudentDetail() {
  const searchParams = useSearchParams();
  const classId = searchParams.get("classId");
  const roll = searchParams.get("roll");

  if (!classId || !roll) {
    return <p className="p-6">Invalid student selected.</p>;
  }

  const student = classesData[classId]?.students.find(s => s.roll === roll);

  if (!student) {
    return <p className="p-6">Student not found.</p>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
<Link
  href={`/dashboard/teacher/classstudent?classId=${classId}`}
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


      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <img
            src={student.photo}
            alt={student.name}
            className="w-48 h-48 rounded-full object-cover border border-gray-300"
          />
        </div>

        <div className="flex-1 space-y-3">
          <h1 className="text-3xl font-bold">{student.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p><strong>Roll Number:</strong> {student.roll}</p>
            <p><strong>URN:</strong> {student.urn}</p>
            <p><strong>CRN:</strong> {student.crn}</p>
            <p><strong>Phone:</strong> {student.phone}</p>
            <p className="md:col-span-2"><strong>Address:</strong> {student.address}</p>
            <p><strong>Track:</strong> {student.track}</p>
            <p><strong>Average CGPA:</strong> {student.avgCgpa}</p>
            <p className="md:col-span-2"><strong>Training Details:</strong> {student.training}</p>
            <p className="md:col-span-2"><strong>Certifications:</strong> {student.certifications}</p>
            <p className="md:col-span-2"><strong>Projects:</strong> {student.projects}</p>
            {student.linkedin && (
              <p><strong>LinkedIn:</strong> <a href={student.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-500">{student.linkedin}</a></p>
            )}
            {student.github && (
              <p><strong>GitHub:</strong> <a href={student.github} target="_blank" rel="noopener noreferrer" className="text-indigo-500">{student.github}</a></p>
            )}
            {student.certificatePdf && (
              <p><strong>Certificate PDF:</strong> <a href={student.certificatePdf} target="_blank" rel="noopener noreferrer" className="text-indigo-500">View</a></p>
            )}
            {student.internshipPdf && (
              <p><strong>Internship PDF:</strong> <a href={student.internshipPdf} target="_blank" rel="noopener noreferrer" className="text-indigo-500">View</a></p>
            )}
            {student.researchPaperUrl && (
              <p><strong>Research Paper:</strong> <a href={student.researchPaperUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-500">View</a></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
