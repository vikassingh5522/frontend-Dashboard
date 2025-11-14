"use client";

import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface BarChartProps {
    labels: string[];
    invested: number[];
    present: number[];
}

export default function BarChart({ labels, invested, present }: BarChartProps) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full h-[480px] border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
                💰 Investment vs Current Value
            </h2>

            <div className="w-full h-[360px]">
                <Bar
                    data={{
                        labels,
                        datasets: [
                            {
                                label: "Investment",
                                data: invested,
                                backgroundColor: "rgba(33, 150, 243, 0.7)",
                                borderRadius: 8,
                            },
                            {
                                label: "Current Value",
                                data: present,
                                backgroundColor: "rgba(76, 175, 80, 0.7)",
                                borderRadius: 8,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                ticks: { maxRotation: 45, minRotation: 45, color: "#374151" },
                            },
                            y: { ticks: { color: "#374151" } },
                        },
                        plugins: {
                            legend: {
                                labels: { color: "#000", font: { size: 14 } },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}
