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
  summary: { totalOrders: number; totalRevenue: number, averageOrderValue: number };
  salesData: { date: string; total: number }[];
  topProducts: {
    productId: string;
    productName: string;
    totalQuantitySold: number;
    totalRevenue: number;
  }[];
  reportPeriod: string,
  viewMode: "month" | "year";
};

export const ReportPDF: React.FC<Props> = ({
  summary,
  salesData,
  topProducts,
  reportPeriod,
  viewMode
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Sales Report - Online Flower Shop</Text>
        <Text style={styles.subHeader}>
          {viewMode === "month"
            ? `Report for ${getMonthName(parseInt(reportPeriod.split("-")[1]))} ${reportPeriod.split("-")[0]}`
            : `Report for ${reportPeriod}`}
        </Text>
        <Text style={styles.generatedDate}>
          Generated on: {new Date().toISOString().slice(0, 10)}
        </Text>
      </View>

      {/* Summary */}
      <View style={styles.section}>
        <Text style={styles.tableTitle}>I. Summary</Text>
        <Text>Total Revenue: ${summary.totalRevenue.toLocaleString()}</Text>
        <Text>Total Quantity Sold: ${summary.totalOrders}</Text>
        <Text>Average Value/Order: ${summary.averageOrderValue}</Text>
      </View>

      {/* Revenue Table */}
      <View style={styles.section}>
        <Text style={styles.tableTitle}>II. Revenue Over Time</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Date</Text>
            <Text style={styles.tableColHeader}>Revenue ($)</Text>
          </View>
          {salesData.map((s, i) => (
            <View style={styles.tableRow} key={i}>
              <Text style={styles.tableCol}>{s.date}</Text>
              <Text style={styles.tableCol}>{s.total.toLocaleString()}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Best Selling Products Table */}
      <View style={styles.section}>
        <Text style={styles.tableTitle}>III. Best-Selling Products</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Product Name</Text>
            <Text style={styles.tableColHeader}>Sold Quantity</Text>
            <Text style={styles.tableColHeader}>Revenue ($)</Text>
          </View>
          {topProducts.map((p, i) => (
            <View style={styles.tableRow} key={i}>
              <Text style={styles.tableCol}>{p.productName}</Text>
              <Text style={styles.tableCol}>{p.totalQuantitySold}</Text>
              <Text style={styles.tableCol}>{p.totalRevenue.toLocaleString()}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);
