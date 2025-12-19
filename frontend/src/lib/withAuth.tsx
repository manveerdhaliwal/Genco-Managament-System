"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "admin" | "teacher" | "student";

export function withAuth({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: Role[];
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole") as Role | null;

    if (!token || !role) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(role)) {
      router.replace("/unauthorized");
      return;
    }

    setAuthorized(true);
  }, [router, allowedRoles]);

  // ⛔ STOP RENDER until verified
  if (!authorized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking permissions...</p>
      </div>
    );
  }

  return <>{children}</>;
}
