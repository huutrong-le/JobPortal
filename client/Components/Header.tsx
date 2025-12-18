"use client";
import { useGlobalContext } from "@/context/globalContext";
import { LogIn, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Profile from "./Profile";


function Header() {
  const { isAuthenticated } = useGlobalContext();
  const pathname = usePathname();
  return (
    <header className="px-10 py-6 bg-[#E3F2FF] text-gray-500 flex justify-between items-center">
      <Link href={"/"} className="flex items-center gap-2">
        <Image src="/logo.svg" alt="logo" width={45} height={45} />
        <h1 className="font-extrabold text-2xl text-[#0866FF]">JobFindr</h1>
      </Link>

      <ul className="flex items-center gap-8">
        <li>
          <Link
            href={"/findwork"}
            className={`py-2 px-6 rounded-md ${
              pathname === "/findwork"
                ? "text-[#0866FF] border-[#0866FF] border bg-[#0866FF]/10"
                : ""
            }`}
          >
            Tìm Việc
          </Link>
          <Link
            href={"/myjobs"}
            className={`py-2 px-6 rounded-md ${
              pathname === "/myjobs"
                ? "text-[#0866FF] border-[#0866FF] border bg-[#0866FF]/10"
                : ""
            }`}
          >
            Việc của tôi
          </Link>
          <Link
            href={"/post"}
            className={`py-2 px-6 rounded-md ${
              pathname === "/post"
                ? "text-[#0866FF] border-[#0866FF] border bg-[#0866FF]/10"
                : ""
            }`}
          >
            Đăng Tin
          </Link>
        </li>
      </ul>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <Profile />
        ) : (
          <div className="flex items-center gap-6">
            <Link
              href={"http://localhost:8000/login"}
              className="py-2 px-6 rounded-md border flex items-center gap-4 bg-[#0866FF] text-white border-[#0866FF] hover:bg-[#0866FF]/90 trasition-all duration-200 ease-in-out"
            >
              <LogIn className="w-4 h-4" />
              Đăng nhập
            </Link>
            <Link
              href={"http://localhost:8000/register"}
              className="py-2 px-6 rounded-md border flex items-center gap-4 border-[#0866FF] text-[#0866FF] hover:bg-[#0866FF]/10 trasition-all duration-200 ease-in-out"
            >
              <UserPlus className="w-4 h-4" />
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
