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
  const card =
    "p-6 rounded-xl shadow-lg text-white text-center transform hover:scale-[1.03] transition duration-300";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">

      <div className={`${card} bg-gradient-to-r from-blue-500 to-blue-700`}>
        <h3 className="text-sm opacity-90">Total Investment</h3>
        <p className="text-3xl font-extrabold">₹{totalInvestment.toFixed(2)}</p>
      </div>

      <div className={`${card} bg-gradient-to-r from-purple-500 to-purple-700`}>
        <h3 className="text-sm opacity-90">Current Value</h3>
        <p className="text-3xl font-extrabold">₹{currentValue.toFixed(2)}</p>
      </div>

      <div
        className={`${card} ${
          gainLoss >= 0
            ? "bg-gradient-to-r from-green-500 to-green-700"
            : "bg-gradient-to-r from-red-500 to-red-700"
        }`}
      >
        <h3 className="text-sm opacity-90">Total Gain / Loss</h3>
        <p className="text-3xl font-extrabold">₹{gainLoss.toFixed(2)}</p>
      </div>

      <div className={`${card} bg-gradient-to-r from-indigo-500 to-indigo-700`}>
        <h3 className="text-sm opacity-90">Holdings Count</h3>
        <p className="text-3xl font-extrabold">{count}</p>
      </div>
    </div>
  );
}
