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
    CartesianGrid,
} from "recharts";
import { getReportSummary, getBestSellingProducts } from "../../../config/api";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ReportPDF } from "./GeneratePDF.tsx";
import { getMonthRange, getYearRange, getCurrentRange } from "../../../utils/timeRange";
import "./Report.css";

/**
 * Utility functions for time range generation and management
 */

export type SalesData = { 
    date: string; 
    total: number; 
    orders: number; 
    averageOrder: number; 
};

export type ProductData = {
    productId: string;
    productName: string;
    totalQuantitySold: number;
    totalRevenue: number;
};

export type ChartMetric = "revenue" | "orders" | "average";

/**
 * Get current line chart data key based on selected metric
 */
const getLineChartDataKey = (chartMetric: ChartMetric): string => {
    switch (chartMetric) {
        case "revenue": return "total";
        case "orders": return "orders";
        case "average": return "averageOrder";
        default: return "total";
    }
};

/**
 * Generate pie chart data from sales data by time periods
 */
const getPieChartData = (
    salesData: SalesData[],
    viewMode: "month" | "year",
    chartMetric: ChartMetric
) => {
    if (salesData.length === 0) return [];
    
    // Get appropriate metric value based on selected chart metric
    const getMetricValue = (item: SalesData): number => {
        switch (chartMetric) {
            case "revenue": return item.total;
            case "orders": return item.orders;
            case "average": return item.averageOrder;
            default: return item.total;
        }
    };
    
    // Get colors based on metric type - Enhanced beautiful color palettes
    const getColorsForMetric = (chartMetric: ChartMetric): string[] => {
        switch (chartMetric) {
            case "revenue":
                return [
                    "#10B981", "#34D399", "#6EE7B7", "#A7F3D0", 
                    "#065F46", "#047857", "#059669", "#0D9488"
                ];
            case "orders":
                return [
                    "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", 
                    "#1E40AF", "#1D4ED8", "#2563EB", "#3B82F6"
                ];
            case "average":
                return [
                    "#F59E0B", "#FBBF24", "#FCD34D", "#FDE68A", 
                    "#D97706", "#B45309", "#92400E", "#78350F"
                ];
            default:
                return [
                    "#10B981", "#34D399", "#6EE7B7", "#A7F3D0", 
                    "#065F46", "#047857", "#059669", "#0D9488"
                ];
        }
    };
    
    // Get data with metric value > 0 for better visualization
    const filteredData = salesData.filter(item => getMetricValue(item) > 0);
    
    if (filteredData.length === 0) return [];
    
    // Take top periods by metric value for cleaner visualization
    const sortedData = filteredData
        .sort((a, b) => getMetricValue(b) - getMetricValue(a))
        .slice(0, 8); // Show top 8 periods
    
    const colors = getColorsForMetric(chartMetric);
    
    return sortedData.map((item, index) => ({
        name: viewMode === "month" 
            ? `Day ${item.date.slice(8, 10)}` 
            : `Month ${item.date.slice(5, 7)}`,
        value: getMetricValue(item),
        color: colors[index % colors.length],
        fullDate: item.date
    }));
};

/**
 * Get chart label and formatter for selected metric
 */
const getChartConfig = (chartMetric: ChartMetric) => {
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

/**
 * Generate years array for dropdown selection
 */
const getAvailableYears = (yearCount: number = 5): number[] => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - yearCount + 1;
    return Array.from({ length: yearCount }, (_, i) => startYear + i);
}

/**
 * Format date for tooltip display
 */
const formatTooltipLabel = (label: string): string => {
    const date = new Date(Date.UTC(
        parseInt(label.slice(0, 4)),
        parseInt(label.slice(5, 7)) - 1,
        parseInt(label.slice(8, 10) || "1")
    ));
    return date.toISOString().slice(0, 10);
};

/**
 * Format chart tick values for display
 */
