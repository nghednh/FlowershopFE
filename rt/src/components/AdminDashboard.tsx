import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./AdminDashboard.css";

// Define types for clarity
type SalesData = { date: string; total: number };
type ProductData = { name: string; sold: number };

const AdminDashboard = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    // TODO: Replace with real API
    setSalesData([
      { date: "2024-06-01", total: 1200 },
      { date: "2024-06-02", total: 1800 },
      { date: "2024-06-03", total: 900 },
      { date: "2024-06-04", total: 1500 },
      { date: "2024-06-05", total: 2100 },
    ]);
    setTopProducts([
      { name: "Rosy Delight Bouquet", sold: 150 },
      { name: "Sunshine Yellow Bouquet", sold: 90 },
      { name: "Elegant White Lily Arrangement", sold: 70 },
      { name: "Classic Red Rose Bouquet", sold: 60 },
      { name: "Lavender Bliss Bouquet", sold: 55 },
    ]);
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>📈 Sales Report</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={salesData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>

      <h2 className="mt-4">🏆 Best-Selling Products</h2>
      <table className="report-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Units Sold</th>
          </tr>
        </thead>
        <tbody>
          {topProducts.map((p, idx) => (
            <tr key={idx}>
              <td>{p.name}</td>
              <td>{p.sold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
