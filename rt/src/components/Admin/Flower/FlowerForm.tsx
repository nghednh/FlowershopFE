import React, { useState } from "react";
import { Input } from "../../Input";
import { Select } from "../../Select";
import { MultiSelect } from "../../MultiSelect";
import { Button } from "../../Button";
import { MultiImageUpload } from "../../MultiImageUpload";
import { ICategory, IProduct } from "../../../types/backend";
import { createProduct, updateProduct } from "../../../config/api";

const isNameAZ = (name: string) => /^[a-zA-Z0-9 ]+$/.test(name);
const isValidPrice = (price: number) => price >= 0;
const isValidStock = (stock: number) => stock >= 0;
const isValidCategoryIds = (ids: number[]) => ids.length > 0;

interface FlowerFormProps {
  flower?: IProduct;
  onSave: (flower: IProduct) => void;
  categories: ICategory[];
  onClose: () => void;

}

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
      imagesUrls: [],
      categories: [],
    }
  );

  console.log("FlowerForm initial data:", formData);
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleImageUpload = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleSubmit = async () => {
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
    if (!isValidCategoryIds(formData.categories.map(c => c.id))) {
      alert("Please select at least one category.");
      return;
    }
    if (selectedFiles.length === 0) {
      alert("Please upload at least one image for the flower.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('flowerStatus', formData.flowerStatus.toString());
    formDataToSend.append('description', formData.description || '');
    formDataToSend.append('basePrice', formData.basePrice.toString());
    formDataToSend.append('condition', formData.condition || '');
    formDataToSend.append('stockQuantity', formData.stockQuantity.toString());
    formDataToSend.append('isActive', (formData.isActive ?? true).toString());
    selectedFiles.forEach(file => {
      formDataToSend.append('images', file);
    });
    formData.categories.forEach(category => {
      formDataToSend.append('categoryIds', category.id.toString());
    });

    console.log('FormData contents:', [...formDataToSend.entries()]);

    if (flower === null) {
    createProduct(formDataToSend)
      .then(response => {
        onSave(response.data);
        console.log("Product saved successfully:", response);
        onClose();
      })
      .catch(error => {
        alert('Error saving product: ' + (error.message || 'Unknown error'));
        console.error("Response status:", error.response?.status);
        console.error("Response data:", error.response?.data);
        console.error("Request data:", error.config?.data);
      });
    } else if (flower) {
      // Update existing flower
      updateProduct(flower.id, formDataToSend)
        .then(response => {
          onSave(response.data);
          console.log("Product updated successfully:", response);
          onClose();
        })
        .catch(error => {
          alert('Error updating product: ' + (error.message || 'Unknown error'));
          console.error("Response status:", error.response?.status);
          console.error("Response data:", error.response?.data);
          console.error("Request data:", error.config?.data);
        });
    }
  };

  return (
    <div className="space-y-4">
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
      <div className="mb-4">
        <label className="text-black font-bold uppercase block mb-2">Images *</label>
        <MultiImageUpload
          onImagesChange={handleImageUpload}
          initialImages={formData.imagesUrls ? formData.imagesUrls : []}
          required
        />
        {selectedFiles.length > 0 && (
          <div className="mt-2 text-sm text-green-600">
            {selectedFiles.length} image(s) selected
          </div>
        )}
      </div>
      <MultiSelect
        label="Categories"
        value={formData.categories.map(c => c.id)}
        onChange={(ids) => {
          const selectedCategories = categories.filter(c => ids.includes(c.id));
          setFormData({ ...formData, categories: selectedCategories });
        }}
        options={categories.map((c) => ({ value: c.id, label: c.name ?? "" }))}
      />
      <Button onClick={handleSubmit}>Save</Button>
    </div>
  );
};