const formatChartTick = (value: string, viewMode: "month" | "year"): string => {
    if (viewMode === "month") {
        return value.slice(8, 10); // Show day
    } else {
        return value.slice(5, 7); // Show month
    }
};

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

    // Get total revenue and total orders
    const fetchSummary = async () => {
        const { start, end } = getCurrentRange(viewMode, filters);
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
        const { start, end } = getCurrentRange(viewMode, filters);
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
                        {getAvailableYears().map((y) => (
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
                <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100 mb-6">
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

                {/* Distribution by Time Periods */}
                <div className="mb-8">
                    <h4 className="text-black font-bold text-lg mb-4 flex items-center gap-2">
                        <span className="inline-block w-1 h-6 rounded-full" style={{ backgroundColor: getChartConfig(chartMetric).color }}></span>
                        📊 {getChartConfig(chartMetric).label} Distribution by {viewMode === "month" ? "Days" : "Months"}
                    </h4>
                    <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100">
                        {getPieChartData(salesData, viewMode, chartMetric).length > 0 ? (
                            <ResponsiveContainer width="100%" height={550}>
                                <PieChart>
                                    <defs>
                                        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.15"/>
                                        </filter>
                                    </defs>
                                    <Pie
                                        data={getPieChartData(salesData, viewMode, chartMetric)}
                                        cx="32%"
                                        cy="50%"
                                        innerRadius={0}
                                        outerRadius={170}
                                        dataKey="value"
                                        nameKey="name"
                                        animationBegin={0}
                                        animationDuration={800}
                                    >
                                        {getPieChartData(salesData, viewMode, chartMetric).map((entry: any, index: number) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.color}
                                                filter="url(#shadow)"
                                                stroke="#ffffff"
                                                strokeWidth={1}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                const value = payload[0].value;
                                                
                                                // Use the same formatter as line chart
                                                const config = getChartConfig(chartMetric);
                                                const [formattedValue, metricLabel] = config.formatter(value);
                                                
                                                // Calculate percentage
                                                const pieData = getPieChartData(salesData, viewMode, chartMetric);
                                                const total = pieData.reduce((sum, item) => sum + item.value, 0);
                                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                                                
                                                // Create period label (clean format)
                                                const periodLabel = viewMode === "month" 
                                                    ? `Day ${data.name.replace('Day ', '')}` 
                                                    : `Month ${data.name.replace('Month ', '')}`;
                                                
                                                return (
                                                    <div style={{
                                                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                                        border: `3px solid ${getChartConfig(chartMetric).color}`,
                                                        borderRadius: '12px',
                                                        boxShadow: '0 12px 30px -8px rgba(0, 0, 0, 0.25), 0 6px 12px -4px rgba(0, 0, 0, 0.1)',
                                                        padding: '16px 20px',
                                                        backdropFilter: 'blur(8px)'
                                                    }}>
                                                        <div style={{ 
                                                            color: getChartConfig(chartMetric).color,
                                                            fontWeight: '600',
                                                            fontSize: '14px',
                                                            lineHeight: '1.6'
                                                        }}>
                                                            <div>{metricLabel}: {formattedValue}</div>
                                                            <div>Percentage: {percentage}%</div>
                                                            <div>Period: {periodLabel}</div>
                                                            <div>Date: {data.fullDate}</div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Legend 
                                        verticalAlign="middle"
                                        align="left"
                                        layout="vertical"
                                        wrapperStyle={{ 
                                            position: 'absolute',
                                            left: '64%',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            lineHeight: '2.2',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}
                                        iconType="circle"
                                        formatter={(value: string, entry: any) => {
                                            const formattedValue = chartMetric === "revenue" 
                                                ? `$${entry.payload?.value?.toLocaleString?.() || 0}` 
                                                : chartMetric === "average" 
                                                ? `$${entry.payload?.value?.toFixed?.(2) || 0}` 
                                                : entry.payload?.value?.toLocaleString?.() || 0;
                                            return `${value}: ${formattedValue}`;
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <p className="text-lg">No {getChartConfig(chartMetric).label.toLowerCase()} data available</p>
                                <p className="text-sm">for the selected {viewMode === "month" ? "month" : "year"}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-black font-bold text-xl mb-4">📈 Trend Analysis</h3>
                
                <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100">
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart 
                            data={salesData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            <defs>
                                <linearGradient id={`gradient-${chartMetric}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={getChartConfig(chartMetric).color} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={getChartConfig(chartMetric).color} stopOpacity={0.05}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid 
                                strokeDasharray="3 3" 
                                stroke="#b5c4daff" 
                                strokeWidth={1.5}
                                horizontal={true}
                                vertical={false}
                                opacity={0.6}
                            />
                            <XAxis
                                dataKey="date"
                                interval="preserveStartEnd"
                                tickFormatter={(value) => formatChartTick(value, viewMode)}
                                axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                                tickLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                                tick={{ fill: '#374151', fontSize: 13, fontWeight: 500 }}
                            />
                            <YAxis 
                                axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                                tickLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                                tick={{ fill: '#374151', fontSize: 13, fontWeight: 500 }}
                                tickFormatter={(value) => {
                                    if (chartMetric === "revenue" || chartMetric === "average") {
                                        return `$${value.toLocaleString()}`;
                                    }
                                    return value.toLocaleString();
                                }}
                            />
                            <Tooltip
                                formatter={getChartConfig(chartMetric).formatter}
                                labelFormatter={(label) => formatTooltipLabel(label)}
                                contentStyle={{
                                    backgroundColor: '#ffffff',
                                    border: `2px solid ${getChartConfig(chartMetric).color}`,
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    fontSize: '14px',
                                    color: '#1f2937'
                                }}
                                labelStyle={{ 
                                    color: '#111827', 
                                    fontWeight: 'bold',
                                    marginBottom: '4px' 
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey={getLineChartDataKey(chartMetric)}
                                stroke={getChartConfig(chartMetric).color}
                                strokeWidth={4}
                                fill={`url(#gradient-${chartMetric})`}
                                dot={{ 
                                    r: 5, 
                                    fill: getChartConfig(chartMetric).color,
                                    stroke: '#ffffff',
                                    strokeWidth: 2
                                }}
                                activeDot={{ 
                                    r: 8, 
                                    fill: getChartConfig(chartMetric).color,
                                    stroke: '#ffffff',
                                    strokeWidth: 3
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-10">
                <h3 className="text-black font-bold text-xl mb-4">🏆 Best-Selling Products</h3>
                <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100">
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
        </div>
    );
};