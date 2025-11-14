"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import Sidebar from "../components/Navbar";
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

  const gainersAndLosers = rows
    .map((r) => ({
      ...r,
      change: r.cmp ? r.cmp - r.purchasePrice : 0,
      percentage: r.cmp
        ? ((r.cmp - r.purchasePrice) / r.purchasePrice) * 100
        : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const topGainer = gainersAndLosers[0];
  const topLoser = gainersAndLosers[gainersAndLosers.length - 1];

  const marketTrend = gainLoss >= 0 ? "Bullish" : "Bearish";
  const trendIcon =
    gainLoss >= 0
      ? "https://img.icons8.com/fluency/96/bull.png"
      : "https://img.icons8.com/fluency/96/bearish.png";

  return (
    <div className="min-h-screen bg-gray-100 flex">


      <Sidebar />


      <div className="flex-1 ml-64 p-6">

        <h1 className="text-4xl font mb-6 text-gray-900">
          📊 Dashboard Overview
        </h1>

        <SummaryCards
          totalInvestment={totalInvestment}
          currentValue={currentValue}
          gainLoss={gainLoss}
          count={rows.length}
        />


        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Market Trend */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 border-l-8 
            ${gainLoss >= 0 ? "border-green-500" : "border-red-500"} 
            hover:shadow-2xl transition`}
          >
            <div className="flex items-center gap-5">
              <img src={trendIcon} alt="trend" className="w-16 h-16" />
              <div>
                <h2 className="text-xl font-bold text-gray-800">Market Trend</h2>
                <p
                  className={`text-lg font-extrabold ${gainLoss >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {marketTrend}
                </p>
              </div>
            </div>
          </div>


          <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-green-400 hover:shadow-2xl transition">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              🏆 Top Gainer
            </h2>
            <p className="text-2xl font-semibold mt-2 text-gray-900">{topGainer?.symbol}</p>
            <p className="text-green-600 text-lg font-bold">
              {topGainer?.percentage.toFixed(2)}%
            </p>
          </div>


          <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-red-400 hover:shadow-2xl transition">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              📉 Top Loser
            </h2>
            <p className="text-2xl font-semibold mt-2 text-gray-900">{topLoser?.symbol}</p>
            <p className="text-red-600 text-lg font-bold">
              {topLoser?.percentage.toFixed(2)}%
            </p>
          </div>

        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
          <PieChart labels={sectorLabels} values={sectorTotals} />
          <BarChart labels={labels} invested={investedValues} present={presentValues} />
        </div>

      </div>
    </div>
  );
}
