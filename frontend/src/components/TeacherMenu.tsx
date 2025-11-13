"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/dashboard/teacher",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/calendar.png",
        label: "Duty Leave Approvals",
        href: "/dashboard/teacher/dutyleaveapproval",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/profile.png",
        label: "Student Info",
        href: "/teacherlist/TeacherInfo",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/result.png",
        label: "Results",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/assignment.png",
        label: "Research Paper",
        href: "/teacherlist/TresearchPapers",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/calendar.png",
        label: "Training (tr1,tr2,tr3)",
        href: "/teacherlist/Ttraining",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/message.png",
        label: "Placements & Internships",
        href: "/teacherlist/TplacementsInternships",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/award.png",
        label: "Certifications",
        href: "/teacherlist/TCertifications",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/project.png",
        label: "Projects",
        href: "/teacherlist/Tprojects",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/announcement.png",
        label: "Activities",
        href: "/teacherlist/Tactivities",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/list/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/list/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const TeacherMenu = () => {
  const [role, setRole] = useState<string>("teacher");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== "undefined") {
      const userRole = localStorage.getItem("userRole") || 
                       localStorage.getItem("role") || 
                       "teacher";
      setRole(userRole);
      console.log("Current role:", userRole);
    }
  }, []);

  if (!mounted) {
    return <div className="mt-4 text-sm">Loading...</div>;
  }

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-2">
            {section.title}
          </span>
          {section.items.map((item) => {
            if (item.visible && item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-MyskyLight"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
};

export default TeacherMenu;