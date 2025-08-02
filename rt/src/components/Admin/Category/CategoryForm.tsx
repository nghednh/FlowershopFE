import React, { useState } from "react";
import { Input } from "../../Input";
import { Button } from "../../Button";
import { ICategory } from "../../../types/backend";
import { createCategory, updateCategory } from "../../../config/api";

interface CategoryFormProps {
  category?: ICategory;
  onSave: (data: ICategory) => void;
  onClose: () => void;
}

const isNameAZ = (name: string) => /^[a-zA-Z0-9 ]+$/.test(name);

export const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onClose }) => {
  const [formData, setFormData] = useState<ICategory>(
    category || {
      id: 0,
      name: "",
      description: "",
    }
  );

  const [validationError, setValidationError] = useState<string>("");

  // Validate required fields and constraints
  const validateForm = (): boolean => {
    const { name, description } = formData;

    // Name validation
    if (!name || name.trim() === "") {
      setValidationError("Name is required");
      return false;
    }

    if (!isNameAZ(name)) {
      setValidationError("Name must contain only letters A-Z, numbers, and spaces.");
      return false;
    }

    // Description validation (optional but must be valid if provided)
    if (description && !isNameAZ(description)) {
      setValidationError("Description must contain only letters A-Z, numbers, and spaces.");
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
      const categoryData = {
        ...formData,
        id: category?.id || 0
      };

      if (!category || category.id === 0) {
        createCategory(categoryData)
          .then(response => {
            onSave(response);
            console.log("Category created successfully:", response);
            onClose();
          })
          .catch(error => {
            alert('Error creating category: ' + (error.message || 'Unknown error'));
            console.error("Response status:", error.response?.status);
            console.error("Response data:", error.response?.data);
            console.error("Request data:", error.config?.data);
          });
      } else {
        updateCategory(category.id, categoryData)
          .then(response => {
            onSave(response);
            console.log("Category updated successfully:", response);
          })
          .catch(error => {
            alert('Error updating category: ' + (error.message || 'Unknown error'));
            console.error("Response status:", error.response?.status);
            console.error("Response data:", error.response?.data);
            console.error("Request data:", error.config?.data);
          });
      }

      onClose();
    } catch (error: any) {
      setValidationError(error.response?.data?.message || error.message || 'Failed to save category');
      console.error("Error saving category:", error);
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      console.error("Request data:", error.config?.data);
    }
  };

  return (
    <div>
      <h3 className="text-black font-bold uppercase text-lg mb-4">{category ? "Edit" : "Add"} Category</h3>

      {validationError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {validationError}
        </div>
      )}

      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => {
          setFormData({ ...formData, name: e.target.value });
          setTimeout(() => validateAll(), 0);
        }}
        required
      />
      <Input
        label="Description"
        value={formData.description || ""}
        onChange={(e) => {
          setFormData({ ...formData, description: e.target.value });
          setTimeout(() => validateAll(), 0);
        }}
      />
      <div className="flex justify-center">
        <Button
          disabled={!!validationError}
          className={validationError ? "opacity-50 cursor-not-allowed" : ""}
          onClick={handleSubmit}
        >Save</Button>
      </div>
    </div>
  );
};