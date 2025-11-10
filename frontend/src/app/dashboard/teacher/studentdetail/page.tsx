"use client";
import Link from "next/link";
import React, { useState } from "react";

const classesData = {
  "cse-final-year": {
    name: "CSE Final Year",
    students: [
      {
        name: "Ritika Gupta",
        roll: "2203542",
        photo: "/images/profile.png",
        Fname: "Mr. ABC",
        Mname: "Mrs. ABC",
        email: "email@gmail.com",
        permanentAdd: "H.No23, Abc route",
        category: "General",
        dob: "20-08-2004",
        advisor: "Teacher 1",
        stmobile: "9087654321",
        fmobile: "9087654321",
        mmobile: "9087654321",
        admDate: "20-12-23",
        passingYear: "2026",
        track: "AI/ML",
        avgCgpa: "8.9",
        address: "Ludhiana, Punjab",
        urn: "U12345",
        crn: "C98765",
        phone: "9876543210",

        trainings: [
          {
            trainingField: "TR101",
            organisationName: "XYZ Ltd.",
            organisationDetails: "AI Research Lab",
            organisationSupervisor: "Dr. A. Kumar",
            fieldOfWork: "AI & ML",
            projectsMade: "AI Chatbot, Image Recognition",
            projectDescription: "Developed chatbot and image recognition projects",
            trainingDuration: "4 weeks",
            certificateAwarded: true,
            certificatePdf: "/pdfs/ritika_certificate.pdf",
          },
        ],

        placements: [
          {
            companyName: "Google",
            role: "Software Engineer",
            package: "₹25 LPA",
            companyDescription: "Google India Pvt Ltd.",
            yearOfPlacement: "2025",
            offerLetterUrl: "/pdfs/google_offer.pdf",
          },
          {
            companyName: "Microsoft",
            role: "Data Analyst Intern",
            package: "₹18 LPA",
            companyDescription: "Cloud and Data Division",
            yearOfPlacement: "2024",
            offerLetterUrl: "/pdfs/microsoft_offer.pdf",
          },
        ],

        internships: [
          {
            companyName: "Infosys",
            role: "ML Intern",
            duration: "8 weeks",
            description: "Worked on customer churn prediction using Python.",
            certificateUrl: "/pdfs/infosys_internship.pdf",
          },
          {
            companyName: "TCS",
            role: "AI Intern",
            duration: "6 weeks",
            description: "Built NLP-based customer support assistant.",
            certificateUrl: "/pdfs/tcs_internship.pdf",
          },
        ],

        researchPapers: [
          {
            paperTitle: "AI-Based Crop Prediction Model",
            publicationName: "International Journal of AI Research",
            publicationDate: "2024-12-10",
            paperLink: "https://example.com/paper1",
            doi: "10.1234/ijair.2024.001",
            facultyName: "Dr. Meera Kapoor",
            paperType: "Journal",
          },
          {
            paperTitle: "Deep Learning for Soil Health Monitoring",
            publicationName: "IEEE Conference on Data Science",
            publicationDate: "2025-03-01",
            paperLink: "https://example.com/paper2",
            facultyName: "Prof. Arjun Singh",
            paperType: "Conference",
          },
        ],

        certifications: [
          {
            type: "Technical",
            eventName: "Deep Learning Specialization",
            date: "2024-12-15",
            fileUrl: "/pdfs/deep_learning_certificate.pdf",
          },
          {
            type: "Cultural",
            eventName: "Annual Tech Fest Volunteer",
            date: "2023-03-10",
            fileUrl: "/pdfs/techfest_volunteer.pdf",
          },
          {
            type: "Sports",
            eventName: "Intercollege Badminton Winner",
            date: "2022-11-25",
            fileUrl: "/pdfs/badminton_certificate.pdf",
          },
        ],

        projects: [
          {
            type: "Ongoing",
            FullName: "Ritika Gupta",
            URN: "2203542",
            ProjectTitle: "ABC",
            ProjectDescription: "AI/ML Project",
            MentorName: "Mr. A. Verma",
            projectLink: "https://exampleProject.com",
          },
        ],

        linkedin: "https://linkedin.com/in/ritikagupta",
        github: "https://github.com/ritikagupta",
      },
    ],
  },
};

