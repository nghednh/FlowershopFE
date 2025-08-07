import instance from "../config/axios-customize";

export const ReportService = {
  // Report: summary of total revenue and total orders
  getReportSummary: (startDate: string, endDate: string): Promise<{ totalOrders: number, totalRevenue: number, averageOrderValue: number }> => {
    return instance.get(
      '/api/admin/reports/sales-summary',
      { params: { startDate, endDate } }
    );
  },

  // Report: best-selling products in a range
  getBestSellingProducts: (topN: number, startDate: string, endDate: string): Promise<{ products: any[] }> => {
    return instance.get(
      '/api/admin/reports/best-selling-products',
      { params: { topN, startDate, endDate } }
    );
  },
};
