import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { getReportSummary, getBestSellingProducts } from "../../../config/api";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ReportPDF } from "./GenerateReport.tsx";

type SalesData = { date: string; total: number };
type ProductData = {
    productId: string;
    productName: string;
    totalQuantitySold: number;
    totalRevenue: number;
};

export const ReportList: React.FC = () => {
    const [viewMode, setViewMode] = useState<"month" | "year">("month");
    const [filters, setFilters] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    });
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [topProducts, setTopProducts] = useState<ProductData[]>([]);
    const [summary, setSummary] = useState<{ totalRevenue: number; totalOrders: number, averageOrderValue?: number }>({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
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

    // Get current start and end time based on current filter
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
    
    // Get total revenue and total orders
    const fetchSummary = async () => {
        const { start, end } = getCurrentRange();
        try {
            const summaryResponse = await getReportSummary(start, end);
            console.log('Response: summary data:', summaryResponse);

            setSummary({
                totalRevenue: summaryResponse.totalRevenue ?? 0,
                totalOrders: summaryResponse.totalOrders ?? 0,
                averageOrderValue: summaryResponse.averageOrderValue ?? 0,
            });
        } catch (error: any) {
            console.error('Error fetching summary:', error);
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
                const response = await getReportSummary(s.start, s.end);
                console.log(`Response: sales data for ${s.label}:`, response);
                data.push({ date: s.label, total: response.totalRevenue ?? 0 });
            } catch (e) {
                console.error('Error fetching sales data:', e);
                data.push({ date: s.label, total: 0 });
            }
        }
        setSalesData(data);
    };

    // Get best-selling products based on current filter
    const fetchTopProducts = async () => {
        const { start, end } = getCurrentRange();
        try {
            const response = await getBestSellingProducts(10, start, end);
            console.log(`Response: top products in range: ${start} - ${end}:`, response);

            if (Array.isArray(response)) {
                const topProducts = response.map((p: ProductData) => ({
                    productId: p.productId,
                    productName: p.productName,
                    totalQuantitySold: p.totalQuantitySold,
                    totalRevenue: p.totalRevenue,
                }));
                setTopProducts(topProducts);
            } else {
                setTopProducts([]);
            }
        } catch (error: any) {
            console.error('Error fetching top products:', error);
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

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-black font-bold uppercase text-2xl">Reports</h2>
                <div className="flex gap-2">
                    <PDFDownloadLink
                        document={
                            <ReportPDF
                                summary={summary}
                                salesData={salesData}
                                topProducts={topProducts}
                                // get report period based on filters
                                reportPeriod={`${viewMode === "month" ? `${filters.year}-${filters.month}` : filters.year}`}
                                viewMode={viewMode}
                            />
                        }
                        fileName={`report_${filters.year}_${viewMode === "month" ? filters.month : "all"}.pdf`}
                    >
                        {({ loading }) =>
                            loading ? (
                                <button className="px-4 py-2 bg-gray-400 text-white rounded">Generating...</button>
                            ) : (
                                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Download PDF</button>
                            )
                        }
                    </PDFDownloadLink>
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
                {/* Total revenue and total orders */}
                <div className="flex gap-8 mb-4">
                    <div className="text-lg font-semibold text-green-700">
                        Total Revenue: ${summary.totalRevenue.toLocaleString()}
                    </div>
                    <div className="text-lg font-semibold text-blue-700">
                        Total Orders: {summary.totalOrders}
                    </div>
                    <div className="text-lg font-semibold text-purple-700">
                        Average Value/Order: ${summary.averageOrderValue?.toFixed(2) || 0}
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
                            <th className="p-2 border border-gray-300">Total Quantity Sold</th>
                            <th className="p-2 border border-gray-300">Revenue</th>
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
                                <tr key={p.productId}>
                                    <td className="p-2 border border-gray-300">{p.productId}</td>
                                    <td className="p-2 border border-gray-300">{p.productName}</td>
                                    <td className="p-2 border border-gray-300">{p.totalQuantitySold}</td>
                                    <td className="p-2 border border-gray-300">
                                        ${p.totalRevenue?.toLocaleString?.() ?? 0}
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