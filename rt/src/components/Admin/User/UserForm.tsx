import React, { useState } from "react";
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
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      roles: ["Admin"]  ,
    }
  );

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div>
      <h3 className="text-black font-bold uppercase text-lg mb-4">{user ? "Edit" : "Add"} User</h3>
      <Select
        label="Role"
        value={formData.roles[0]}
        onChange={(e) => setFormData({ ...formData, roles: [e.target.value] })}
        options={[{ value: "Admin", label: "Admin" }, { value: "User", label: "User" }]}
        required
      />
      <Button onClick={handleSubmit}>Save</Button>
    </div>
  );
};