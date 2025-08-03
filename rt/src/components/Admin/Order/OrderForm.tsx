import React, { useEffect, useState } from "react";
import { Select } from "../../Select";
import { Input } from "../../Input";
import { Button } from "../../Button";
import { IOrder, IUser } from "../../../types/backend";
import { createOrder, updateOrder, getUsers, getUserAddresses } from "../../../config/api";

export enum PaymentMethod {
    COD,        // Cash on Delivery
    PayPal,
    VNPay
}

interface OrderFormProps {
  order?: IOrder;
  onSave: (data: IOrder) => void;
  onClose: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ order, onSave, onClose }) => {
  const [formData, setFormData] = useState<IOrder>(
    order || {
      id: 0,
      userId: 0,
      cartId: 0,
      addressId: 0,
      paymentMethod: PaymentMethod.COD,
      totalAmount: 0,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  const [users, setUsers] = useState<IUser[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string>("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersData, addressesData] = await Promise.all([
        getUsers(),
        getUserAddresses(),
      ]);

      setUsers(usersData.data);
      setAddresses(addressesData.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Validate required fields and constraints
  const validateForm = (): boolean => {
    const { userId, totalAmount, status } = formData;

    // User ID validation
    if (!userId || userId <= 0) {
      setValidationError("User is required");
      return false;
    }

    // Total Amount validation
    if (!totalAmount || totalAmount <= 0) {
      setValidationError("Total Amount must be greater than 0");
      return false;
    }

    if (totalAmount > 999999.99) {
      setValidationError("Total Amount cannot exceed $999,999.99");
      return false;
    }

    // Status validation
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!status || !validStatuses.includes(status)) {
      setValidationError("Please select a valid status");
      return false;
    }

    setValidationError("");
    return true;
  };

  // Combined validation function
  const validateAll = (): boolean => {
    return validateForm();
  };

  const handleSubmit = async () => {
    if (!validateAll()) {
      return;
    }

    try {
      const orderData = {
        ...formData,
        id: order?.id || 0,
        updatedAt: new Date().toISOString()
      };

      if (!order || order.id === 0) {
        createOrder(orderData)
          .then(response => {
            onSave(response.data);
            console.log("Order created successfully:", response);
            onClose();
          })
          .catch(error => {
            alert('Error creating order: ' + (error.message || 'Unknown error'));
            console.error("Response status:", error.response?.status);
            console.error("Response data:", error.response?.data);
            console.error("Request data:", error.config?.data);
          });
      } else {
        updateOrder(order.id, orderData.status, "trackingNumber")
          .then(response => {
            onSave(response.data);
            console.log("Order updated successfully:", response);
          })
          .catch(error => {
            alert('Error updating order: ' + (error.message || 'Unknown error'));
            console.error("Response status:", error.response?.status);
            console.error("Response data:", error.response?.data);
            console.error("Request data:", error.config?.data);
          });
      }

      onClose();
    } catch (error: any) {
      setValidationError(error.response?.data?.message || error.message || 'Failed to save order');
      console.error("Error saving order:", error);
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      console.error("Request data:", error.config?.data);
    }
  };

  const getPaymentMethodName = (method: PaymentMethod): string => {
    switch (method) {
      case PaymentMethod.COD: return "Cash on Delivery";
      case PaymentMethod.PayPal: return "PayPal";
      case PaymentMethod.VNPay: return "VNPay";
      default: return "Unknown";
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 py-8">Loading...</div>;
  }

  return (
    <div>
      <h3 className="text-black font-bold uppercase text-lg mb-4">{order ? "Edit" : "Add"} Order</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {validationError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {validationError}
        </div>
      )}

      <Select
        label="User"
        value={formData.userId.toString()}
        onChange={(e) => {
          setFormData({ ...formData, userId: Number(e.target.value) });
          setTimeout(() => validateAll(), 0);
        }}
        options={[
          { value: "0", label: "Select a user" },
          ...users.map((user) => ({
            value: user.id.toString(),
            label: `${user.firstName} ${user.lastName} (ID: ${user.id})`
          }))
        ]}
        required
      />

      <Input
        label="Cart ID"
        type="number"
        value={formData.cartId.toString()}
        onChange={(e) => setFormData({ ...formData, cartId: Number(e.target.value) || 0 })}
      />

      <Select
        label="Address"
        value={formData.addressId.toString()}
        onChange={(e) => setFormData({ ...formData, addressId: Number(e.target.value) })}
        options={[
          { value: "0", label: "Select an address" },
          ...addresses.map((address) => ({
            value: address.id.toString(),
            label: `${address.fullName} - ${address.streetAddress}, ${address.city}`
          }))
        ]}
      />

      <Select
        label="Payment Method"
        value={formData.paymentMethod.toString()}
        onChange={(e) => setFormData({ ...formData, paymentMethod: Number(e.target.value) as PaymentMethod })}
        options={[
          { value: PaymentMethod.COD.toString(), label: getPaymentMethodName(PaymentMethod.COD) },
          { value: PaymentMethod.PayPal.toString(), label: getPaymentMethodName(PaymentMethod.PayPal) },
          { value: PaymentMethod.VNPay.toString(), label: getPaymentMethodName(PaymentMethod.VNPay) }
        ]}
        required
      />

      <Input
        label="Total Amount"
        type="number"
        step={0.01}
        min={0.01}
        max={999999.99}
        value={formData.totalAmount}
        onChange={(e) => {
          setFormData({ ...formData, totalAmount: Number(e.target.value) });
          setTimeout(() => validateAll(), 0);
        }}
        required
      />

      <Select
        label="Status"
        value={formData.status}
        onChange={(e) => {
          setFormData({ ...formData, status: e.target.value });
          setTimeout(() => validateAll(), 0);
        }}
        options={[
          { value: "Pending", label: "Pending" },
          { value: "Processing", label: "Processing" },
          { value: "Shipped", label: "Shipped" },
          { value: "Delivered", label: "Delivered" },
          { value: "Cancelled", label: "Cancelled" }
        ]}
        required
      />

      <div className="flex justify-center">
        <Button
          disabled={!!validationError || loading}
          className={validationError || loading ? "opacity-50 cursor-not-allowed" : ""}
          onClick={handleSubmit}
        >Save</Button>
      </div>
    </div>
  );
};