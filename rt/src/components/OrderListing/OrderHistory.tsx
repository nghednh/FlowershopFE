import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IOrder, OrderStatus } from "../../types/backend.d";
import { getMyOrders } from "../../config/api";
import { Input } from "../Input"
import { Select } from "../Select";

const PAGE_SIZE = 5;

export default function OrderHistory() {
  const [allOrders, setAllOrders] = useState<IOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState<"id" | "tracking">("id");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyOrders()
      .then((res) => {
        if (res) {
          setAllOrders(res as IOrder[]);
        } else {
          setError("Failed to load orders.");
        }
      })
      .catch(() => setError("Error fetching order history."))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = allOrders.filter((order) => {
    if (!searchTerm.trim()) return true;

    if (searchMode === "id") {
      return order.id.toString().includes(searchTerm);
    }

    if (searchMode === "tracking") {
      return order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    }

    return true;
  });


  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const navigate = useNavigate();

  const handleOrderClick = (order: IOrder) => {
      navigate(`/orders/${order.id}`);
    };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Order History</h1>

      <div className="flex gap-4 items-end">
  <div className="flex-1">
    <Input
      label={`Search by ${searchMode === "id" ? "Order ID" : "Tracking Number"}...`}
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // reset to first page on search
      }}
    />
    </div>
    <Select
      label="Search By"
      value={searchMode}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchMode(e.target.value as "id" | "tracking");
        setSearchTerm(""); // optional: reset search input when switching
        setCurrentPage(1);
      }}
      options={[
        { value: "id", label: "Order ID" },
        { value: "tracking", label: "Tracking Number" }
      ]}
      className="w-50"
    />
  </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : paginatedOrders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {paginatedOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white flex flex-col sm:flex-row sm:justify-between cursor-pointer hover:bg-gray-50 transition"
                onClick={() => handleOrderClick(order)}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') window.location.href = `/orders/${order.id}`; }}
                aria-label={`View details for order ${order.id}`}
              >
                <div>
                  <p className="text-lg font-medium">
                    Order ID: <span className="text-blue-600">{order.id}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Tracking Number: <span className="text-gray-800">{order.trackingNumber}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 text-sm sm:text-right">
                  <p>
                    Status: {" "}
                    <span
                      className={`font-semibold ${
                        order.orderStatus === OrderStatus.Delivered
                          ? "text-green-600"
                          : order.orderStatus === OrderStatus.Shipped
                          ? "text-blue-600"
                          : order.orderStatus === OrderStatus.Processing
                          ? "text-yellow-600"
                          : order.orderStatus === OrderStatus.Cancelled
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {OrderStatus[order.orderStatus]}
                    </span>
                  </p>
                  <p>Total: ${order.sum.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="self-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
