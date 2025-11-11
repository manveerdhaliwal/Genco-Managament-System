import { NextResponse } from "next/server";
import OpenAI from "openai";
import { connectToDatabase } from "@/lib/mongodb";

import Student from "@/server/models/Student";
import Teacher from "@/server/models/Teacher";
import StudentInfo from "@/server/models/StudentInfo";
import DutyLeave from "@/server/models/DutyLeave";
import StudentCertificate from "@/server/models/StudentCertificate";
import StudentCertification from "@/server/models/StudentCertification";
import StudentPlacement from "@/server/models/StudentPlacement";
import StudentTraining from "@/server/models/StudentTraining";
import StudentProject from "@/server/models/StudentProject";
import StudentResearch from "@/server/models/StudentResearch";
import Event from "@/server/models/Event";
import StudentBranch from "@/server/models/StudentBranch";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* 🧩 Fetch complete student data */
async function fetchStudentFull(userId) {
  let student = await Student.findById(userId).lean();
  if (!student) return null;

  // ✅ Safely handle branch: either ObjectId or string like "CSE"
  let branchDoc = null;
  if (student.branch && /^[0-9a-fA-F]{24}$/.test(student.branch.toString())) {
    branchDoc = await StudentBranch.findById(student.branch).lean();
  }
  student.branch = branchDoc || { name: student.branch || "Unknown" };

  const [info, leaves, certificates, certifications, placements, trainings, projects, researches] =
    await Promise.all([
      StudentInfo.findOne({ student: userId }).populate("advisor").lean(),
      DutyLeave.find({ student: userId }).lean(),
      StudentCertificate.find({ student: userId }).lean(),
      StudentCertification.find({ student: userId }).lean(),
      StudentPlacement.find({ student: userId }).lean(),
      StudentTraining.find({ student: userId }).lean(),
      StudentProject.find({ student: userId }).lean(),
      StudentResearch.find({ student: userId }).lean(),
    ]);

  return {
    ...student,
    info,
    leaves: leaves || [],
    certificates: certificates || [],
    certifications: certifications || [],
    placements: placements || [],
    trainings: trainings || [],
    projects: projects || [],
    researches: researches || [],
  };
}

/* 🎓 Fetch all students data for teacher */
async function fetchAllStudentsData() {
  const students = await Student.find().lean();

  // ✅ Fix: safely populate branch if ObjectId, else keep string
  const studentsWithBranch = await Promise.all(
    students.map(async (s) => {
      let branchDoc = null;
      if (s.branch && /^[0-9a-fA-F]{24}$/.test(s.branch.toString())) {
        branchDoc = await StudentBranch.findById(s.branch).lean();
      }
      return { ...s, branch: branchDoc || { name: s.branch || "Unknown" } };
    })
  );

  const fullData = await Promise.all(
    studentsWithBranch.map(async (student) => {
      const data = await fetchStudentFull(student._id);
      return data;
    })
  );

  return fullData;
}

/* 🔍 Find student by name, CRN, or URN */
async function findStudentByQuery(query) {
  const searchTerm = query.trim();

  const student = await Student.findOne({
    $or: [
      { CRN: { $regex: searchTerm, $options: "i" } },
      { URN: { $regex: searchTerm, $options: "i" } },
      { name: { $regex: searchTerm, $options: "i" } },
    ],
  }).lean();

  // ✅ Handle branch safely
  if (student) {
    let branchDoc = null;
    if (student.branch && /^[0-9a-fA-F]{24}$/.test(student.branch.toString())) {
      branchDoc = await StudentBranch.findById(student.branch).lean();
    }
    student.branch = branchDoc || { name: student.branch || "Unknown" };
  }

  return student;
}

/* 🎯 Intent Detection */
function detectIntent(text) {
  text = text.toLowerCase();

  // Student-specific
  if (text.includes("my leave") || text.includes("my duty")) return "leave";
  if (text.includes("my certificate")) return "certificate";
  if (text.includes("my certification")) return "certification";
  if (text.includes("my training")) return "training";
  if (text.includes("my project")) return "project";
  if (text.includes("my placement")) return "placement";
  if (text.includes("my research")) return "research";
  if (["my name", "my branch", "my email", "my year", "my section"].some((k) => text.includes(k)))
    return "personal";

  // Teacher-specific
  if (text.includes("all students") || text.includes("list students")) return "all_students";
  if (text.includes("student") && (text.includes("find") || text.includes("search") || text.includes("get")))
    return "find_student";
  if (text.includes("statistics") || text.includes("stats") || text.includes("summary"))
    return "statistics";
  if (text.includes("leave") || text.includes("leaves")) return "teacher_leave_query";
  if (text.includes("placement") || text.includes("placements")) return "teacher_placement_query";
  if (text.includes("project") || text.includes("projects")) return "teacher_project_query";
  if (text.includes("research")) return "teacher_research_query";
  if (text.includes("certificate") || text.includes("certificates")) return "teacher_certificate_query";

  if (text.includes("event")) return "event";

  return "unknown";
}

