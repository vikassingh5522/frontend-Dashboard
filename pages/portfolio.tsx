"use client";

import Sidebar from "../components/Navbar";
import PortfolioTable from "../components/PortfolioTable";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex">

      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        <PortfolioTable />
      </div>
    </div>
  );
}
