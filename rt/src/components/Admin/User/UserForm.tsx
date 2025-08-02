import React, { useState } from "react";
import { Select } from "../../Select";
import { Button } from "../../Button";
import { IUser } from "../../../types/backend";
import { updateUserRole } from "../../../config/api";

interface UserFormProps {
  user?: IUser;
  onSave: (data: IUser) => void;
  onClose: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState<IUser>(
    user || {
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      roles: ["User"],
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user || user.id === 0) {
      } else {
        // Update existing user role
        const response = await updateUserRole(user.id.toString(), formData.roles);
        onSave(response.data);
        console.log("User updated successfully:", response);
      }

      onClose();
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'Failed to save user');
      console.error("Error saving user:", error);
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      console.error("Request data:", error.config?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-black font-bold uppercase text-lg mb-4">{user ? "Edit" : "Add"} User</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Select
        label="Role"
        value={formData.roles[0]}
        onChange={(e) => setFormData({ ...formData, roles: [e.target.value] })}
        options={[{ value: "Admin", label: "Admin" }, { value: "User", label: "User" }]}
        required
      />

      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};