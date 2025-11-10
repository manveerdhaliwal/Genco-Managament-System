"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const Navbar = () => {
    const [user, setUser] = useState({ name: "", role: "" });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/auth/me", {
                    method: "GET",
                    credentials: "include",   // ✅ IMPORTANT
                });

                const data = await res.json();

                if (data.success && data.user) {
                    setUser({
                        name: data.user.name,
                        role: data.user.role,
                    });
                }
            } catch (error) {
                console.log("Error fetching user:", error);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className='flex items-center justify-between p-4'>
            <div className="flex items-center gap-6 justify-end w-full">
                
                <div className="bg-white rounded w-7 h-7 flex items-center justify-center cursor-pointer">
                    <Image src="/message.png" alt="" width={20} height={20}/>
                </div>

                <div className="bg-white rounded w-7 h-7 flex items-center justify-center cursor-pointer relative">
                    <Image src="/announcement.png" alt="" width={20} height={20}/>
                    <div className="absolute -top-3 -right-3 w-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
                        1
                    </div>
                </div>

                {/* ✅ Dynamic Data */}
                <div className="flex flex-col">
                    <span className="text-xs leading-3 font-medium">
                        {user.name || "Loading..."}
                    </span>
                    <span className="text-[10px] text-gray-500 text-right">
                        {user.role || ""}
                    </span>
                </div>

                <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full"/>
            </div>
        </div>
    );
}

export default Navbar;
