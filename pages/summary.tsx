"use client";

import Navbar from "../components/Navbar";
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
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6">
        <h1 className="text-4xl font-bold mb-6">Summary</h1>

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
