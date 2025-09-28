"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          credentials: "include", // include cookies
        });

        const data = await res.json();

        if (res.ok && data.success) {
          console.log(data.message);
          router.push("/"); // redirect to home page (page.tsx)
        } else {
          console.error("Logout failed:", data.message);
          router.push("/"); // redirect anyway
        }
      } catch (err) {
        console.error("Error logging out:", err);
        router.push("/"); // redirect anyway
      }
    };

    logoutUser();
  }, [router]);

  return <div>Logging out...</div>;
}
