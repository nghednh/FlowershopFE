import React, { useState } from "react";
import { Button } from "../../Button";
import { IUser } from "../../../types/backend";

interface UserListProps {
  users: IUser[];
  onEdit: (user: IUser) => void;
}

export const UserList: React.FC<UserListProps> = ({ users, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSort, setShowSort] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [roleFilters, setRoleFilters] = useState<{ [key: string]: boolean }>({
    admin: false,
    user: false,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilters((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSortField(null);
    setSortOrder("asc");
    setRoleFilters({ admin: false, user: false });
  };

  const filteredUsers = users
    .filter((u) => `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((u) => {
      if (Object.values(roleFilters).every((v) => !v)) return true;
      return roleFilters[u.roles[0]];
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const multiplier = sortOrder === "asc" ? 1 : -1;
      if (sortField === "name") return multiplier * `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      if (sortField === "role") return multiplier * a.roles[0].localeCompare(b.roles[0]);
      return 0;
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-black font-bold uppercase text-2xl">User List</h2>
      </div>

      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 p-2 rounded w-1/2"
        />
        <div className="flex gap-2">
          <Button onClick={() => setShowSort(!showSort)}>Sort</Button>
          <Button onClick={resetFilters}>Reset</Button>
        </div>
      </div>
      {showSort && (
        <div className="mb-4 p-4 border border-gray-300 rounded flex flex-col items-end">
          <div className="flex gap-4">
            <Button onClick={() => handleSort("name")}>Sort by Name</Button>
          </div>
          <div className="mt-2">
            {["admin", "user"].map((role) => (
              <label key={role} className="mr-4" style={{ fontSize: "18px" }}>
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={roleFilters[role]}
                  onChange={() => handleRoleFilter(role)}
                />
                {role}
              </label>
            ))}
          </div>
        </div>
      )}
      {filteredUsers.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No data found.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-black font-bold uppercase p-2 border border-gray-300">Name</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300">Email</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300">Role</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.userName} className="border-b border-gray-300">
                <td className="p-2 border-x border-gray-300">{u.firstName} {u.lastName}</td>
                <td className="p-2 border-x border-gray-300">{u.email}</td>
                <td className="p-2 border-x border-gray-300">{u.roles[0]}</td>
                <td className="p-2 border-x border-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <Button onClick={() => onEdit(u)} className="mr-2">Edit</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};