export default function StudentDetail() {
  const classId = "cse-final-year";
  const roll = "2203542";

  const student = classesData[classId]?.students.find((s) => s.roll === roll);

  const [expandedTraining, setExpandedTraining] = useState<number | null>(null);
  const [expandedPlacement, setExpandedPlacement] = useState<number | null>(null);
  const [expandedInternship, setExpandedInternship] = useState<number | null>(null);
  const [expandedResearch, setExpandedResearch] = useState<number | null>(null);
  const [expandedCertification, setExpandedCertification] = useState<number | null>(null);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  if (!student) return <p className="p-6 text-red-500">Student not found.</p>;

  const renderSection = (title: string, content: React.ReactNode, color: string) => (
    <section
      className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-200 border-l-4 ${color}`}
    >
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

        {/* Main Content */}
        <div className="bg-gradient-to-r from-indigo-50 to-white shadow-lg rounded-xl p-6 flex-1 border border-indigo-100 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <img
                src={student.photo}
                alt={student.name}
                className="w-48 h-48 rounded-full object-cover border-4 border-indigo-200 shadow-sm"
              />
            </div>

            {/* Details */}
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl font-bold text-indigo-800 mb-4">{student.name}</h1>

              {/* Personal Info */}
              {renderSection(
                "Personal Details",
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p><strong>Father’s Name:</strong> {student.Fname}</p>
                  <p><strong>Mother’s Name:</strong> {student.Mname}</p>
                  <p><strong>Email:</strong> {student.email}</p>
                  <p><strong>Category:</strong> {student.category}</p>
                  <p><strong>Date of Birth:</strong> {student.dob}</p>
                  <p><strong>Advisor:</strong> {student.advisor}</p>
                  <p><strong>Student Mobile:</strong> {student.stmobile}</p>
                  <p><strong>Father’s Mobile:</strong> {student.fmobile}</p>
                  <p><strong>Mother’s Mobile:</strong> {student.mmobile}</p>
                  <p><strong>Admission Date:</strong> {student.admDate}</p>
                  <p><strong>Passing Year:</strong> {student.passingYear}</p>
                  <p className="md:col-span-2"><strong>Permanent Address:</strong> {student.permanentAdd}</p>
                </div>,
                "border-red-500"
              )}

              {/* ✅ Trainings */}
              {student.trainings &&
                renderSection(
                  "Training Details",
                  <div className="space-y-3">
                    {student.trainings.map((t, index) => (
                      <div key={index} className="border rounded-lg bg-gray-50">
                        <button
                          onClick={() =>
                            setExpandedTraining(expandedTraining === index ? null : index)
                          }
                          className="w-full flex justify-between items-center p-3 font-semibold text-indigo-700"
                        >
                          <span>{t.trainingField} — {t.organisationName}</span>
                          <span className="text-sm text-gray-500">
                            {expandedTraining === index ? "▲ Hide" : "▼ View"}
                          </span>
                        </button>
                        {expandedTraining === index && (
                          <div className="p-3 text-gray-700 border-t border-gray-200 space-y-1">
                            <p><strong>Supervisor:</strong> {t.organisationSupervisor}</p>
                            <p><strong>Field:</strong> {t.fieldOfWork}</p>
                            <p><strong>Projects:</strong> {t.projectsMade}</p>
                            <p><strong>Duration:</strong> {t.trainingDuration}</p>
                            {t.certificatePdf && (
                              <a href={t.certificatePdf} target="_blank" className="text-indigo-600 underline">View Certificate</a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>,
                  "border-green-500"
                )}

               {/* ✅ Placements */}
               {student.placements &&
                renderSection(
                  "Placement Details",
                  <div className="space-y-3">
                    {student.placements.map((p, index) => (
                      <div key={index} className="border rounded-lg bg-blue-50">
                        <button
                          onClick={() =>
                            setExpandedPlacement(expandedPlacement === index ? null : index)
                          }
                          className="w-full flex justify-between items-center p-3 font-semibold text-blue-700"
                        >
                          <span>{p.companyName} — {p.role}</span>
                          <span className="text-sm text-gray-500">
                            {expandedPlacement === index ? "▲ Hide" : "▼ View"}
                          </span>
                        </button>
                        {expandedPlacement === index && (
                          <div className="p-3 text-gray-700 border-t border-blue-200 space-y-1">
                            <p><strong>Package:</strong> {p.package}</p>
                            <p><strong>Year:</strong> {p.yearOfPlacement}</p>
                            <p><strong>Description:</strong> {p.companyDescription}</p>
                            {p.offerLetterUrl && (
                              <a href={p.offerLetterUrl} target="_blank" className="text-blue-600 underline">View Offer Letter</a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>,
                  "border-blue-500"
                )}

              {/* ✅ Internships */}
              {student.internships &&
                renderSection(
                  "Internship Details",
                  <div className="space-y-3">
                    {student.internships.map((i, index) => (
                      <div key={index} className="border rounded-lg bg-yellow-50">
                        <button
                          onClick={() =>
                            setExpandedInternship(expandedInternship === index ? null : index)
                          }
                          className="w-full flex justify-between items-center p-3 font-semibold text-yellow-700"
                        >
                          <span>{i.companyName} — {i.role}</span>
                          <span className="text-sm text-gray-500">
                            {expandedInternship === index ? "▲ Hide" : "▼ View"}
                          </span>
                        </button>
                        {expandedInternship === index && (
                          <div className="p-3 text-gray-700 border-t border-yellow-200 space-y-1">
                            <p><strong>Duration:</strong> {i.duration}</p>
                            <p><strong>Description:</strong> {i.description}</p>
                            {i.certificateUrl && (
                              <a href={i.certificateUrl} target="_blank" className="text-yellow-600 underline">View Certificate</a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>,
                  "border-yellow-500"
                )}

              {/* ✅ Research Papers */}
              {student.researchPapers &&
                renderSection(
                  "Research Papers",
                  <div className="space-y-3">
                    {student.researchPapers.map((paper, index) => (
                      <div key={index} className="border rounded-lg bg-pink-50">
                        <button
                          onClick={() =>
                            setExpandedResearch(expandedResearch === index ? null : index)
                          }
                          className="w-full flex justify-between items-center p-3 font-semibold text-pink-700"
                        >
                          <span>{paper.paperTitle}</span>
                          <span className="text-sm text-gray-500">
                            {expandedResearch === index ? "▲ Hide" : "▼ View"}
                          </span>
                        </button>
                        {expandedResearch === index && (
                          <div className="p-3 text-gray-700 border-t border-pink-200 space-y-1">
                            <p><strong>Publication:</strong> {paper.publicationName}</p>
                            <p><strong>Date:</strong> {paper.publicationDate}</p>
                            <p><strong>Type:</strong> {paper.paperType}</p>
                            <p>
                              <a href={paper.paperLink} target="_blank" className="text-pink-600 underline">View Paper</a>
                            </p>
                            {paper.doi && <p><strong>DOI:</strong> {paper.doi}</p>}
                            {paper.facultyName && <p><strong>Faculty:</strong> {paper.facultyName}</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>,
                  "border-pink-500"
                )}

              {/* ✅ Certifications */}
              {student.certifications &&
                renderSection(
                  "Certifications",
                  <div className="space-y-3">
                    {student.certifications.map((cert, index) => (
                      <div key={index} className="border rounded-lg bg-purple-50">
                        <button
                          onClick={() =>
                            setExpandedCertification(expandedCertification === index ? null : index)
                          }
                          className="w-full flex justify-between items-center p-3 font-semibold text-purple-700"
                        >
                          <span>{cert.eventName}</span>
                          <span className="text-sm text-gray-500">
                            {expandedCertification === index ? "▲ Hide" : "▼ View"}
                          </span>
                        </button>
                        {expandedCertification === index && (
                          <div className="p-3 text-gray-700 border-t border-purple-200 space-y-1">
                            <p><strong>Type:</strong> {cert.type}</p>
                            <p><strong>Date:</strong> {cert.date}</p>
                            {cert.fileUrl && (
                              <a href={cert.fileUrl} target="_blank" className="text-purple-600 underline">
                                View Certificate PDF
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>,
                  "border-purple-500"
                )}

              {/* ✅ Projects */}
              {student.projects &&
  renderSection(
    "Projects",
    <div className="space-y-3">
      {student.projects.map((proj, index) => (
        <div key={index} className="border rounded-lg bg-indigo-50">
          <button
            onClick={() =>
              setExpandedProject(expandedProject === index ? null : index)
            }
            className="w-full flex justify-between items-center p-3 font-semibold text-indigo-700"
          >
            <span>{proj.ProjectTitle}</span>
            <span className="text-sm text-gray-500">
              {expandedProject === index ? "▲ Hide" : "▼ View"}
            </span>
          </button>

          {expandedProject === index && (
            <div className="p-3 space-y-2 text-gray-700 border-t border-gray-200">
              <p>
                <strong>Type:</strong> {proj.type}
              </p>
              <p>
                <strong>Student Name:</strong> {proj.FullName}
              </p>
              <p>
                <strong>URN:</strong> {proj.URN}
              </p>
              <p>
                <strong>Project Title:</strong> {proj.ProjectTitle}
              </p>
              <p>
                <strong>Description:</strong> {proj.ProjectDescription}
              </p>
              <p>
                <strong>Mentor Name:</strong> {proj.MentorName}
              </p>
              {proj.projectLink && (
                <p>
                  <strong>Project Link:</strong>{" "}
                  <a
                    href={proj.projectLink}
                    target="_blank"
                    className="text-indigo-600 underline"
                  >
                    View Project
                  </a>
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>,
    "border-indigo-500"
  )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
