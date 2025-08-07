import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { getReportSummary, getBestSellingProducts } from "../../../config/api.ts";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ReportPDF } from "./GeneratePDF.tsx";

type SalesData = { date: string; total: number; orders: number; averageOrder: number };
type ProductData = {
    productId: string;
    productName: string;
    totalQuantitySold: number;
    totalRevenue: number;
};

type ChartMetric = "revenue" | "orders" | "average";

export const ReportList: React.FC = () => {
    const [viewMode, setViewMode] = useState<"month" | "year">("month");
    const [chartMetric, setChartMetric] = useState<ChartMetric>("revenue");
    const [filters, setFilters] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    });
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [topProducts, setTopProducts] = useState<ProductData[]>([]);
    const [summary, setSummary] = useState<{ totalRevenue: number; totalOrders: number; averageOrderValue: number }>({
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
            setSummary({ totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 });
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
                const avgOrder = response.totalOrders > 0 ? response.totalRevenue / response.totalOrders : 0;
                data.push({ 
                    date: s.label, 
                    total: response.totalRevenue ?? 0,
                    orders: response.totalOrders ?? 0,
                    averageOrder: avgOrder
                });
            } catch (e) {
                console.error('Error fetching sales data:', e);
                data.push({ 
                    date: s.label, 
                    total: 0,
                    orders: 0,
                    averageOrder: 0
                });
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

    // Get current line chart data key based on selected metric
    const getLineChartDataKey = () => {
        switch (chartMetric) {
            case "revenue": return "total";
            case "orders": return "orders";
            case "average": return "averageOrder";
            default: return "total";
        }
    };

    // Generate pie chart data from sales data by time periods
    const getRevenueDistributionData = () => {
        if (salesData.length === 0) return [];
        
        // Get data with revenue > 0 for better visualization
        const revenueData = salesData.filter(item => item.total > 0);
        
        if (revenueData.length === 0) return [];
        
        // Take top periods by revenue for cleaner visualization
        const sortedData = revenueData
            .sort((a, b) => b.total - a.total)
            .slice(0, 8); // Show top 8 periods
        
        const colors = [
            "#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", 
            "#ef4444", "#06b6d4", "#84cc16", "#f97316"
        ];
        
        return sortedData.map((item, index) => ({
            name: viewMode === "month" 
                ? `Day ${item.date.slice(8, 10)}` 
                : `Month ${item.date.slice(5, 7)}`,
            value: item.total,
            color: colors[index % colors.length],
            fullDate: item.date
        }));
    };

    // Get chart label and formatter for selected metric
    const getChartConfig = () => {
        switch (chartMetric) {
            case "revenue":
                return {
                    label: "Revenue",
                    color: "#10b981",
                    formatter: (value: any) => [`$${value?.toLocaleString?.()}`, "Revenue"]
                };
            case "orders":
                return {
                    label: "Orders",
                    color: "#3b82f6",
                    formatter: (value: any) => [value?.toLocaleString?.(), "Orders"]
                };
            case "average":
                return {
                    label: "Avg Order Value",
                    color: "#8b5cf6",
                    formatter: (value: any) => [`$${value?.toFixed?.(2)}`, "Avg Order Value"]
                };
            default:
                return {
                    label: "Revenue",
                    color: "#10b981",
                    formatter: (value: any) => [`$${value?.toLocaleString?.()}`, "Revenue"]
                };
        }
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
                                reportPeriod={`${viewMode === "month" ? `${filters.year}-${filters.month.toString().padStart(2, '0')}` : filters.year}`}
                                viewMode={viewMode}
                            />
                        }
                        fileName={(() => {
                            const period = viewMode === "month" 
                                ? `${filters.year}-${filters.month.toString().padStart(2, '0')}` 
                                : `${filters.year}`;
                            return `SalesReport_${period}.pdf`;
                        })()}
                    >
                        {({ loading }) =>
                            loading ? (
                                <button className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed">Generating PDF...</button>
                            ) : (
                                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-blue-700 cursor-pointer">
                                    📥 Export PDF Report
                                </button>
                            )
                        }
                    </PDFDownloadLink>
                </div>
            </div>

            {/* Filter Controls */}
            <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
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
                    Metric:
                    <select
                        value={chartMetric}
                        onChange={(e) => setChartMetric(e.target.value as ChartMetric)}
                        className="p-2 border rounded"
                    >
                        <option value="revenue">Total Revenue</option>
                        <option value="orders">Total Orders</option>
                        <option value="average">Average Value/Order</option>
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

            <div className="mb-6">
                <h3 className="text-black font-bold text-xl mb-4">📊 Summary Overview</h3>
                
                {/* Summary Report - Text Format */}
                <div className="bg-white p-6 rounded-lg shadow border mb-6">
                    <div className="space-y-3">
                        <div className="text-lg">
                            <span className="font-semibold text-gray-600">Total Revenue:</span>
                            <span className="ml-2 font-bold text-green-700">${summary.totalRevenue.toLocaleString()}</span>
                        </div>
                        <div className="text-lg">
                            <span className="font-semibold text-gray-600">Total Orders:</span>
                            <span className="ml-2 font-bold text-blue-700">{summary.totalOrders}</span>
                        </div>
                        <div className="text-lg">
                            <span className="font-semibold text-gray-600">Average Value per Order:</span>
                            <span className="ml-2 font-bold text-purple-700">${summary.averageOrderValue?.toFixed(2) || 0}</span>
                        </div>
                        <div className="text-lg">
                            <span className="font-semibold text-gray-600">Reporting Period:</span>
                            <span className="ml-2 font-bold text-gray-700">
                                {viewMode === "month" ? `${filters.year}-${filters.month.toString().padStart(2, '0')}` : filters.year}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Revenue Distribution by Time Periods */}
                <div className="mb-8">
                    <h4 className="text-black font-bold text-lg mb-4">
                        📊 Revenue Distribution by {viewMode === "month" ? "Days" : "Months"}
                    </h4>
                    <div className="bg-white p-6 rounded-lg shadow border">
                        {getRevenueDistributionData().length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie
                                        data={getRevenueDistributionData()}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={120}
                                        dataKey="value"
                                        nameKey="name"
                                    >
                                        {getRevenueDistributionData().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value: any, _name: any, props: any) => [
                                            `$${value?.toLocaleString?.()}`,
                                            `${props.payload.name} (${props.payload.fullDate})`
                                        ]}
                                        labelStyle={{ color: '#374151' }}
                                    />
                                    <Legend 
                                        formatter={(value, entry: any) => 
                                            `${value}: $${entry.payload?.value?.toLocaleString?.() || 0}`
                                        }
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <p className="text-lg">No revenue data available</p>
                                <p className="text-sm">for the selected {viewMode === "month" ? "month" : "year"}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-black font-bold text-xl mb-4">📈 Trend Analysis</h3>
                
                <ResponsiveContainer width="100%" height={350}>
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
                            formatter={getChartConfig().formatter}
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
                            dataKey={getLineChartDataKey()}
                            stroke={getChartConfig().color}
                            strokeWidth={3}
                            dot={{ r: 4, fill: getChartConfig().color }}
                            activeDot={{ r: 6, fill: getChartConfig().color }}
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