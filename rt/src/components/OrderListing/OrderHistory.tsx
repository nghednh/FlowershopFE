import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IOrder, PaymentMethod } from "../../types/backend.d"; // adjust the path to your types

const sampleOrders: IOrder[] = [
  {
    id: 12345,
    userId: 1,
    cartId: 100,
    addressId: 55,
    paymentMethod: PaymentMethod.COD,
    totalAmount: 99.99,
    status: "Delivered",
    createdAt: "2025-07-30T10:00:00Z",
    updatedAt: "2025-08-01T12:00:00Z",
  },
  {
    id: 12346,
    userId: 1,
    cartId: 101,
    addressId: 56,
    paymentMethod: PaymentMethod.PayPal,
    totalAmount: 49.5,
    status: "Shipped",
    createdAt: "2025-07-28T14:20:00Z",
  },
  {
    id: 12347,
    userId: 1,
    cartId: 102,
    addressId: 57,
    paymentMethod: PaymentMethod.COD,
    totalAmount: 15.0,
    status: "Processing",
    createdAt: "2025-07-25T09:15:00Z",
  },
  {
    id: 12348,
    userId: 1,
    cartId: 103,
    addressId: 58,
    paymentMethod: PaymentMethod.COD,
    totalAmount: 120.0,
    status: "Cancelled",
    createdAt: "2025-07-20T18:30:00Z",
  },
];

export default function OrderHistory() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = sampleOrders.filter((order) =>
    order.id.toString().includes(searchTerm)
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Order History</h1>

      <input
        type="text"
        placeholder="Search by Order ID..."
        className="w-full p-2 mb-6 border border-gray-300 rounded-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          filteredOrders.map((order) => (
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
                      order.status === "Delivered"
                        ? "text-green-600"
                        : order.status === "Shipped"
                        ? "text-blue-600"
                        : order.status === "Processing"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p>Total: ${order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