/* 📊 Generate statistics */
async function generateStatistics() {
  const [
    totalStudents,
    totalLeaves,
    approvedLeaves,
    pendingLeaves,
    totalPlacements,
    totalProjects,
    totalResearch,
    totalCertificates,
  ] = await Promise.all([
    Student.countDocuments(),
    DutyLeave.countDocuments(),
    DutyLeave.countDocuments({ overall_status: "Fully Approved" }),
    DutyLeave.countDocuments({ overall_status: "Pending" }),
    StudentPlacement.countDocuments(),
    StudentProject.countDocuments(),
    StudentResearch.countDocuments(),
    StudentCertificate.countDocuments(),
  ]);

  return {
    totalStudents,
    leaves: { total: totalLeaves, approved: approvedLeaves, pending: pendingLeaves },
    totalPlacements,
    totalProjects,
    totalResearch,
    totalCertificates,
  };
}

/* 🧠 Main Chat API */
export async function POST(req) {
  try {
    await connectToDatabase();
    const { userRole, userId, message } = await req.json();

    console.log("📥 Request:", { userRole, userId, message });

    if (!userRole || !message) {
      return NextResponse.json({ error: "Missing role or message" }, { status: 400 });
    }

    const intent = detectIntent(message);
    let reply = "";

    // 🧑‍🏫 TEACHER MODE
    if (userRole === "teacher") {
      const teacher = await Teacher.findById(userId).lean();
      if (!teacher) {
        return NextResponse.json({ reply: "Teacher account not found." }, { status: 200 });
      }

      switch (intent) {
        case "all_students":
          const studentsRaw = await Student.find().lean();
          const allStudents = await Promise.all(
            studentsRaw.map(async (s) => {
              let branchDoc = null;
              if (s.branch && /^[0-9a-fA-F]{24}$/.test(s.branch.toString())) {
                branchDoc = await StudentBranch.findById(s.branch).lean();
              }
              return { ...s, branch: branchDoc || { name: s.branch || "Unknown" } };
            })
          );
          reply = `There are ${allStudents.length} students in the database. Branches: ${[
            ...new Set(allStudents.map((s) => s.branch?.name)),
          ].join(", ")}. Ask me about specific students or statistics!`;
          break;

        case "find_student":
          const nameMatch = message.match(/student\s+([a-zA-Z\s]+)/i);
          if (nameMatch) {
            const student = await findStudentByQuery(nameMatch[1]);
            if (student) {
              const fullData = await fetchStudentFull(student._id);
              reply =
                `Found ${student.name} (${student.CRN})\n` +
                `Branch: ${student.branch?.name}, Year: ${student.year}, Section: ${student.section}\n` +
                `Email: ${student.email}\n` +
                `Leaves: ${fullData.leaves.length} | Projects: ${fullData.projects.length} | Placements: ${fullData.placements.length}`;
            } else {
              reply = `No student found matching "${nameMatch[1]}". Try using their full name, CRN, or URN.`;
            }
          } else {
            reply = "Please specify a student name, CRN, or URN. Example: 'Find student John Doe'";
          }
          break;

        case "statistics":
          const stats = await generateStatistics();
          reply =
            `📊 Database Statistics:\n` +
            `Total Students: ${stats.totalStudents}\n` +
            `Leaves: ${stats.leaves.total} (${stats.leaves.approved} approved, ${stats.leaves.pending} pending)\n` +
            `Placements: ${stats.totalPlacements}\n` +
            `Projects: ${stats.totalProjects}\n` +
            `Research Papers: ${stats.totalResearch}\n` +
            `Certificates: ${stats.totalCertificates}`;
          break;

        case "teacher_leave_query":
          const leaves = await DutyLeave.find()
            .populate("student", "name CRN branch")
            .populate("advisor", "name")
            .limit(10)
            .lean();
          reply = leaves.length
            ? `Recent ${leaves.length} leave applications:\n` +
              leaves.map((l) => `- ${l.student?.name} (${l.event_name}): ${l.overall_status}`).join("\n")
            : "No leave applications found.";
          break;

        case "teacher_placement_query":
          const placements = await StudentPlacement.find()
            .populate("student", "name CRN")
            .limit(10)
            .lean();
          reply = placements.length
            ? `Recent ${placements.length} placements:\n` +
              placements.map((p) => `- ${p.student?.name}: ${p.companyName} (${p.role})`).join("\n")
            : "No placement records found.";
          break;

        case "teacher_project_query":
          const projects = await StudentProject.find()
            .populate("student", "name CRN")
            .limit(10)
            .lean();
          reply = projects.length
            ? `Recent ${projects.length} projects:\n` +
              projects.map((p) => `- ${p.student?.name}: ${p.projectName}`).join("\n")
            : "No project records found.";
          break;

        case "teacher_research_query":
          const research = await StudentResearch.find()
            .populate("student", "name CRN")
            .limit(10)
            .lean();
          reply = research.length
            ? `Recent ${research.length} research papers:\n` +
              research.map((r) => `- ${r.student?.name}: ${r.paperTitle}`).join("\n")
            : "No research papers found.";
          break;

        case "event":
          const events = await Event.find().sort({ date: -1 }).limit(5).lean();
          reply = events.length
            ? `Recent events:\n` +
              events.map((e) => `- ${e.title} (${new Date(e.date).toDateString()})`).join("\n")
            : "No events found.";
          break;

        default:
          reply =
            "As a teacher, you can ask me:\n" +
            "- 'Show all students' or 'List students'\n" +
            "- 'Find student [name/CRN/URN]'\n" +
            "- 'Show statistics' or 'Database summary'\n" +
            "- 'Show leaves/placements/projects/research'\n" +
            "- 'Recent events'";
      }
    }

    // 🧍 STUDENT MODE
    else if (userRole === "student") {
      if (!userId) {
        return NextResponse.json({ reply: "Student ID not found. Please log in again." }, { status: 200 });
      }

      const student = await fetchStudentFull(userId);
      if (!student) {
        return NextResponse.json({ reply: "Student record not found." }, { status: 200 });
      }

      switch (intent) {
        case "personal":
          reply = `Your name is ${student.name}, from ${student.branch?.name || "N/A"} branch. ` +
            `Year ${student.year}, Section ${student.section}. Email: ${student.email}. CRN: ${student.CRN}`;
          break;

        case "leave":
          const approved = student.leaves.filter((l) => l.overall_status === "Fully Approved").length;
          const pending = student.leaves.filter((l) => l.overall_status === "Pending").length;
          const rejected = student.leaves.filter((l) => l.overall_status === "Rejected").length;
          reply =
            `You have ${student.leaves.length} total leave applications: ` +
            `${approved} approved, ${pending} pending, ${rejected} rejected.`;
          break;

        case "certificate":
          reply = student.certificates.length
            ? `You have ${student.certificates.length} certificates: ${student.certificates
                .map((c) => c.eventName)
                .join(", ")}.`
            : "You haven't uploaded any certificates yet.";
          break;

        case "certification":
          reply = student.certifications.length
            ? `You have ${student.certifications.length} certifications: ${student.certifications
                .map((c) => c.nameOfCertification)
                .join(", ")}.`
            : "No certifications found.";
          break;

        case "training":
          reply = student.trainings.length
            ? `Trainings: ${student.trainings.map((t) => t.organisationName).join(", ")}.`
            : "No training records found.";
          break;

        case "project":
          reply = student.projects.length
            ? `Projects: ${student.projects.map((p) => p.projectName).join(", ")}.`
            : "No project records found.";
          break;

        case "placement":
          reply = student.placements.length
            ? `Placements: ${student.placements
                .map((p) => `${p.companyName} (${p.role})`)
                .join(", ")}.`
            : "No placement records found.";
          break;

        case "research":
          reply = student.researches.length
            ? `Research Papers: ${student.researches.map((r) => r.paperTitle).join(", ")}.`
            : "No research papers found.";
          break;

        case "event":
          const events = await Event.find().sort({ date: -1 }).limit(3).lean();
          reply = events.length
            ? `Recent events: ${events
                .map((e) => `${e.title} on ${new Date(e.date).toDateString()}`)
                .join("; ")}.`
            : "No recent events found.";
          break;

        default:
          reply =
            "I can help you with:\n" +
            "- Your personal info (name, branch, email)\n" +
            "- Your leaves, certificates, certifications\n" +
            "- Your trainings, projects, placements, research\n" +
            "- Recent events";
      }
    }

    // 🤖 AI fallback
    if (intent === "unknown" && reply === "") {
      try {
        const context =
          userRole === "teacher"
            ? "You are helping a teacher. They can query student data, statistics, and records."
            : "You are helping a student. They can ask about their own academic records.";

        const prompt = `${context}\nUser asked: "${message}"\nProvide a helpful, concise response.`;

        const aiRes = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: prompt }],
          max_tokens: 150,
        });

        reply = aiRes.choices[0]?.message?.content || "I'm not sure how to answer that.";
      } catch (aiError) {
        console.error("OpenAI error:", aiError);
        reply = "Sorry, I'm having trouble processing your request.";
      }
    }

    console.log("✅ Reply:", reply);
    return NextResponse.json({ reply }, { status: 200 });
  } catch (err) {
    console.error("❌ Chat error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
