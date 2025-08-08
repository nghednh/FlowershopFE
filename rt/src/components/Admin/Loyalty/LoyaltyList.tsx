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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadLoyaltyUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUsersLoyaltyInfo();
      console.log("Loyalty Users Response:", response);
      
      // Handle the response structure properly
      if (Array.isArray(response)) {
        setUsers(response);
      } else if (response && response.users) {
        setUsers(response.users);
      } else {
        console.warn("Unexpected response structure:", response);
        setUsers([]);
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
    setCurrentPage(1);
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

  // Pagination calculations
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisiblePages = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }
    
    return visiblePages;
  };

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

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 p-2 rounded text-sm"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
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
              <th className="text-black font-bold uppercase p-2 border border-gray-300 w-30">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-300">
                <td className="p-2 border-x border-gray-300">{user.userName}</td>
                <td className="p-2 border-x border-gray-300">{user.email}</td>
                <td className="p-2 border-x border-gray-300 text-center font-semibold text-green-600">
                  {user.loyaltyPoints}
                </td>
                <td className="p-2 border-x border-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <Button onClick={() => onEdit(user)} className="mr-2">Edit</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      {filteredUsers.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
          </div>
          
          <div className="flex items-center gap-2">
            {/* First Page Button */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              First
            </button>

            {/* Previous Page Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {getVisiblePages().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${
                  page === currentPage
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next Page Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>

            {/* Last Page Button */}
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
