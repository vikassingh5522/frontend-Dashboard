"use client";

import Navbar from "../components/Navbar";
import PortfolioTable from "../components/PortfolioTable";
import portfolio from "../data/portfolio.json";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-6">Portfolio Table</h1>
        <PortfolioTable rows={portfolio} />
      </div>
    </div>
  );
}
