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
import { ReportService } from "../../../config/api";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ReportPDF } from "./GeneratePDF.tsx";
import { Button } from "../../Button";
import "./Report.css";

// Update type imports to use the new API types
import type {
    SalesSummaryResponse,
    BestSellingProductsResponse,
    MonthlyReportItem,
    YearlyReportItem,
    ProductData
} from "../../../types/backend";

export type SalesData = { 
    date: string; 
    total: number; 
    orders: number; 
    averageOrder: number; 
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

/**
 * Convert API response to SalesData format
 */
const convertToSalesData = (
    data: MonthlyReportItem[] | YearlyReportItem[],
    viewMode: "month" | "year",
    year: number,
    month?: number
): SalesData[] => {
    return data.map(item => {
        let dateStr: string;
        
        if (viewMode === "month" && month) {
            // For monthly view: period is the day (1-31)
            dateStr = `${year}-${month.toString().padStart(2, '0')}-${item.period.toString().padStart(2, '0')}`;
        } else {
            // For yearly view: period is the month (1-12)
            dateStr = `${year}-${item.period.toString().padStart(2, '0')}-01`;
        }
        
        return {
            date: dateStr,
            total: item.totalRevenue || 0,
            orders: item.totalOrders || 0,
            averageOrder: item.averageOrderValue || 0
        };
    });
};

export const ReportList: React.FC = () => {
    const [viewMode, setViewMode] = useState<"month" | "year">("month");
    const [chartMetric, setChartMetric] = useState<ChartMetric>("revenue");
    const [filters, setFilters] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    });
    const [topN, setTopN] = useState(10);
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [topProducts, setTopProducts] = useState<ProductData[]>([]);
    const [summary, setSummary] = useState<SalesSummaryResponse>({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
    });
    const [loading, setLoading] = useState(false);
    
    // Best selling products table states
    const [searchTerm, setSearchTerm] = useState("");
    const [sortInput, setSortInput] = useState<{ field: string; order: 'asc' | 'desc' }>({ 
        field: 'totalRevenue', order: 'desc' 
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Get total revenue and total orders for the selected period
    const fetchSummary = async () => {
        try {
            setLoading(true);
            let startDate: string, endDate: string;
            
            if (viewMode === "month") {
                // For month view: get summary for the entire month
                startDate = `${filters.year}-${filters.month.toString().padStart(2, '0')}-01`;
                const lastDay = new Date(filters.year, filters.month, 0).getDate();
                endDate = `${filters.year}-${filters.month.toString().padStart(2, '0')}-${lastDay}`;
            } else {
                // For year view: get summary for the entire year
                startDate = `${filters.year}-01-01`;
                endDate = `${filters.year}-12-31`;
            }
            
            const summaryResponse = await ReportService.getReportSummary(startDate, endDate);
            console.log('Response: summary data:', summaryResponse);

            setSummary({
                totalRevenue: summaryResponse.totalRevenue || 0,
                totalOrders: summaryResponse.totalOrders || 0,
                averageOrderValue: summaryResponse.averageOrderValue || 0,
            });
        } catch (error: any) {
            console.error('Error fetching summary:', error);
            setSummary({ totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 });
        } finally {
            setLoading(false);
        }
    };

    // Fetch sales data using the new batch APIs
    const fetchSales = async () => {
        try {
            setLoading(true);
            let data: SalesData[] = [];
            
            if (viewMode === "month") {
                // Use getReportInMonth for daily breakdown
                const monthlyData = await ReportService.getReportInMonth(filters.month, filters.year);
                console.log(`Response: monthly data for ${filters.year}-${filters.month}:`, monthlyData);
                data = convertToSalesData(monthlyData, "month", filters.year, filters.month);
            } else {
                // Use getReportInYear for monthly breakdown
                const yearlyData = await ReportService.getReportInYear(filters.year);
                console.log(`Response: yearly data for ${filters.year}:`, yearlyData);
                data = convertToSalesData(yearlyData, "year", filters.year);
            }
            
            setSalesData(data);
        } catch (error: any) {
            console.error('Error fetching sales data:', error);
            setSalesData([]);
        } finally {
            setLoading(false);
        }
    };

    // Get best-selling products based on current filter
    const fetchTopProducts = async () => {
        try {
            setLoading(true);
            let startDate: string, endDate: string;
            
            if (viewMode === "month") {
                startDate = `${filters.year}-${filters.month.toString().padStart(2, '0')}-01`;
                const lastDay = new Date(filters.year, filters.month, 0).getDate();
                endDate = `${filters.year}-${filters.month.toString().padStart(2, '0')}-${lastDay}`;
            } else {
                startDate = `${filters.year}-01-01`;
                endDate = `${filters.year}-12-31`;
            }
            
            const response = await ReportService.getBestSellingProducts(topN, startDate, endDate);
            console.log(`Response: top ${topN} products in range: ${startDate} - ${endDate}:`, response);

            if (response.products && Array.isArray(response.products)) {
                setTopProducts(response.products);
            } else if (Array.isArray(response)) {
                // Handle case where API returns array directly
                setTopProducts(response);
            } else {
                setTopProducts([]);
            }
        } catch (error: any) {
            console.error('Error fetching top products:', error);
            setTopProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            await Promise.all([
                fetchSales(),
                fetchSummary(),
                fetchTopProducts()
            ]);
        };
        
        fetchAllData();
    }, [filters, viewMode, topN]);

    // Best selling products filter and pagination logic
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

    const handleSortChange = (field: string, order: 'asc' | 'desc') => {
        setSortInput({ field, order });
    };

    const resetFilters = () => {
        setSearchTerm("");
        setSortInput({ field: 'totalRevenue', order: 'desc' });
        setCurrentPage(1);
    };

    const filteredProducts = topProducts
        .filter((p) => 
            p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.productId.toString().includes(searchTerm)
        )
        .sort((a, b) => {
            if (!sortInput.field) return 0;
            const multiplier = sortInput.order === "asc" ? 1 : -1;
            if (sortInput.field === "productName") return multiplier * a.productName.localeCompare(b.productName);
            if (sortInput.field === "totalQuantitySold") return multiplier * (a.totalQuantitySold - b.totalQuantitySold);
            if (sortInput.field === "totalRevenue") return multiplier * (a.totalRevenue - b.totalRevenue);
            return 0;
        });

    // Pagination calculations
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Pagination handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    const getVisiblePages = () => {
        const visiblePages = [];
        const maxVisiblePages = 5;
        
        let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let end = Math.min(totalPages, start + maxVisiblePages - 1);
        
        if (end - start + 1 < maxVisiblePages) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }
        
        for (let i = start; i <= end; i++) {
            visiblePages.push(i);
        }
        
        return visiblePages;
    };

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
                                topN={topN}
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
                                    Export PDF Report
                                </button>
                            )
                        }
                    </PDFDownloadLink>
                </div>
            </div>

            {/* Loading indicator */}
            {loading && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-blue-700">Loading report data...</div>
                </div>
            )}

            {/* Filter Controls */}
            <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <label className="flex flex-col text-sm">
                    View by:
                    <select
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value as "month" | "year")}
                        className="p-2 border rounded"
                        disabled={loading}
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
                        disabled={loading}
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
                            disabled={loading}
                        >
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                    </label>
                )}
                <label className="flex flex-col text-sm">
                    Top N Products:
                    <select
                        value={topN}
                        onChange={(e) => setTopN(Number(e.target.value))}
                        className="p-2 border rounded"
                        disabled={loading}
                    >
                        <option value={5}>Top 5</option>
                        <option value={10}>Top 10</option>
                        <option value={15}>Top 15</option>
                        <option value={20}>Top 20</option>
                        <option value={25}>Top 25</option>
                        <option value={50}>Top 50</option>
                    </select>
                </label>
            </div>

            <div className="mb-6">
                <h3 className="text-black font-bold text-xl mb-4">Summary Overview</h3>
                
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
                        {getChartConfig(chartMetric).label} Distribution by {viewMode === "month" ? "Days" : "Months"}
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
                <h3 className="text-black font-bold text-xl mb-4">Trend Analysis</h3>
                
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
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-black font-bold uppercase text-2xl">Best-Selling Products</h3>
                    <div className="flex items-center gap-2">
                        <Button onClick={resetFilters}>Reset</Button>
                    </div>
                </div>
                
                <div className="flex flex-col mb-4 p-4 bg-gray-50 gap-2 rounded">
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search by product name or ID..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="border border-gray-300 p-2 rounded text-sm"
                        />

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Sort by:</span>
                            <select
                                value={`${sortInput.field}|${sortInput.order}`}
                                onChange={(e) => {
                                    const [field, order] = e.target.value.split('|');
                                    handleSortChange(field, order as 'asc' | 'desc');
                                }}
                                className="border border-gray-300 p-2 rounded text-sm"
                            >
                                <option value="totalRevenue|desc">Revenue (High to Low)</option>
                                <option value="totalRevenue|asc">Revenue (Low to High)</option>
                                <option value="totalQuantitySold|desc">Quantity Sold (High to Low)</option>
                                <option value="totalQuantitySold|asc">Quantity Sold (Low to High)</option>
                                <option value="productName|asc">Product Name (A-Z)</option>
                                <option value="productName|desc">Product Name (Z-A)</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Show:</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                className="border border-gray-300 p-2 rounded text-sm"
                            >
                                <option value={5}>5 per page</option>
                                <option value={10}>10 per page</option>
                                <option value={25}>25 per page</option>
                                <option value={50}>50 per page</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">No data found.</div>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="text-black font-bold uppercase p-2 border border-gray-300 w-24">Product ID</th>
                                    <th 
                                        className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer w-1/3"
                                        onClick={() => handleSortChange('productName', sortInput.order === 'asc' ? 'desc' : 'asc')}
                                    >
                                        Product Name {sortInput.field === 'productName' && (sortInput.order === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th 
                                        className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer w-32"
                                        onClick={() => handleSortChange('totalQuantitySold', sortInput.order === 'asc' ? 'desc' : 'asc')}
                                    >
                                        Total Quantity Sold {sortInput.field === 'totalQuantitySold' && (sortInput.order === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th 
                                        className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer w-32"
                                        onClick={() => handleSortChange('totalRevenue', sortInput.order === 'asc' ? 'desc' : 'asc')}
                                    >
                                        Revenue {sortInput.field === 'totalRevenue' && (sortInput.order === 'asc' ? '↑' : '↓')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProducts.map((p) => (
                                    <tr key={p.productId} className="border-b border-gray-300">
                                        <td className="p-2 border-x border-gray-300 w-24 text-center">{p.productId}</td>
                                        <td className="p-2 border-x border-gray-300 w-1/3">{p.productName}</td>
                                        <td className="p-2 border-x border-gray-300 w-32 text-center font-semibold text-blue-600">{p.totalQuantitySold}</td>
                                        <td className="p-2 border-x border-gray-300 w-32 text-right font-semibold text-green-600">
                                            ${p.totalRevenue?.toLocaleString?.() ?? 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* Pagination Controls */}
                    {filteredProducts.length > 0 && (
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {/* First Page Button */}
                                <button
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded ${
                                        currentPage === 1
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    First
                                </button>

                                {/* Previous Page Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded ${
                                        currentPage === 1
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Previous
                                </button>

                                {/* Page Numbers */}
                                {getVisiblePages().map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 rounded ${
                                            page === currentPage
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                {/* Next Page Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 rounded ${
                                        currentPage === totalPages
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Next
                                </button>

                                {/* Last Page Button */}
                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 rounded ${
                                        currentPage === totalPages
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Last
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};