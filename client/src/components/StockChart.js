// src/components/StockChart.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const StockChart = ({ data, label = "Stock Price" }) => {
  const chartData = {
    labels: data.map((point) => point.time),
    datasets: [
      {
        label: label,
        data: data.map((point) => point.price),
        borderColor: "#4CAF50",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Price (₹)" } },
    },
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-2">{label}</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StockChart;
