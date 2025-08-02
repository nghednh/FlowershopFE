import React, { useEffect, useState } from "react";
import { Button } from "../../Button";
import { IUser } from "../../../types/backend";
import { getUsers } from "../../../config/api";

interface UserListProps {
  onEdit: (user: IUser) => void;
  refreshTrigger?: number;
}

export const UserList: React.FC<UserListProps> = ({ onEdit, refreshTrigger }) => {
  const [users, setUsers] = useState<IUser[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortInput, setSortInput] = useState<{ field: string; order: 'asc' | 'desc' }>({ field: 'name', order: 'asc' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      loadUsers();
    }
  }, [refreshTrigger]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const handleSortInputChange = (field: string, order: 'asc' | 'desc') => {
    setSortInput({ field, order });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSortInput({ field: 'name', order: 'asc' });
  };

  const filteredUsers = (users ?? [])
    .filter((u) => `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (!sortInput.field) return 0;
      const multiplier = sortInput.order === "asc" ? 1 : -1;
      if (sortInput.field === "name") return multiplier * `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      if (sortInput.field === "email") return multiplier * a.email.localeCompare(b.email);
      if (sortInput.field === "role") return multiplier * a.roles[0].localeCompare(b.roles[0]);
      return 0;
    });

  console.log("Filtered Users id:", filteredUsers.map(u => u.userName));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-black font-bold uppercase text-2xl">Users</h2>
        <div className="flex items-center gap-2">
          {/* <Button onClick={onAdd}>Add User</Button> */}
          <Button onClick={resetFilters}>Reset</Button>
        </div>
      </div>
      <div className="flex flex-col mb-4 p-4 bg-gray-50 gap-2 rounded">

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 p-2 rounded text-sm"
          />

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortInput.field || ""}
              onChange={(e) => {
                const [field, order] = e.target.value.split('|');
                handleSortInputChange(field, order as 'asc' | 'desc');
              }}
              className="border border-gray-300 p-2 rounded text-sm"
            >
              <option value="name|asc">Name Ascending</option>
              <option value="name|desc">Name Descending</option>
              <option value="email|asc">Email Ascending</option>
              <option value="email|desc">Email Descending</option>
              <option value="role|asc">Role Ascending</option>
              <option value="role|desc">Role Descending</option>
            </select>
          </div>

        </div>

      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {loading && <div className="text-center text-gray-500 py-8">Loading...</div>}
      {filteredUsers.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No data found.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('name', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >Name {sortInput.field === 'name' && (sortInput.order === 'asc' ? '↑' : '↓')}</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('email', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >Email {sortInput.field === 'email' && (sortInput.order === 'asc' ? '↑' : '↓')}</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('role', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >Role {sortInput.field === 'role' && (sortInput.order === 'asc' ? '↑' : '↓')}</th>
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