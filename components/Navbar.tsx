"use client";

import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-indigo-700 text-white shadow-lg transition-all duration-300 
      ${open ? "w-64" : "w-20"}`}
    >
     
      <button
        onClick={() => setOpen(!open)}
        className="text-white text-xl mt-4 ml-4"
      >
        {open ? "⬅️" : "➡️"}
      </button>

      <div className="mt-10 flex flex-col gap-6 text-lg font-semibold px-4">

        <Link href="/" className="hover:text-yellow-300 flex items-center gap-3">
          📊 {open && "Dashboard"}
        </Link>

        <Link href="/summary" className="hover:text-yellow-300 flex items-center gap-3">
          📘 {open && "Summary"}
        </Link>

        <Link href="/charts" className="hover:text-yellow-300 flex items-center gap-3">
          📉 {open && "Charts"}
        </Link>

        <Link href="/portfolio" className="hover:text-yellow-300 flex items-center gap-3">
          📂 {open && "Portfolio"}
        </Link>
      </div>
    </div>
  );
}
