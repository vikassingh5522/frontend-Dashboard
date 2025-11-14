"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import { PieChart } from "../components/PieChart";
import BarChart from "../components/BarChart";

import portfolio from "../data/portfolio.json";


interface PortfolioRow {
  symbol: string;
  sector?: string;
  purchasePrice: number;
  qty: number;
  cmp?: number | null;
  peRatio?: number | null;
  earnings?: number | null;
}

export default function Dashboard() {
  const [rows, setRows] = useState<PortfolioRow[]>(portfolio);

  const fetchLiveData = async () => {
    const updated = await Promise.all(
      rows.map(async (row) => {
        try {
          const priceRes = await axios.get(
            `http://localhost:5000/api/price/${row.symbol}`
          );
          const detailsRes = await axios.get(
            `http://localhost:5000/api/details/${row.symbol}`
          );

          return {
            ...row,
            cmp: priceRes.data.price,
            peRatio: detailsRes.data.pe,
            earnings: detailsRes.data.earnings,
          };
        } catch {
          return { ...row, cmp: null, peRatio: null, earnings: null };
        }
      })
    );

    setRows(updated);
  };

 
  useEffect(() => {
    // fetchLiveData();
    const interval = setInterval(fetchLiveData, 15000);
    return () => clearInterval(interval);
  }, []); 

  

  const totalInvestment = rows.reduce(
    (sum, r) => sum + r.purchasePrice * r.qty,
    0
  );

  const currentValue = rows.reduce(
    (sum, r) => (r.cmp ? sum + r.cmp * r.qty : sum),
    0
  );

  const gainLoss = currentValue - totalInvestment;

  const labels = rows.map((r) => r.symbol);
  const investedValues = rows.map((r) => r.purchasePrice * r.qty);
  const presentValues = rows.map((r) => (r.cmp ? r.cmp * r.qty : 0));

  const sectorLabels = [...new Set(rows.map((r) => r.sector || "Unknown"))];
  const sectorTotals = sectorLabels.map((sector) =>
    rows
      .filter((r) => r.sector === sector)
      .reduce((sum, r) => sum + r.purchasePrice * r.qty, 0)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          📊 Dashboard Overview
        </h1>

        <SummaryCards
          totalInvestment={totalInvestment}
          currentValue={currentValue}
          gainLoss={gainLoss}
          count={rows.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
          <PieChart labels={sectorLabels} values={sectorTotals} />
          <BarChart
            labels={labels}
            invested={investedValues}
            present={presentValues}
          />
        </div>
      </div>
    </div>
  );
}
