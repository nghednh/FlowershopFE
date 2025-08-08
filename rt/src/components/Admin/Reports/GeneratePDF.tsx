import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet
} from "@react-pdf/renderer";

// Convert month number to full name
const getMonthName = (month: number) =>
  new Date(2000, month - 1).toLocaleString("en-US", { month: "long" });

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  section: { marginBottom: 20 },
  headerContainer: { marginBottom: 10, alignItems: "center" },
  header: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  subHeader: { fontSize: 12, textAlign: "center", marginTop: 4 },
  generatedDate: { fontSize: 10, textAlign: "center", marginTop: 2 },
  tableTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 6 },
  table: { width: "auto", borderStyle: "solid", borderWidth: 1, borderColor: "#000" },
  tableRow: { flexDirection: "row" },
  tableColHeader: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#f0f0f0",
    padding: 4,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center"
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 4,
    flex: 1,
    textAlign: "center"
  },
});

type Props = {
  summary: { totalRevenue: number, totalOrders: number, averageOrderValue: number };
  salesData: { date: string; total: number; orders: number; averageOrder: number }[];
  topProducts: {
    productId: string;
    productName: string;
    totalQuantitySold: number;
    totalRevenue: number;
  }[];
  reportPeriod: string,
  viewMode: "month" | "year";
  topN: number;
};

export const ReportPDF: React.FC<Props> = ({
  summary,
  salesData,
  topProducts,
  reportPeriod,
  viewMode,
  topN
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>FlowerShop Sales Report</Text>
        <Text style={[styles.subHeader, { fontSize: 12, fontWeight: 'bold', marginTop: 8 }]}>
          {viewMode === "month"
            ? `MONTHLY REPORT: ${getMonthName(parseInt(reportPeriod.split("-")[1]))} ${reportPeriod.split("-")[0]}`
            : `ANNUAL REPORT: ${reportPeriod}`}
        </Text>
        <Text style={styles.generatedDate}>
          Generated on: {new Date().toLocaleString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>

      {/* Executive Summary */}
      <View style={styles.section}>
        <Text style={styles.tableTitle}>1. Executive Summary</Text>
        <Text style={{ marginBottom: 4 }}>• Total Revenue: ${(summary?.totalRevenue || 0).toLocaleString()}</Text>
        <Text style={{ marginBottom: 4 }}>• Total Orders: {(summary?.totalOrders || 0).toLocaleString()}</Text>
        <Text style={{ marginBottom: 4 }}>• Average Order Value: ${(summary?.averageOrderValue || 0).toFixed(2)}</Text>
        <Text style={{ marginBottom: 4 }}>• Data Points: {salesData?.length || 0} total {viewMode === "month" ? "days" : "months"}</Text>
      </View>

      {/* Detailed Revenue Table */}
      <View style={styles.section}>
        <Text style={styles.tableTitle}>2. Revenue Breakdown by {viewMode === "month" ? "Day" : "Month"}</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>{viewMode === "month" ? "Date" : "Month"}</Text>
            <Text style={styles.tableColHeader}>Revenue ($)</Text>
            <Text style={styles.tableColHeader}>Number of Orders</Text>
            <Text style={styles.tableColHeader}>AOV ($)</Text>
          </View>
          {salesData && salesData.length > 0 ? (
            salesData.map((s, i) => (
              <View style={styles.tableRow} key={i}>
                <Text style={styles.tableCol}>
                  {viewMode === "month" ? s.date : s.date}
                </Text>
                <Text style={styles.tableCol}>{(s.total || 0).toLocaleString()}</Text>
                <Text style={styles.tableCol}>{s.orders || 0}</Text>
                <Text style={styles.tableCol}>{(s.averageOrder || 0).toFixed(2)}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCol, { flex: 4, textAlign: 'center' }]}>
                No sales data available for the selected period
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Best Selling Products Table */}
      <View style={styles.section}>
        <Text style={styles.tableTitle}>3. Top {topN} Best Selling Products</Text>
        {!topProducts || topProducts.length === 0 ? (
          <Text>No product sales data available for the selected period.</Text>
        ) : (
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Rank</Text>
              <Text style={styles.tableColHeader}>Product Name</Text>
              <Text style={styles.tableColHeader}>Quantity Sold</Text>
              <Text style={styles.tableColHeader}>Revenue ($)</Text>
            </View>
            {topProducts.map((p, i) => (
              <View style={styles.tableRow} key={i}>
                <Text style={styles.tableCol}>#{i + 1}</Text>
                <Text style={styles.tableCol}>{p.productName || 'N/A'}</Text>
                <Text style={styles.tableCol}>{p.totalQuantitySold || 0}</Text>
                <Text style={styles.tableCol}>{(p.totalRevenue || 0).toLocaleString()}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={{ marginTop: 30, borderTopWidth: 1, borderTopColor: '#ccc', paddingTop: 10 }}>
        <Text style={{ fontSize: 10, textAlign: 'center', color: '#666' }}>
          This report was automatically generated by FlowerShop Analytics System
        </Text>
        <Text style={{ fontSize: 8, textAlign: 'center', color: '#999', marginTop: 4 }}>
          For questions about this report, please contact the administration team
        </Text>
      </View>
    </Page>
  </Document>
);
