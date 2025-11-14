"use client";


import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";


ChartJS.register(ArcElement, Tooltip, Legend);


export function PieChart({ labels, values }: any) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full h-[480px] border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-center text-purple-600">📊 Sector Allocation</h2>


            <div className="flex justify-center h-[360px]">
                <Pie
                    data={{
                        labels,
                        datasets: [
                            {
                                data: values,
                                backgroundColor: [
                                    "#4CAF50",
                                    "#2196F3",
                                    "#FF9800",
                                    "#E91E63",
                                    "#9C27B0",
                                    "#00BCD4",
                                    "#FF5722",
                                    "#8BC34A",
                                    "#3F51B5",
                                    "#795548",
                                ],
                                borderWidth: 2,
                                borderColor: "#fff",
                            },
                        ],
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                />
            </div>
        </div>
    );
}