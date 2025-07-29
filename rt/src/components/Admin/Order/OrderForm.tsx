import React, { useState } from "react";
import { Select } from "../../Select";
import { Input } from "../../Input";
import { Button } from "../../Button";
import { IOrder } from "../../../types/backend";

interface OrderFormProps {
  order?: IOrder;
  onSave: (data: IOrder) => void;
  onClose: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ order, onSave, onClose }) => {
  const [formData, setFormData] = useState<IOrder>(order || { 
    id: 0,
    userId: 0,
    paymentMethod: 0,
    totalAmount: 0,
    cartId: 0,
    addressId: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "Pending", 
  });

  const handleSubmit = () => {
    onSave({ ...formData, id: order?.id || Date.now() });
    onClose();
  };

  return (
    <div>
      <h3 className="text-black font-bold uppercase text-lg mb-4">{order ? "Edit" : "Add"} Order</h3>
      <Select
        label="Status"
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        options={[{ value: "Pending", label: "Pending" }, { value: "Shipped", label: "Shipped" }, { value: "Delivered", label: "Delivered" }]}
        required
      />
      <Input
        label="Address ID"
        value={formData.addressId.toString()}
        onChange={(e) => setFormData({ ...formData, addressId: Number(e.target.value) })}
      />
      <Button onClick={handleSubmit}>Save</Button>
    </div>
  );
};