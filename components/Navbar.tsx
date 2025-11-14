"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white p-4 shadow-md">
      <div className="flex gap-6 text-lg font-semibold">
        <Link href="/">Dashboard</Link>
        <Link href="/summary">Summary</Link>
        <Link href="/charts">Charts</Link>
        <Link href="/portfolio">Portfolio</Link>
      </div>
    </nav>
  );
}
