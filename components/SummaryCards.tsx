"use client";

type Props = {
    totalInvestment: number;
    currentValue: number;
    gainLoss: number;
    count: number;
};

export default function SummaryCards({
    totalInvestment,
    currentValue,
    gainLoss,
    count,
}: Props) {
    const card = "p-6 rounded-xl shadow-md text-white text-center";

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <div className={`${card} bg-blue-600`}>
                <h3 className="text-sm">Total Investment</h3>
                <p className="text-2xl font-bold">₹{totalInvestment.toFixed(2)}</p>
            </div>

            <div className={`${card} bg-purple-600`}>
                <h3 className="text-sm">Current Value</h3>
                <p className="text-2xl font-bold">₹{currentValue.toFixed(2)}</p>
            </div>

            <div className={`${card} ${gainLoss >= 0 ? "bg-green-600" : "bg-red-600"}`}>
                <h3 className="text-sm">Total Gain / Loss</h3>
                <p className="text-2xl font-bold">₹{gainLoss.toFixed(2)}</p>
            </div>

            <div className={`${card} bg-indigo-600`}>
                <h3 className="text-sm">Holdings Count</h3>
                <p className="text-2xl font-bold">{count}</p>
            </div>
        </div>
    );
}
