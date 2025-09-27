import TeacherMenu from "@/components/TeacherMenu";
import TeacherNavbar from "@/components/TeacherNavbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image src="/logo.png" alt="logo" width={42} height={42} />
          <span className="hidden lg:block">TheGenconians-GMS</span>
        </Link>
        <TeacherMenu/>

      </div>

      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] flex flex-col">
        <TeacherNavbar/>
        
        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} TheGenconians-GMS. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
