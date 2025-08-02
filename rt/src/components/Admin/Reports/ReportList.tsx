import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { API_BASE_URL } from "../../../config.ts";

type SalesData = { date: string; total: number };
type ProductData = {
  productID: string;
  productName: string;
  numberOfSellingProduct: number;
  totalPrice: number;
};

export const ReportList: React.FC = () => {
  const [viewMode, setViewMode] = useState<"month" | "year">("month");
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<ProductData[]>([]);
  const [summary, setSummary] = useState<{ totalRevenue: number; totalOrders: number }>({
    totalRevenue: 0,
    totalOrders: 0,
  });

  // Generate all dates in a month with start + end times
  const getMonthRange = (year: number, month: number) => {
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const labelDate = new Date(Date.UTC(year, month - 1, day));
      return {
        name: day,
        label: labelDate.toISOString().slice(0, 10),
        start: new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)).toISOString(),
        end: new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999)).toISOString(),
      };
    });
  };

  // Generate all months in a year with start + end times
  const getYearRange = (year: number) => {
    return Array.from({ length: 12 }, (_, i) => {
      const start = new Date(Date.UTC(year, i, 1, 0, 0, 0, 0));
      const end = new Date(Date.UTC(year, i + 1, 0, 23, 59, 59, 999));
      return {
        name: i + 1,
        label: start.toISOString().slice(0, 7),
        start: start.toISOString(),
        end: end.toISOString(),
      };
    });
  };

  // Lấy thời gian bắt đầu và kết thúc theo filter hiện tại
  const getCurrentRange = () => {
    if (viewMode === "month") {
      const start = new Date(Date.UTC(filters.year, filters.month - 1, 1, 0, 0, 0, 0)).toISOString();
      const end = new Date(Date.UTC(filters.year, filters.month, 0, 23, 59, 59, 999)).toISOString();
      return { start, end };
    } else {
      const start = new Date(Date.UTC(filters.year, 0, 1, 0, 0, 0, 0)).toISOString();
      const end = new Date(Date.UTC(filters.year, 11, 31, 23, 59, 59, 999)).toISOString();
      return { start, end };
    }
  };

  // Lấy tổng doanh thu và tổng số đơn
  const fetchSummary = async () => {
    const { start, end } = getCurrentRange();
    try {
      const res = await fetch(
        `${API_BASE_URL}/reports/summary?starttime=${encodeURIComponent(start)}&endtime=${encodeURIComponent(end)}`
      );
      const json = await res.json();
      setSummary({
        totalRevenue: json?.totalRevenue ?? 0,
        totalOrders: json?.totalOrders ?? 0,
      });
    } catch {
      setSummary({ totalRevenue: 0, totalOrders: 0 });
    }
  };

  const fetchSales = async () => {
    const slots =
      viewMode === "month"
        ? getMonthRange(filters.year, filters.month)
        : getYearRange(filters.year);

    const data: SalesData[] = [];
    for (let s of slots) {
      if (new Date(s.start) > new Date()) break;
      try {
        const res = await fetch(`${API_BASE_URL}/reports/gettotalprice`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              starttime: s.start,
              endtime: s.end,
            }),
          }
        );
        const json = await res.json();
        data.push({ date: s.label, total: json?.totalPrice ?? 0 });
      } catch (e) {
        data.push({ date: s.label, total: 0 });
      }
    }
    setSalesData(data);
  };

  // Lấy sản phẩm bán chạy theo filter hiện tại
  const fetchTopProducts = async () => {
    const { start, end } = getCurrentRange();
    try {
      const res = await fetch(
        `${API_BASE_URL}/reports/bestselling?starttime=${start}&endtime=${end}`
      );
      const json = await res.json();
      if (json.success && Array.isArray(json.products)) {
        setTopProducts(json.products);
      } else {
        setTopProducts([]);
      }
    } catch {
      setTopProducts([]);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchSummary();
    fetchTopProducts();
  }, [filters, viewMode]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

////   Generate report handler (example: call API to generate PDF report)
//   const handleGenerateReport = async () => {
//     const { start, end } = getCurrentRange();
//     try {
//       const res = await fetch(
//         `${API_BASE_URL}/reports/generate?starttime=${encodeURIComponent(start)}&endtime=${encodeURIComponent(end)}`,
//         { method: "GET" }
//       );
//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `report_${filters.year}_${viewMode === "month" ? filters.month : "all"}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (e) {
//       alert("Generate report failed!");
//     }
//   };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-black font-bold uppercase text-2xl">Reports</h2>
        <div className="flex gap-2">
          {/* <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleExportExcel}
          >
            Export to Excel
          </button> */}
          {/* <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleGenerateReport}
          >
            Generate Report
          </button> */}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-black font-bold text-xl mb-4">📈 Revenue</h3>
        <div className="flex gap-4 mb-6">
          <label className="flex flex-col text-sm">
            View by:
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as "month" | "year")}
              className="p-2 border rounded"
            >
              <option value="month">By Day (in Month)</option>
              <option value="year">By Month (in Year)</option>
            </select>
          </label>
          <label className="flex flex-col text-sm">
            Year:
            <select
              name="year"
              value={filters.year}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              {Array.from(
                { length: Math.min(5, new Date().getFullYear() - 2022 + 1) },
                (_, i) => 2022 + i
              ).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          {viewMode === "month" && (
            <label className="flex flex-col text-sm">
              Month:
              <select
                name="month"
                value={filters.month}
                onChange={handleChange}
                className="p-2 border rounded"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        {/* Tổng doanh thu và tổng số đơn */}
        <div className="flex gap-8 mb-4">
          <div className="text-lg font-semibold text-green-700">
            Total Revenue: ${summary.totalRevenue.toLocaleString()}
          </div>
          <div className="text-lg font-semibold text-blue-700">
            Total Orders: {summary.totalOrders}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <XAxis
              dataKey="date"
              interval="preserveStartEnd"
              tickFormatter={(value) => {
                if (viewMode === "month") {
                  return value.slice(8, 10);
                } else {
                  return value.slice(5, 7);
                }
              }}
            />
            <YAxis />
            <Tooltip
              formatter={(value) => [`$${value?.toLocaleString?.()}`, "Revenue"]}
              labelFormatter={(label) => {
                const date = new Date(Date.UTC(
                  parseInt(label.slice(0, 4)),
                  parseInt(label.slice(5, 7)) - 1,
                  parseInt(label.slice(8, 10) || "1")
                ));
                return date.toISOString().slice(0, 10);
              }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-10">
        <h3 className="text-black font-bold text-xl mb-4">🏆 Best-Selling Products</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border border-gray-300">Product ID</th>
              <th className="p-2 border border-gray-300">Product Name</th>
              <th className="p-2 border border-gray-300">Units Sold</th>
              <th className="p-2 border border-gray-300">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-400">
                  No data
                </td>
              </tr>
            ) : (
              topProducts.map((p) => (
                <tr key={p.productID}>
                  <td className="p-2 border border-gray-300">{p.productID}</td>
                  <td className="p-2 border border-gray-300">{p.productName}</td>
                  <td className="p-2 border border-gray-300">{p.numberOfSellingProduct}</td>
                  <td className="p-2 border border-gray-300">
                    ${p.totalPrice?.toLocaleString?.() ?? 0} 
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
