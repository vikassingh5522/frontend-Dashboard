

import Navbar from "../components/Navbar";
import { PieChart } from "../components/PieChart";
import BarChart from "../components/BarChart";
import portfolio from "../data/portfolio.json";


export default function ChartsPage() {
    const labels = portfolio.map((r) => r.symbol);
    const invested = portfolio.map((r) => r.purchasePrice * r.qty);
    const present = invested.map(() => Math.random() * 20000);


    const sectorLabels = [...new Set(portfolio.map((r) => r.sector))];
    const sectorTotals = sectorLabels.map((sector) =>
        portfolio
            .filter((r) => r.sector === sector)
            .reduce((sum, r) => sum + r.purchasePrice * r.qty, 0)
    );


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <Navbar />


            <div className="p-6">
                <h1 className="text-5xl font-extrabold mb-10 text-center text-indigo-600 drop-shadow-md">
                    📈 Portfolio Charts Overview
                </h1>


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <PieChart labels={sectorLabels} values={sectorTotals} />
                    <BarChart labels={labels} invested={invested} present={present} />
                </div>
            </div>
        </div>
    );
}