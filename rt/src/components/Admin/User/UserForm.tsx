import React, { useState } from "react";
import { Input } from "../../Input";
import { Select } from "../../Select";
import { Button } from "../../Button";
import { IUser } from "../../../types/backend";

interface UserFormProps {
  user?: IUser;
  onSave: (data: IUser) => void;
  onClose: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState<IUser>(
    user || {
      firstName: "",
      lastName: "",
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      roleName: "Admin",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  const handleSubmit = () => {
    if (!user && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    onSave({ ...formData, isActive: formData.isActive ?? true, createdAt: user ? formData.createdAt : new Date().toISOString(), updatedAt: new Date().toISOString() });
    onClose();
  };

  return (
    <div>
      <h3 className="text-black font-bold uppercase text-lg mb-4">{user ? "Edit" : "Add"} User</h3>
      <Input
        label="First Name"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        required
      />
      <Input
        label="Last Name"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        required
      />
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <Input
        label="Username"
        value={formData.userName}
        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
        required
      />
      {!user && (
        <>
          <Input
            label="Password"
            type="password"
            value={formData.password || ""}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword || ""}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
        </>
      )}
      <Input
        label="Phone Number"
        value={formData.phoneNumber || ""}
        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
      />
      <Select
        label="Role"
        value={formData.roleName}
        onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
        options={[{ value: "Admin", label: "Admin" }, { value: "User", label: "User" }]}
        required
      />
      <Button onClick={handleSubmit}>Save</Button>
    </div>
  );
};