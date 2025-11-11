import Link from "next/link";
import { Home, User, BarChart2, Activity, FileText, Book, Briefcase, Award, Users, Send } from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: Home, href: "/" },
  { label: "Student Info", icon: User, href: "/student-info" },
  { label: "Marks & Attendance", icon: BarChart2, href: "/marks" },
  { label: "Activities", icon: Activity, href: "/activities" },
  { label: "Research Papers", icon: FileText, href: "/research" },
  { label: "Training (TR1, TR2, TR3)", icon: Book, href: "/training" },
  { label: "Placements & Internships", icon: Briefcase, href: "/placements" },
  { label: "Certifications", icon: Award, href: "/certifications" },
  { label: "Projects (Minor/Major – Synopsis)", icon: Users, href: "/projects" },
  { label: "Duty Leaves", icon: Send, href: "/duty-leaves" },
  { label: "Social Links", icon: Activity, href: "/social" },
];

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white shadow-md rounded-r-2xl p-4 flex flex-col">
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Link
            key={index}
            href={item.href}
            className="flex items-center gap-3 text-gray-700 hover:bg-blue-100 hover:text-blue-600 p-3 rounded-lg mb-1 transition"
          >
            <Icon size={20} />
            <span className="text-sm">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default Sidebar;

