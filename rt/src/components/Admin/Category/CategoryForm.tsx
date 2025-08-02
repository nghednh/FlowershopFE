import React, { useState } from "react";
import { Input } from "../../Input";
import { Button } from "../../Button";
import { ICategory } from "../../../types/backend";

interface CategoryFormProps {
  category?: ICategory;
  onSave: (data: ICategory) => void;
  onClose: () => void;
}

const isNameAZ = (name: string) => /^[a-zA-Z0-9 ]+$/.test(name);

export const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onClose }) => {
  const [formData, setFormData] = useState<ICategory>(category || { id: 0, name: "", description: "" });

  const isFormValid = formData.name.trim() !== "";

  const handleSubmit = () => {
    if (!isFormValid) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    if (!isNameAZ(formData.name)) {
      alert("Name must contain only letters A-Z, numbers, and spaces.");
      return;
    }
    onSave({ ...formData, id: category?.id || Date.now() });
    onClose();
  };

  return (
    <div>
      <h3 className="text-black font-bold uppercase text-lg mb-4">{category ? "Edit" : "Add"} Category</h3>
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <Input
        label="Description"
        value={formData.description || ""}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <Button onClick={handleSubmit} >Save</Button>
    </div>
  );
};