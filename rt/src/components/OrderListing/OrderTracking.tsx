import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IOrder, OrderStatus, PaymentMethod } from "../../types/backend.d";
import { getOrderDetails } from "../../config/api";

// Extended interface for order details with additional information
interface IOrderDetails extends IOrder {
  userName?: string;
  address?: {
    fullName: string;
    streetAddress: string;
    city: string;
    phoneNumber: string;
  };
  orderItems?: {
    id: number;
    name: string;
    quantity: number;
    price: number;
    product?: {
      images?: { imageUrl: string }[];
    };
  }[];
}

const trackingSteps: OrderStatus[] = [
  OrderStatus.Pending,
  OrderStatus.Processing,
  OrderStatus.Shipped,
  OrderStatus.Delivered,
  OrderStatus.Cancelled,
];

const orderStatusToStep = (status: OrderStatus) => {
  return trackingSteps.indexOf(status);
};

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<IOrderDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    getOrderDetails(Number(orderId))
      .then((res) => {
        console.log("Order details responseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee:", res);
        if (res) {
          setOrder(res as IOrderDetails);
        } else {
          setError("Order not found.");
        }
      })
      .catch(() => setError("Failed to fetch order details."))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return <div className="p-6 max-w-4xl mx-auto">Loading...</div>;
  }

  if (error || !order) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-red-600 font-semibold">{error || "Order not found."}</p>
      </div>
    );
  }

  const currentStep = orderStatusToStep(order.orderStatus);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Order Tracking</h1>

      <div className="space-y-1">
        <p className="text-lg font-medium">Order ID: {order.id}</p>
        <p className="text-sm text-gray-500">Tracking Number: {order.trackingNumber}</p>
        {order.userName && (
          <p className="text-sm text-gray-500">User: {order.userName}</p>
        )}
        <p className="text-sm text-gray-500">
          Created: {new Date(order.createdAt).toLocaleString()}
        </p>
        {order.updatedAt && (
          <p className="text-sm text-gray-500">
            Last Update: {new Date(order.updatedAt).toLocaleString()}
          </p>
        )}
        <p className="text-sm text-gray-500">
          Payment: {PaymentMethod[order.paymentMethod]}
        </p>
        <p className="text-sm text-gray-500">
          Total: ${order.sum.toFixed(2)}
        </p>
      </div>

      {order.address && (
        <div>
          <h2 className="font-semibold mb-1">Shipping Address</h2>
          <div className="text-sm text-gray-700">
            <p>{order.address.fullName}</p>
            <p>{order.address.streetAddress}</p>
            <p>{order.address.city}</p>
            <p>{order.address.phoneNumber}</p>
          </div>
        </div>
      )}

      {order.orderItems && order.orderItems.length > 0 && (
        <div>
          <h2 className="font-semibold mb-1">Items</h2>
          <div className="space-y-4">
            {order.orderItems.map((item: NonNullable<IOrderDetails['orderItems']>[0]) => (
              <div
                key={item.id}
                className="flex gap-4 items-center border p-3 rounded-md"
              >
                <img
                  src={item.product?.images?.[0]?.imageUrl || '/placeholder-image.jpg'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 text-sm">
                  <p className="font-medium">{item.name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price per item: ${item.price.toFixed(2)}</p>
                  <p className="font-semibold">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {order.orderStatus === OrderStatus.Cancelled ? (
        <div className="text-red-600 font-semibold mt-4">Order has been cancelled.</div>
      ) : (
        <div>
          <h2 className="font-semibold mb-2">Tracking Progress</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {trackingSteps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    index <= currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="ml-2 mr-4 text-sm">{step}</span>
                {index < trackingSteps.length - 1 && (
                  <div
                    className={`h-1 w-6 sm:w-12 ${
                      index < currentStep ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
