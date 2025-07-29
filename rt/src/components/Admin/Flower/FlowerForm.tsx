import React, { useState } from "react";
import { Input } from "../../Input";
import { Select } from "../../Select";
import { MultiSelect } from "../../MultiSelect";
import { Button } from "../../Button";
import { ICategory, IProduct } from "../../../types/backend";

interface FlowerFormProps {
  flower?: IProduct;
  onSave: (data: IProduct) => void;
  categories: ICategory[];
  onClose: () => void;
}

const isNameAZ = (name: string) => /^[a-zA-Z]+$/.test(name);
const isValidPrice = (price: number) => price >= 0;
const isValidStock = (stock: number) => stock >= 0;
const isValidCategoryIds = (ids: number[]) => ids.length > 0;

export const FlowerForm: React.FC<FlowerFormProps> = ({ flower, onSave, categories, onClose }) => {
  const [formData, setFormData] = useState<IProduct>(
    flower || {
      id: 0,
      name: "",
      flowerStatus: 0,
      description: "",
      basePrice: 0,
      condition: "",
      stockQuantity: 0,
      isActive: true,
      images: [""],
      categoryIds: [],
    }
  );


  const handleSubmit = () => {
    if (!isNameAZ(formData.name)) {
      alert("Name must contain only letters A-Z.");
      return;
    }

    if (!isValidPrice(formData.basePrice)) {
      alert("Base Price must be a non-negative number.");
      return;
    }

    if (!isValidStock(formData.stockQuantity)) {
      alert("Stock Quantity must be a non-negative number.");
      return;
    }

    if (!isValidCategoryIds(formData.categoryIds)) {
      alert("Please select at least one category.");
      return;
    }

    onSave({ ...formData, id: flower?.id || Date.now() });
    onClose();
  };

  return (
    <div>
      <h3 className="text-black font-bold uppercase text-lg mb-4">{flower ? "Edit" : "Add"} Flower</h3>
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <Select
        label="Status"
        value={formData.flowerStatus}
        onChange={(e) => setFormData({ ...formData, flowerStatus: Number(e.target.value) })}
        options={[{ value: 0, label: "New" }, { value: 1, label: "Old" }, { value: 2, label: "Low Stock" }]}
        required
      />
      <Input
        label="Description"
        value={formData.description || ""}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <Input
        label="Base Price"
        type="number"
        value={formData.basePrice}
        onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
        required
      />
      <Input
        label="Condition"
        value={formData.condition || ""}
        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
      />
      <Input
        label="Stock Quantity"
        type="number"
        value={formData.stockQuantity}
        onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
        required
      />
      <div className="mb-4">
        <label className="text-black font-bold uppercase">Active</label>
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="ml-2"
        />
      </div>
      <Input
        label="Image URL"
        value={formData.images[0]}
        onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
      />
      <MultiSelect
        label="Categories"
        value={formData.categoryIds}
        onChange={(ids) => setFormData({ ...formData, categoryIds: ids })}
        options={categories.map((c) => ({ value: c.id, label: c.name ?? "" }))}
      />
      <Button onClick={handleSubmit} >Save</Button>
    </div>
  );
};