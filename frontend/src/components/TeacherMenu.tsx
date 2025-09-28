import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/teacher.png",
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/parent.png",
        label: "Parents",
        href: "/list/parents",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/profile.png",
        label: "Student Info",
        href: "/list/StudentInfo",
        visible: ["admin", "teacher", "student", "parent"],
      },

      {
        icon: "/result.png",
        label: "Results",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
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
        icon: "/calendar.png", 
        label: "Duty Leaves",
        href: "/dashboard/DutyLeaves",
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
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const TeacherMenu = () => {
    return (
        <div className="mt-4 text-sm">{menuItems.map((i)=>(
            <div className="flex flex-col gap-2" key={i.title}>
                <span className="hidden lg:block text-gray-400 font-light my-2">{i.title}</span>
                {i.items.map((item)=>{
                    if(item.visible.includes(role)){
                 return (
                 <Link href={item.href} key={item.label} className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-MyskyLight">
                 <Image src={item.icon} alt="" width={20} height={20}></Image>
                 <span className="hidden lg:block">{item.label}</span>
                  </Link>
                        );
                    }

                })}
            </div>
        ))}</div>
    )
}

export default TeacherMenu

