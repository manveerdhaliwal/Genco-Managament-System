"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const TeacherNavbar = () => {
    const [user, setUser] = useState({ name: "", role: "" });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/auth/me", {
                    method: "GET",
                    credentials: "include", // ✅ Important for cookies/JWT
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
            
            {/* SEARCH BAR */}
            {/* <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
                <Image src="/search.png" alt="" width={14} height={14}/>
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-[200px] p-2 bg-transparent outline-none"
                />
            </div> */}

            {/* ICONS + USER */}
            <div className="flex items-center gap-6 justify-end w-full">

                {/* <div className="bg-white rounded w-7 h-7 flex items-center justify-center cursor-pointer">
                    <Image src="/message.png" alt="" width={20} height={20}/>
                </div> */}

                {/* <div className="bg-white rounded w-7 h-7 flex items-center justify-center cursor-pointer relative">
                    <Image src="/announcement.png" alt="" width={20} height={20}/>
                    <div className="absolute -top-3 -right-3 w-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
                        1
                    </div>
                </div> */}

                {/* ✅ Dynamic Name & Role */}
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
};

export default TeacherNavbar;
