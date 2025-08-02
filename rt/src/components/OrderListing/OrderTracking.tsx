import React from "react";
import { useParams } from "react-router-dom";
import { IOrder, PaymentMethod } from "../../types/backend.d"; // adjust this path as needed

const trackingSteps = ["Processing", "Shipped", "Out for Delivery", "Delivered"];

const orderStatusToStep = (status: string) => {
  const idx = trackingSteps.findIndex(step => step.toLowerCase() === status.toLowerCase());
  return idx >= 0 ? idx : 0;
};

// You'd replace this mock with actual API data or props
const sampleOrders: IOrder[] = [
  {
    id: 12345,
    userId: 1,
    cartId: 100,
    addressId: 55,
    paymentMethod: PaymentMethod.PayPal,
    totalAmount: 99.99,
    status: "Out for Delivery",
    createdAt: "2025-07-30T10:00:00Z",
    updatedAt: "2025-08-01T12:00:00Z",
  },
  // add more if needed
];

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();

  const order: IOrder | undefined = sampleOrders.find(
    (o) => o.id.toString() === orderId
  );

  if (!order) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-red-600 font-semibold">Order not found.</p>
      </div>
    );
  }

  const currentStep = orderStatusToStep(order.status);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Order Tracking</h1>
      <div className="mb-4">
        <p className="text-lg font-medium">Order ID: {order.id}</p>
        <p className="text-sm text-gray-500">Created: {new Date(order.createdAt).toLocaleString()}</p>
        {order.updatedAt && (
          <p className="text-sm text-gray-500">Last Update: {new Date(order.updatedAt).toLocaleString()}</p>
        )}
        <p className="text-sm text-gray-500">Total: ${order.totalAmount.toFixed(2)}</p>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold mb-2">Tracking Progress</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {trackingSteps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  index <= currentStep ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
              <span className="ml-2 mr-4 text-sm">{step}</span>
              {index < trackingSteps.length - 1 && (
                <div className={`h-1 w-6 sm:w-12 ${index < currentStep ? "bg-green-500" : "bg-gray-300"}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
