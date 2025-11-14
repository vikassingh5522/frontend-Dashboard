"use client";

import { useEffect, useMemo, useState } from "react";
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
  investment?: number | null;
  presentValue?: number | null;
  gainLoss?: number | null;
};

type ChangeInfo = {
  dir: "up" | "down" | "same";
  ts: number;
};

export default function PortfolioTable() {
  const [rows, setRows] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  const [sortKey, setSortKey] = useState<"gain" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [sectorFilter, setSectorFilter] = useState<string>("All");
  const [query, setQuery] = useState<string>("");


  const [prevCmpMap, setPrevCmpMap] = useState<Record<string, number | null>>(
    {}
  );


  const [changeMap, setChangeMap] = useState<Record<string, ChangeInfo>>({});


  async function loadCMP(symbol: string) {
    try {
      const res = await fetch(`http://localhost:5000/api/cmp/${symbol}`);
      const data = await res.json();

      return data?.cmp ?? null;
    } catch {
      return null;
    }
  }


  async function loadMetrics(symbol: string) {
    try {
      const res = await fetch(`http://localhost:5000/api/metrics/${symbol}`);
      const data = await res.json();
      return {
        peRatio: data?.peRatio ?? null,
        earnings: data?.earnings ?? null,
      };
    } catch {
      return { peRatio: null, earnings: null };
    }
  }


  async function loadData() {
    setLoading(true);

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
          investment: calc.investment ?? null,
          presentValue: calc.presentValue ?? null,
          gainLoss: calc.gainLoss ?? null,
        };
      })
    );


    const newChangeMap: Record<string, ChangeInfo> = { ...changeMap };
    const newPrevMap: Record<string, number | null> = { ...prevCmpMap };

    updated.forEach((r) => {
      const symbol = r.symbol;
      const prev = prevCmpMap[symbol] ?? null;
      const now = r.cmp ?? null;

      if (prev === null && now !== null) {
        newChangeMap[symbol] = { dir: "up", ts: Date.now() };
      } else if (prev !== null && now !== null) {
        if (now > prev) newChangeMap[symbol] = { dir: "up", ts: Date.now() };
        else if (now < prev) newChangeMap[symbol] = { dir: "down", ts: Date.now() };
        else newChangeMap[symbol] = { dir: "same", ts: Date.now() };
      }
      newPrevMap[symbol] = now;
    });

    setPrevCmpMap(newPrevMap);
    setChangeMap((m) => ({ ...m, ...newChangeMap }));
    setRows(updated);
    setLoading(false);


    setTimeout(() => {
      setChangeMap((cur) => {
        const next: Record<string, ChangeInfo> = {};
        Object.keys(cur).forEach((k) => {

          if (Date.now() - cur[k].ts < 1200) next[k] = cur[k];
        });
        return next;
      });
    }, 1200);
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);

  }, []);


  const sectors = useMemo(() => {
    const s = Array.from(new Set(portfolioData.map((p) => p.sector || "Unknown")));
    return ["All", ...s];
  }, []);

  const visibleRows = useMemo(() => {
    let result = [...rows];


    if (sectorFilter !== "All") result = result.filter((r) => r.sector === sectorFilter);


    if (query.trim() !== "") {
      const q = query.toLowerCase();
      result = result.filter(
        (r) =>
          r.stock.toLowerCase().includes(q) ||
          r.symbol.toLowerCase().includes(q)
      );
    }


    if (sortKey === "gain") {
      result.sort((a, b) => {
        const aVal = a.gainLoss ?? -Infinity;
        const bVal = b.gainLoss ?? -Infinity;
        if (sortDir === "asc") return (aVal as number) - (bVal as number);
        return (bVal as number) - (aVal as number);
      });
    }

    return result;
  }, [rows, sectorFilter, query, sortKey, sortDir]);


  function toggleGainSort() {
    if (sortKey !== "gain") {
      setSortKey("gain");
      setSortDir("desc");
    } else {
      if (sortDir === "desc") setSortDir("asc");
      else setSortKey(null);
    }
  }

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-xl min-h-screen">


      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-3">
            📊 Portfolio Dashboard
            {loading && <span className="text-sm font-medium text-gray-500 ml-2">Updating…</span>}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Live updates every 15 seconds</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch">

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder=" 🔍 Search stock or symbol..."
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm w-full sm:w-64"
          />

          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
          >
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={toggleGainSort}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
            title="Sort by Gain / Loss"
          >
            Sort by Gain {sortKey === "gain" ? (sortDir === "desc" ? "▼" : "▲") : ""}
          </button>
        </div>
      </div>


      <div className="overflow-x-auto rounded-xl shadow-xl bg-white border">
        <table className="w-full text-black">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 border text-left">Stock</th>
              <th className="p-3 border">Purchase</th>
              <th className="p-3 border">Qty</th>
              <th className="p-3 border">Investment</th>
              <th className="p-3 border">Exchange</th>
              <th className="p-3 border">CMP</th>
              <th className="p-3 border">Present Value</th>
              <th className="p-3 border cursor-pointer" onClick={toggleGainSort}>
                Gain / Loss
                <span className="ml-2 text-sm">
                  {sortKey === "gain" ? (sortDir === "desc" ? "▼" : "▲") : ""}
                </span>
              </th>
              <th className="p-3 border">P/E</th>
              <th className="p-3 border">Earnings</th>
            </tr>
          </thead>

          <tbody>
            {visibleRows.map((item, i) => {
              const ch = changeMap[item.symbol];
              const changedDir = ch?.dir ?? "same";


              const cmpTextClass =
                ch && ch.dir === "up"
                  ? "text-green-700"
                  : ch && ch.dir === "down"
                    ? "text-red-700"
                    : "text-gray-900";


              const highlightBg =
                ch && (Date.now() - ch.ts < 1200)
                  ? ch.dir === "up"
                    ? "bg-green-50"
                    : ch.dir === "down"
                      ? "bg-red-50"
                      : "bg-gray-50"
                  : "";

              return (
                <tr
                  key={item.symbol + i}
                  className={`transition-all border-b hover:bg-indigo-50 ${highlightBg}`}
                >
                  <td className="p-3 border">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{item.stock}</div>
                      <div className="text-xs text-gray-500">{item.symbol}</div>
                    </div>
                  </td>

                  <td className="p-3 border text-center">₹{item.purchasePrice}</td>
                  <td className="p-3 border text-center">{item.qty}</td>
                  <td className="p-3 border text-center">
                    {item.investment != null ? `₹${item.investment}` : "—"}
                  </td>

                  <td className="p-3 border text-center">{item.exchange}</td>


                  <td className={`p-3 border text-center font-semibold ${cmpTextClass}`}>
                    {item.cmp !== null && item.cmp !== undefined ? (
                      <span
                        className={`inline-block ${ch && Date.now() - ch.ts < 800 ? "animate-pulse" : ""
                          }`}
                      >
                        ₹{Number(item.cmp).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="p-3 border text-center">
                    {item.presentValue != null ? `₹${item.presentValue}` : "—"}
                  </td>

                  <td
                    className={`p-3 border text-center font-bold ${item.gainLoss != null
                        ? item.gainLoss >= 0
                          ? "text-green-600"
                          : "text-red-600"
                        : "text-gray-700"
                      }`}
                  >
                    {item.gainLoss != null ? `₹${item.gainLoss}` : "—"}
                  </td>

                  <td className="p-3 border text-center">{item.pe ?? "—"}</td>
                  <td className="p-3 border text-center">{item.earnings ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>


        {visibleRows.length === 0 && (
          <div className="p-6 text-center text-gray-500">No rows to display.</div>
        )}
      </div>
    </div>
  );
}
