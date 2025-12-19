"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";

// ✅ Google Drive Viewer for reliable inline PDF viewing
const getInlineViewUrl = (url: string): string => {
  if (!url) return "";
  return `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(url)}`;
};

interface TrainingEntry {
  trainingField: string;
  organisationName: string;
  organisationDetails: string;
  organisationSupervisor: string;
  fieldOfWork: string;
  projectsMade: string;
  projectDescription: string;
  trainingDuration?: string;
  certificateAwarded: boolean;
  certificatePdf?: string;
}

interface PlacementEntry {
  companyName: string;
  role: string;
  package?: string;
  companyDescription: string;
  yearOfPlacement: string;
  offerLetterUrl?: string;
}

interface ResearchPaperEntry {
  paperTitle: string;
  publicationName: string;
  publicationDate: string;
  paperLink: string;
  doi?: string;
  facultyName: string;
  paperType: string;
}

interface CertificationEntry {
  type: string;
  eventName: string;
  date: string;
  fileUrl: string;
}

interface ProjectEntry {
  projectName: string;
  projectDescription: string;
  projectGuide: string;
  projectStatus: "ongoing" | "completed";
  githubRepoUrl?: string;
  hostedUrl?: string;
}

interface StudentDetailData {
  name: string;
  CRN: string;
  URN: string;
  section: string;
  photo?: string;
  fatherName?: string;
  motherName?: string;
  email?: string;
  permanentAdd?: string;
  category?: string;
  dob?: string;
  advisor?: { name: string; email: string; Emp_id: string };
  stmobile?: string;
  fmobile?: string;
  mmobile?: string;
  admDate?: string;
  passingYear?: string;
  trainings?: TrainingEntry[];
  placements?: PlacementEntry[];
  researchPapers?: ResearchPaperEntry[];
  certifications?: CertificationEntry[];
  projects?: ProjectEntry[];
}

