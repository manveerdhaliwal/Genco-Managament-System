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
// ✅ ADD THIS MISSING IMPORT
import StudentBranch from "@/server/models/StudentBranch";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* 🧩 Connect and fetch complete student data */
async function fetchStudentFull(userId) {
  const student = await Student.findById(userId)
    .populate("branch")
    .lean();

  if (!student) return null;

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
    researches: researches || [] 
  };
}

/* 🎯 Intent Detection */
function detectIntent(text) {
  text = text.toLowerCase();
  if (text.includes("leave")) return "leave";
  if (text.includes("certificate")) return "certificate";
  if (text.includes("certification")) return "certification";
  if (text.includes("training")) return "training";
  if (text.includes("project")) return "project";
  if (text.includes("placement")) return "placement";
  if (text.includes("research")) return "research";
  if (text.includes("event")) return "event";
  if (["name", "branch", "email", "year", "section"].some((k) => text.includes(k)))
    return "personal";
  return "unknown";
}

/* 🧠 Chat API */
export async function POST(req) {
  try {
    await connectToDatabase();
    const { userRole, userId, message, queryStudentId } = await req.json();

    console.log("📥 Request:", { userRole, userId, message });

    if (!userRole || !message)
      return NextResponse.json({ error: "Missing role or message" }, { status: 400 });

    const intent = detectIntent(message);
    let reply = "";

    // 🧍 STUDENT MODE
    if (userRole === "student") {
      const student = await fetchStudentFull(userId);
      if (!student)
        return NextResponse.json({ reply: "Student not found" }, { status: 200 });

      switch (intent) {
        case "personal":
          reply = `Your name is ${student.name}, from ${student.branch?.name || "N/A"} branch. Year ${student.year}, Section ${student.section}, Email: ${student.email}.`;
          break;
        case "leave":
          const approved = (student.leaves || []).filter((l) => l.overall_status === "Fully Approved").length;
          const pending = (student.leaves || []).filter((l) => l.overall_status === "Pending").length;
          const rejected = (student.leaves || []).filter((l) => l.overall_status === "Rejected").length;
          reply = `You have ${approved} approved, ${pending} pending, and ${rejected} rejected leaves.`;
          break;
        case "certificate":
          reply = (student.certificates || []).length
            ? `You have ${student.certificates.length} certificates: ${student.certificates.map((c) => c.eventName).join(", ")}.`
            : "You haven't uploaded any certificates yet.";
          break;
        case "certification":
          reply = (student.certifications || []).length
            ? `You have ${student.certifications.length} certifications: ${student.certifications.map((c) => c.nameOfCertification).join(", ")}.`
            : "No certifications found.";
          break;
        case "training":
          reply = (student.trainings || []).length
            ? `Trainings: ${student.trainings.map((t) => t.organisationName).join(", ")}.`
            : "No training record found.";
          break;
        case "project":
          reply = (student.projects || []).length
            ? `Projects: ${student.projects.map((p) => p.projectName).join(", ")}.`
            : "No project record found.";
          break;
        case "placement":
          reply = (student.placements || []).length
            ? `Placements: ${student.placements.map((p) => `${p.companyName} (${p.role})`).join(", ")}.`
            : "No placement record found.";
          break;
        case "research":
          reply = (student.researches || []).length
            ? `Research Papers: ${student.researches.map((r) => r.paperTitle).join(", ")}.`
            : "No research papers found.";
          break;
        case "event":
          const events = await Event.find().sort({ date: -1 }).limit(3).lean();
          reply = events.length
            ? `Recent events: ${events.map((e) => `${e.title} on ${new Date(e.date).toDateString()}`).join("; ")}.`
            : "No recent events found.";
          break;
        default:
          reply = "Sorry, I can only help with your academic records.";
      }
    }

    // 🧑‍🏫 TEACHER MODE
    else if (userRole === "teacher") {
      if (!queryStudentId) {
        reply = "Please provide a student ID or name to fetch their record.";
      } else {
        const student = await fetchStudentFull(queryStudentId);
        reply = student
          ? `Here's ${student.name}'s record — branch: ${student.branch?.name}, year: ${student.year}.`
          : "No student found with that ID.";
      }
    }

    // 🧠 AI fallback (optional)
    if (intent === "unknown" && reply === "") {
      try {
        const prompt = `You are an academic chatbot. A ${userRole} asked: "${message}".
If related to data, answer shortly. Otherwise, politely say you handle only student/college records.`;

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