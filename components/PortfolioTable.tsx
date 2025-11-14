import { useEffect, useState } from "react";
import portfolioData from "../data/portfolio.json";
import { calculateRow } from "../utils/calculateValues";


type PortfolioItem = {
  stock: string;
  purchasePrice: number;
  qty: number;
  exchange: string;
  sector: string;
  symbol: string;

  cmp?: number | null;
  pe?: number | null;
  earnings?: number | null;
  investment?: number;
  presentValue?: number;
  gainLoss?: number;
};

export default function PortfolioTable() {
  const [rows, setRows] = useState<PortfolioItem[]>([]);

  async function loadCMP(symbol: string) {
    const res = await fetch(`http://localhost:5000/api/cmp/${symbol}`);
    const data = await res.json();
    return data.cmp;
  }

  async function loadMetrics(symbol: string) {
    const res = await fetch(`http://localhost:5000/api/metrics/${symbol}`);
    const data = await res.json();
    return data;
  }

  async function loadData() {
    const updated: PortfolioItem[] = await Promise.all(
      portfolioData.map(async (item: PortfolioItem) => {
        const cmp = await loadCMP(item.symbol);
        const metrics = await loadMetrics(item.symbol);

        const calc = calculateRow(item, cmp);

        return {
          ...item,
          cmp,
          pe: metrics.peRatio,
          earnings: metrics.earnings,
          ...calc
        };
      })
    );

    setRows(updated);
  }

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };

    fetchData();

    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-6 text-indigo-700 drop-shadow">
        📊 Portfolio Dashboard
      </h1>

      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="w-full text-black">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 border">Stock</th>
              <th className="p-3 border">Purchase Price</th>
              <th className="p-3 border">Qty</th>
              <th className="p-3 border">Investment</th>
              <th className="p-3 border">Exchange</th>
              <th className="p-3 border">CMP</th>
              <th className="p-3 border">Present Value</th>
              <th className="p-3 border">Gain / Loss</th>
              <th className="p-3 border">P/E</th>
              <th className="p-3 border">Earnings</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((item, i) => (
              <tr key={i} className="hover:bg-indigo-50 transition-all border-b">
                <td className="p-3 border">{item.stock}</td>
                <td className="p-3 border">{item.purchasePrice}</td>
                <td className="p-3 border">{item.qty}</td>
                <td className="p-3 border">{item.investment}</td>
                <td className="p-3 border">{item.exchange}</td>
                <td className="p-3 border">{item.cmp}</td>
                <td className="p-3 border">{item.presentValue}</td>

                <td
                  className={`p-3 border font-bold text-lg ${item.gainLoss && item.gainLoss >= 0
                      ? "text-green-600"
                      : "text-red-600"
                    }`}
                >
                  {item.gainLoss}
                </td>

                <td className="p-3 border">{item.pe}</td>
                <td className="p-3 border">{item.earnings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
