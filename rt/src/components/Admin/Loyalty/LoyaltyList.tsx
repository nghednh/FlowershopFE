import React, { useEffect, useState } from "react";
import { Button } from "../../Button";
import { IUserSummaryLoyalty } from "../../../types/backend";
import { getAllUsersLoyaltyInfo } from "../../../config/api";

interface LoyaltyListProps {
  onEdit: (user: IUserSummaryLoyalty) => void;
  refreshTrigger?: number;
}

export const LoyaltyList: React.FC<LoyaltyListProps> = ({ onEdit, refreshTrigger }) => {
  const [users, setUsers] = useState<IUserSummaryLoyalty[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortInput, setSortInput] = useState<{ field: string; order: 'asc' | 'desc' }>({ field: 'userName', order: 'asc' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLoyaltyUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUsersLoyaltyInfo();
      console.log("Loyalty Users Response:", response);
      // Since API now returns { users: IUserSummaryLoyalty[] } directly
      if (Array.isArray(response)) {
        setUsers(response);
      } else {
        setUsers(response.users || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load loyalty data');
      console.error('Error loading loyalty data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoyaltyUsers();
  }, []);

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      loadLoyaltyUsers();
    }
  }, [refreshTrigger]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const handleSortInputChange = (field: string, order: 'asc' | 'desc') => {
    setSortInput({ field, order });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSortInput({ field: 'userName', order: 'asc' });
  };

  const filteredUsers = users
    .filter((u) => 
      u.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortInput.field) return 0;
      const multiplier = sortInput.order === "asc" ? 1 : -1;
      if (sortInput.field === "userName") return multiplier * a.userName.localeCompare(b.userName);
      if (sortInput.field === "email") return multiplier * a.email.localeCompare(b.email);
      if (sortInput.field === "loyaltyPoints") return multiplier * (a.loyaltyPoints - b.loyaltyPoints);
      return 0;
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-black font-bold uppercase text-2xl">User Loyalty Points</h2>
        <div className="flex items-center gap-2">
          <Button onClick={resetFilters}>Reset</Button>
        </div>
      </div>
      
      <div className="flex flex-col mb-4 p-4 bg-gray-50 gap-2 rounded">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 p-2 rounded text-sm"
          />

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={`${sortInput.field}|${sortInput.order}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('|');
                handleSortInputChange(field, order as 'asc' | 'desc');
              }}
              className="border border-gray-300 p-2 rounded text-sm"
            >
              <option value="userName|asc">Username (A-Z)</option>
              <option value="userName|desc">Username (Z-A)</option>
              <option value="email|asc">Email (A-Z)</option>
              <option value="email|desc">Email (Z-A)</option>
              <option value="loyaltyPoints|desc">Loyalty Points (High to Low)</option>
              <option value="loyaltyPoints|asc">Loyalty Points (Low to High)</option>
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
        <div className="text-center text-gray-500 py-8">No users found.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('userName', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >
                Username {sortInput.field === 'userName' && (sortInput.order === 'asc' ? '↑' : '↓')}
              </th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('email', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >
                Email {sortInput.field === 'email' && (sortInput.order === 'asc' ? '↑' : '↓')}
              </th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('loyaltyPoints', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >
                Loyalty Points {sortInput.field === 'loyaltyPoints' && (sortInput.order === 'asc' ? '↑' : '↓')}
              </th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-300">
                <td className="p-2 border-x border-gray-300">{user.userName}</td>
                <td className="p-2 border-x border-gray-300">{user.email}</td>
                <td className="p-2 border-x border-gray-300 text-center font-semibold text-green-600">
                  {user.loyaltyPoints}
                </td>
                <td className="p-2 border-x border-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <Button onClick={() => onEdit(user)} className="mr-2">Edit Points</Button>
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
