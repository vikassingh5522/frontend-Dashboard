"use client";

import Sidebar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import portfolio from "../data/portfolio.json";

export default function SummaryPage() {
  const totalInvestment = portfolio.reduce(
    (sum, r) => sum + r.purchasePrice * r.qty,
    0
  );

  const currentValue = totalInvestment * 1.12;
  const gainLoss = currentValue - totalInvestment;

  return (
    <div className="min-h-screen bg-gray-100 flex">


      <Sidebar />


      <div className="flex-2 ml-64 p-7">
        <h1 className="text-4xl font-extra mb-10 text-black flex items-center gap-3">
          📊 Summary Overview
        </h1>

        <SummaryCards
          totalInvestment={totalInvestment}
          currentValue={currentValue}
          gainLoss={gainLoss}
          count={portfolio.length}
        />
      </div>
    </div>
  );
}
