import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IOrder, OrderStatus } from "../../types/backend.d";
import { getMyOrders } from "../../config/api";
import { Input } from "../Input"

const PAGE_SIZE = 5;

export default function OrderHistory() {
  const [allOrders, setAllOrders] = useState<IOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredOrders = allOrders.filter((order) =>
    order.id.toString().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Order History</h1>

      <Input
        label="Search by Order ID..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // reset to first page on search
        }}
      />

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
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white flex flex-col sm:flex-row sm:justify-between"
              >
                <div>
                  <p className="text-lg font-medium">
                    Order ID:{" "}
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {order.id}
                    </Link>
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 text-sm sm:text-right">
                  <p>
                    Status:{" "}
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