export default function StudentDetail() {
  const searchParams = useSearchParams();
  const roll = searchParams.get("roll");
  const [student, setStudent] = useState<StudentDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedTraining, setExpandedTraining] = useState<number | null>(null);
  const [expandedPlacement, setExpandedPlacement] = useState<number | null>(null);
  const [expandedCertification, setExpandedCertification] = useState<number | null>(null);
  const [expandedResearch, setExpandedResearch] = useState<number | null>(null);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!roll) {
      setError("No student selected");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const studentsRes = await axios.get("http://localhost:5000/api/teacher/mystudents", {
          withCredentials: true,
        });
        const allStudents = studentsRes.data.students;
        const selectedStudent = allStudents.find((s: any) => s.CRN === roll);
        if (!selectedStudent) {
          setError("Student not found");
          setLoading(false);
          return;
        }

        const studentId = selectedStudent._id;

        const personalRes = await axios.get("http://localhost:5000/api/student-info", {
          withCredentials: true,
        });
        const personalDataRaw = personalRes.data.data.find(
          (p: any) => p.student && p.student._id === studentId
        );
        const personalData = personalDataRaw || {};

        const trainingRes = await axios.get("http://localhost:5000/api/Training/all", {
          withCredentials: true,
        });
        const trainings: TrainingEntry[] = trainingRes.data.data
          .filter((t: any) => t.student._id === studentId)
          .map((t: any) => ({
            trainingField: t.trainingField,
            organisationName: t.organisationName,
            organisationDetails: t.organisationDetails,
            organisationSupervisor: t.organisationSupervisor,
            fieldOfWork: t.fieldOfWork,
            projectsMade: t.projectsMade,
            projectDescription: t.projectDescription,
            trainingDuration: t.trainingDuration,
            certificateAwarded: t.certificateAwarded,
            certificatePdf: t.certificatepdf,
          }));

        const certRes = await axios.get("http://localhost:5000/api/Certificate/all", {
          withCredentials: true,
        });
        const certifications: CertificationEntry[] = certRes.data.data
          .filter((c: any) => c.student._id === studentId)
          .map((c: any) => ({
            type: c.type,
            eventName: c.eventName,
            date: c.date,
            fileUrl: c.certificateUrl,
          }));

        const placementRes = await axios.get("http://localhost:5000/api/Placement/allPlacements", {
          withCredentials: true,
        });
        const placements: PlacementEntry[] = placementRes.data.data
          .filter((p: any) => p.student._id === studentId)
          .map((p: any) => ({
            companyName: p.companyName,
            role: p.role,
            package: p.package,
            companyDescription: p.companyDescription,
            yearOfPlacement: p.yearOfPlacement,
            offerLetterUrl: p.offerLetterUrl,
          }));

        const paperRes = await axios.get("http://localhost:5000/api/Research/studentpapers", {
          withCredentials: true,
        });
        const researchPapers: ResearchPaperEntry[] = paperRes.data.data
          .filter((r: any) => r.student._id === studentId)
          .map((r: any) => ({
            paperTitle: r.paperTitle,
            publicationName: r.journalName,
            publicationDate: r.date,
            paperLink: r.linkOfPaper,
            doi: r.doi,
            facultyName: r.facultyMentor,
            paperType: r.type,
          }));

        const projectRes = await axios.get("http://localhost:5000/api/Projects", {
          withCredentials: true,
        });

        const projects: ProjectEntry[] = projectRes.data.data
          .filter((p: any) => p.student._id === studentId)
          .map((p: any) => ({
            projectName: p.projectName,
            projectDescription: p.projectDescription,
            projectGuide: p.projectGuide,
            projectStatus: p.projectStatus ?? "ongoing",
            githubRepoUrl: p.githubRepoUrl,
            hostedUrl: p.hostedUrl,
          }));

        setStudent({
          name: selectedStudent.name,
          CRN: selectedStudent.CRN,
          URN: selectedStudent.URN,
          section: selectedStudent.section,
          photo: selectedStudent.photo || "/images/profile.png",
          fatherName: personalData.fatherName,
          motherName: personalData.motherName,
          email: personalData.email || selectedStudent.email,
          permanentAdd: personalData.permanentAddress,
          category: personalData.category,
          dob: personalData.dob,
          advisor: personalData.advisor,
          stmobile: personalData.studentMobile,
          fmobile: personalData.fatherMobile,
          mmobile: personalData.motherMobile,
          admDate: personalData.admissionDate,
          passingYear: personalData.passingYear,
          trainings,
          placements,
          certifications,
          researchPapers,
          projects,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch student data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roll]);

  if (loading) return <p className="p-6 text-indigo-700">Loading student details...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!student) return <p className="p-6 text-red-500">Student not found.</p>;

  const renderSection = (title: string, content: React.ReactNode, color: string) => (
    <section className={`bg-white p-4 rounded-xl shadow-md border-l-4 ${color} mb-6`}>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {content}
    </section>
  );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF]">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition duration-200"
          aria-label="Go back"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center gap-6 mb-6">
        <img
          src={student.photo}
          alt={student.name}
          className="w-24 h-24 rounded-full border-4 border-indigo-500 object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold text-indigo-700">{student.name}</h1>
          <p className="text-gray-600">
            CRN: {student.CRN} | URN: {student.URN} | Section: {student.section}
          </p>
        </div>
      </div>

      {/* Personal Info */}
      {renderSection(
        "Personal Information",
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><strong>Father's Name:</strong> {student.fatherName || "N/A"}</p>
          <p><strong>Mother's Name:</strong> {student.motherName || "N/A"}</p>
          <p><strong>Email:</strong> {student.email || "N/A"}</p>
          <p><strong>DOB:</strong> {student.dob || "N/A"}</p>
          <p><strong>Category:</strong> {student.category || "N/A"}</p>
          <p><strong>Advisor:</strong> {student.advisor?.name || "N/A"}</p>
          <p><strong>Student Mobile:</strong> {student.stmobile || "N/A"}</p>
          <p><strong>Father Mobile:</strong> {student.fmobile || "N/A"}</p>
          <p><strong>Mother Mobile:</strong> {student.mmobile || "N/A"}</p>
          <p><strong>Admission Date:</strong> {student.admDate || "N/A"}</p>
          <p><strong>Passing Year:</strong> {student.passingYear || "N/A"}</p>
          <p className="md:col-span-2"><strong>Permanent Address:</strong> {student.permanentAdd || "N/A"}</p>
        </div>,
        "border-indigo-500"
      )}

      {/* Trainings */}
      {(student.trainings ?? []).length > 0 &&
        renderSection(
          "Trainings",
          <div className="space-y-3">
            {(student.trainings ?? []).map((t, idx) => (
              <div key={idx} className="border rounded-lg bg-green-50">
                <button
                  onClick={() => setExpandedTraining(expandedTraining === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-3 font-semibold text-green-700 hover:bg-green-100 transition"
                >
                  <span>{t.trainingField} — {t.organisationName}</span>
                  <span className="text-sm text-gray-500">
                    {expandedTraining === idx ? "▲ Hide" : "▼ View"}
                  </span>
                </button>
                {expandedTraining === idx && (
                  <div className="p-3 text-gray-700 border-t border-green-200 space-y-2">
                    <p><strong>Details:</strong> {t.organisationDetails}</p>
                    <p><strong>Supervisor:</strong> {t.organisationSupervisor}</p>
                    <p><strong>Field:</strong> {t.fieldOfWork}</p>
                    <p><strong>Projects:</strong> {t.projectsMade}</p>
                    <p><strong>Description:</strong> {t.projectDescription}</p>
                    <p><strong>Duration:</strong> {t.trainingDuration || "N/A"}</p>
                    <p><strong>Certificate Awarded:</strong> {t.certificateAwarded ? "Yes" : "No"}</p>
                    
                    {/* ✅ View and Download Certificate */}
                    {t.certificatePdf && (
                      <div className="flex gap-3 mt-2">
                        <a
                          href={getInlineViewUrl(t.certificatePdf)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          View Certificate
                        </a>
                        <a
                          href={t.certificatePdf}
                          download
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Download
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>,
          "border-green-500"
        )}

      {/* Placements */}
      {(student.placements ?? []).length > 0 &&
        renderSection(
          "Placements",
          <div className="space-y-3">
            {(student.placements ?? []).map((p, idx) => (
              <div key={idx} className="border rounded-lg bg-yellow-50">
                <button
                  onClick={() => setExpandedPlacement(expandedPlacement === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-3 font-semibold text-yellow-700 hover:bg-yellow-100 transition"
                >
                  <span>{p.companyName} — {p.role}</span>
                  <span className="text-sm text-gray-500">
                    {expandedPlacement === idx ? "▲ Hide" : "▼ View"}
                  </span>
                </button>
                {expandedPlacement === idx && (
                  <div className="p-3 text-gray-700 border-t border-yellow-200 space-y-2">
                    <p><strong>Role:</strong> {p.role}</p>
                    <p><strong>Package:</strong> {p.package || "N/A"}</p>
                    <p><strong>Year:</strong> {p.yearOfPlacement}</p>
                    <p><strong>Description:</strong> {p.companyDescription || "N/A"}</p>
                    
                    {/* ✅ View and Download Offer Letter */}
                    {p.offerLetterUrl && (
                      <div className="flex gap-3 mt-2">
                        <a
                          href={getInlineViewUrl(p.offerLetterUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                        >
                          View Offer Letter
                        </a>
                        <a
                          href={p.offerLetterUrl}
                          download
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Download
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>,
          "border-yellow-500"
        )}

      {/* Certifications */}
      {(student.certifications ?? []).length > 0 &&
        renderSection(
          "Certifications",
          <div className="space-y-3">
            {(student.certifications ?? []).map((c, idx) => (
              <div key={idx} className="border rounded-lg bg-purple-50">
                <button
                  onClick={() => setExpandedCertification(expandedCertification === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-3 font-semibold text-purple-700 hover:bg-purple-100 transition"
                >
                  <span>{c.eventName}</span>
                  <span className="text-sm text-gray-500">
                    {expandedCertification === idx ? "▲ Hide" : "▼ View"}
                  </span>
                </button>
                {expandedCertification === idx && (
                  <div className="p-3 text-gray-700 border-t border-purple-200 space-y-2">
                    <p><strong>Type:</strong> {c.type}</p>
                    <p><strong>Date:</strong> {new Date(c.date).toLocaleDateString()}</p>
                    
                    {/* ✅ View and Download Certificate */}
                    {c.fileUrl && (
                      <div className="flex gap-3 mt-2">
                        <a
                          href={getInlineViewUrl(c.fileUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                        >
                          View Certificate
                        </a>
                        <a
                          href={c.fileUrl}
                          download
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Download
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>,
          "border-purple-500"
        )}

      {/* Research Papers */}
      {(student.researchPapers ?? []).length > 0 &&
        renderSection(
          "Research Papers",
          <div className="space-y-3">
            {(student.researchPapers ?? []).map((r, idx) => (
              <div key={idx} className="border rounded-lg bg-pink-50">
                <button
                  onClick={() => setExpandedResearch(expandedResearch === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-3 font-semibold text-pink-700 hover:bg-pink-100 transition"
                >
                  <span>{r.paperTitle}</span>
                  <span className="text-sm text-gray-500">
                    {expandedResearch === idx ? "▲ Hide" : "▼ View"}
                  </span>
                </button>
                {expandedResearch === idx && (
                  <div className="p-3 text-gray-700 border-t border-pink-200 space-y-2">
                    <p><strong>Publication:</strong> {r.publicationName}</p>
                    <p><strong>Type:</strong> {r.paperType}</p>
                    <p><strong>Date:</strong> {new Date(r.publicationDate).toLocaleDateString()}</p>
                    <p><strong>Faculty Mentor:</strong> {r.facultyName}</p>
                    {r.doi && <p><strong>DOI:</strong> {r.doi}</p>}
                    
                    {/* ✅ View Paper Link */}
                    {r.paperLink && (
                      <a
                        href={r.paperLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition mt-2"
                      >
                        View Paper
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>,
          "border-pink-500"
        )}

      {/* Projects */}
      {(student.projects ?? []).length > 0 &&
        renderSection(
          "Projects",
          <div className="space-y-3">
            {(student.projects ?? []).map((p, idx) => (
              <div key={idx} className="border rounded-lg bg-indigo-50">
                <button
                  onClick={() => setExpandedProject(expandedProject === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-3 font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                >
                  <span>{p.projectName}</span>
                  <span className="text-sm text-gray-500">
                    {expandedProject === idx ? "▲ Hide" : "▼ View"}
                  </span>
                </button>

                {expandedProject === idx && (
                  <div className="p-3 text-gray-700 border-t border-indigo-200 space-y-2">
                    <p><strong>Guide:</strong> {p.projectGuide}</p>
                    <p><strong>Status:</strong> <span className="capitalize">{p.projectStatus}</span></p>
                    <p><strong>Description:</strong> {p.projectDescription}</p>

                    {/* ✅ Project Links */}
                    <div className="flex gap-3 mt-2 flex-wrap">
                      {p.githubRepoUrl && (
                        <a
                          href={p.githubRepoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
                        >
                          GitHub Repository
                        </a>
                      )}

                      {p.hostedUrl && (
                        <a
                          href={p.hostedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                          Live Project
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>,
          "border-indigo-500"
        )}
    </div>
  );
}