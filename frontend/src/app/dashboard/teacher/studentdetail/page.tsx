"use client";
import Link from "next/link";

const classesData = {
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
    ],
  },
};

export default function StudentDetail() {
  const classId = "cse-final-year";
  const roll = "2203542";

  const student = classesData[classId]?.students.find((s) => s.roll === roll);
  if (!student) return <p className="p-6 text-red-500">Student not found.</p>;

  const renderSection = (title: string, content: React.ReactNode, color: string) => (
    <section className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-200 border-l-4 ${color}`}>
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <h2 className="text-xl font-semibold text-gray-800 md:w-48">{title}</h2>
        <div className="flex-1 text-gray-700">{content}</div>
      </div>
    </section>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Back Button */}
        <div className="flex-shrink-0">
          <Link
            href={`/dashboard/teacher/class`}
            className="inline-flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition duration-200"
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
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-r from-indigo-50 to-white shadow-lg rounded-xl p-6 flex-1 border border-indigo-100 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Photo */}
            <div className="flex-shrink-0">
              <img
                src={student.photo}
                alt={student.name}
                className="w-48 h-48 rounded-full object-cover border-4 border-indigo-200 shadow-sm"
              />
            </div>

            {/* Info Sections */}
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl font-bold text-indigo-800 mb-4">{student.name}</h1>

              {renderSection(
                "Personal Details",
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p><strong>Roll:</strong> {student.roll}</p>
                  <p><strong>URN:</strong> {student.urn}</p>
                  <p><strong>CRN:</strong> {student.crn}</p>
                  <p><strong>Phone:</strong> {student.phone}</p>
                  <p className="md:col-span-2"><strong>Address:</strong> {student.address}</p>
                  <p><strong>Track:</strong> {student.track}</p>
                  <p><strong>Average CGPA:</strong> {student.avgCgpa}</p>
                </div>,
                "border-indigo-500"
              )}

              {renderSection(
                "Training",
                <>
                  <p>{student.training}</p>
                  {student.internshipPdf && (
                    <p>
                      <strong>Internship PDF:</strong>{" "}
                      <a href={student.internshipPdf} target="_blank" className="text-green-600 hover:underline">
                        View
                      </a>
                    </p>
                  )}
                </>,
                "border-green-500"
              )}

              {renderSection(
                "Certifications",
                <>
                  <p>{student.certifications}</p>
                  {student.certificatePdf && (
                    <p>
                      <strong>Certificate PDF:</strong>{" "}
                      <a href={student.certificatePdf} target="_blank" className="text-yellow-600 hover:underline">
                        View
                      </a>
                    </p>
                  )}
                </>,
                "border-yellow-500"
              )}

              {renderSection(
                "Projects",
                <p>{student.projects}</p>,
                "border-purple-500"
              )}

              {student.researchPaperUrl &&
                renderSection(
                  "Research",
                  <a href={student.researchPaperUrl} target="_blank" className="text-pink-600 hover:underline">
                    View Research Paper
                  </a>,
                  "border-pink-500"
                )}

              {(student.linkedin || student.github) &&
                renderSection(
                  "Links",
                  <div>
                    {student.linkedin && (
                      <p>
                        <strong>LinkedIn:</strong>{" "}
                        <a href={student.linkedin} target="_blank" className="text-indigo-600 hover:underline">
                          {student.linkedin}
                        </a>
                      </p>
                    )}
                    {student.github && (
                      <p>
                        <strong>GitHub:</strong>{" "}
                        <a href={student.github} target="_blank" className="text-indigo-600 hover:underline">
                          {student.github}
                        </a>
                      </p>
                    )}
                  </div>,
                  "border-indigo-300"
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
