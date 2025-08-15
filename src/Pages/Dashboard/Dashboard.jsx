import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import {
  UserIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  ShoppingCartIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

// ✅ Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// Dummy stats data
const stats = [
  { name: "Leads", value: 120, icon: <ClipboardDocumentListIcon className="h-8 w-8 text-blue-500" /> },
  { name: "Customers", value: 80, icon: <UserIcon className="h-8 w-8 text-green-500" /> },
  { name: "Stock Items", value: 240, icon: <CubeIcon className="h-8 w-8 text-purple-500" /> },
  { name: "Sales", value: "$15,000", icon: <ShoppingCartIcon className="h-8 w-8 text-yellow-500" /> },
  { name: "Open Issues", value: 12, icon: <ExclamationCircleIcon className="h-8 w-8 text-red-500" /> },
];

// Dummy lead chart data
const leadData = {
  labels: ["New", "Contacted", "Qualified", "Converted", "Lost"],
  datasets: [
    {
      label: "Leads",
      data: [30, 25, 20, 35, 10],
      backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"],
      barThickness: 40,
      maxBarThickness: 50,
      categoryPercentage: 0.5,
      barPercentage: 0.7,
    },
  ],
};

const leadOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: "Lead Status Overview" },
  },
  scales: {
    x: { ticks: { padding: 10 }, grid: { display: false } },
    y: { beginAtZero: true },
  },
};

// Dummy profit margins data
const profitData = {
  labels: ["Product A", "Product B", "Product C", "Product D"],
  datasets: [
    {
      label: "Profit Margin (%)",
      data: [35, 25, 20, 20],
      backgroundColor: ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"],
    },
  ],
};

const profitOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" },
    title: { display: true, text: "Profit Margins by Product" },
  },
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4 hover:shadow-xl transition"
          >
            {stat.icon}
            <div>
              <p className="text-gray-500 text-sm">{stat.name}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Lead Management Chart */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Lead Status</h2>
          <div style={{ height: "300px" }}>
            <Bar data={leadData} options={leadOptions} />
          </div>
        </div>

        {/* Profit Margins Chart */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Profit Margins</h2>
          <div style={{ height: "300px" }}>
            <Pie data={profitData} options={profitOptions} />
          </div>
        </div>
      </div>

      {/* Recent Customers Table */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Customers</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { name: "John Doe", email: "john@example.com", phone: "0771234567", status: "Active" },
                { name: "Jane Smith", email: "jane@example.com", phone: "0779876543", status: "Inactive" },
                { name: "Bob Johnson", email: "bob@example.com", phone: "0775554444", status: "Active" },
              ].map((customer, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2">{customer.name}</td>
                  <td className="px-4 py-2">{customer.email}</td>
                  <td className="px-4 py-2">{customer.phone}</td>
                  <td className="px-4 py-2">{customer.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock & Sales Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Stock Summary</h2>
          <ul className="list-disc pl-5">
            <li>Product A - 50 units</li>
            <li>Product B - 120 units</li>
            <li>Product C - 70 units</li>
          </ul>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Sales</h2>
          <ul className="list-disc pl-5">
            <li>Order #1001 - $200</li>
            <li>Order #1002 - $500</li>
            <li>Order #1003 - $150</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
