import instance from "../config/axios-customize";
import { SalesSummaryResponse, BestSellingProductsResponse, MonthlyReportItem, YearlyReportItem } from "../types/backend";

export const ReportService = {
  // Report: summary of total revenue and total orders
  getReportSummary: (startDate: string, endDate: string): Promise<SalesSummaryResponse> => {
    return instance.get(
      '/api/admin/reports/sales-summary',
      { params: { startDate, endDate } }
    );
  },

  // Report: best-selling products in a range
  getBestSellingProducts: (topN: number, startDate: string, endDate: string): Promise<BestSellingProductsResponse> => {
    return instance.get(
      '/api/admin/reports/best-selling-products',
      { params: { topN, startDate, endDate } }
    );
  },

  // Report: get monthly report with daily breakdown (period = day 1-31)
  getReportInMonth: (month: number, year: number): Promise<MonthlyReportItem[]> => {
    return instance.get(
      '/api/admin/reports/sales-month',
      { params: { month, year } }
    );
  },

  // Report: get yearly report with monthly breakdown (period = month 1-12)
  getReportInYear: (year: number): Promise<YearlyReportItem[]> => {
    return instance.get(
      '/api/admin/reports/sales-year',
      { params: { year } }
    );
  }
};