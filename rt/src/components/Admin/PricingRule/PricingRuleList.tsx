import React, { useEffect, useState } from "react";
import { Button } from "../../Button";
import { IPricingRule } from "../../../types/backend";
import { getPricingRules } from "../../../config/api";

interface PricingRuleListProps {
  onAdd: () => void;
  onEdit: (rule: IPricingRule) => void;
  onDelete: (id: number) => void;
  refreshTrigger?: number;
}

export const PricingRuleList: React.FC<PricingRuleListProps> = ({ onAdd, onEdit, onDelete, refreshTrigger }) => {
  const [rules, setRules] = useState<IPricingRule[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortInput, setSortInput] = useState<{ field: string; order: 'asc' | 'desc' }>({ field: 'id', order: 'asc' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadPricingRules = async () => {
    try {
      setLoading(true);
      setError(null);
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('User not found');
      const user = JSON.parse(userStr);
      if (user.role !== 'Admin') throw new Error('Admin access required');
      const rulesData = await getPricingRules();
      setRules(rulesData.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load pricing rules');
      console.error('Error loading pricing rules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPricingRules();
  }, []);

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      loadPricingRules();
    }
  }, [refreshTrigger]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const handleSortInputChange = (field: string, order: 'asc' | 'desc') => {
    setSortInput({ field, order });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSortInput({ field: 'id', order: 'asc' });
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await onDelete(id);
      setRules((prev) => prev?.filter((r) => r.pricingRuleId !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete pricing rule');
      console.error('Error deleting pricing rule:', err);
    }
  };

  const filteredRules = (rules ?? [])
    .filter((r) => {
      const searchLower = searchTerm.toLowerCase();
      return r.description.toLowerCase().includes(searchLower) ||
             (r.specialDay && r.specialDay.toLowerCase().includes(searchLower)) ||
             r.pricingRuleId.toString().includes(searchLower);
    })
    .sort((a, b) => {
      if (!sortInput.field) return 0;
      const multiplier = sortInput.order === "asc" ? 1 : -1;
      if (sortInput.field === "description") return multiplier * a.description.localeCompare(b.description);
      if (sortInput.field === "multiplier") return multiplier * ((a.priceMultiplier || 0) - (b.priceMultiplier || 0));
      if (sortInput.field === "priority") return multiplier * ((a.priority || 0) - (b.priority || 0));
      if (sortInput.field === "id") return multiplier * (a.pricingRuleId - b.pricingRuleId);
      if (sortInput.field === "specialDay") return multiplier * (a.specialDay || "").localeCompare(b.specialDay || "");
      if (sortInput.field === "startDate") return multiplier * (new Date(a.startDate || 0).getTime() - new Date(b.startDate || 0).getTime());
      if (sortInput.field === "endDate") return multiplier * (new Date(a.endDate || 0).getTime() - new Date(b.endDate || 0).getTime());
      if (sortInput.field === "fixedPrice") return multiplier * ((a.fixedPrice || 0) - (b.fixedPrice || 0));
      return 0;
    });

  console.log("Filtered Rules id:", filteredRules.map(r => r.pricingRuleId));

  // Pagination calculations
  const totalItems = filteredRules.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRules = filteredRules.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getVisiblePages = () => {
    const visiblePages: number[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        visiblePages.push(i);
      }
    }
    
    return visiblePages;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-black font-bold uppercase text-2xl">Pricing Rules</h2>
        <div className="flex items-center gap-2">
          <Button onClick={onAdd}>Add Pricing Rule</Button>
          <Button onClick={resetFilters}>Reset</Button>
        </div>
      </div>
      <div className="flex flex-col mb-4 p-4 bg-gray-50 gap-2 rounded">

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by description, special day, or ID..."
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 p-2 rounded text-sm flex-1"
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
              <option value="id|asc">ID Ascending</option>
              <option value="id|desc">ID Descending</option>
              <option value="description|asc">Description Ascending</option>
              <option value="description|desc">Description Descending</option>
              <option value="specialDay|asc">Special Day Ascending</option>
              <option value="specialDay|desc">Special Day Descending</option>
              <option value="startDate|asc">Start Date Ascending</option>
              <option value="startDate|desc">Start Date Descending</option>
              <option value="endDate|asc">End Date Ascending</option>
              <option value="endDate|desc">End Date Descending</option>
              <option value="multiplier|asc">Multiplier Ascending</option>
              <option value="multiplier|desc">Multiplier Descending</option>
              <option value="fixedPrice|asc">Fixed Price Ascending</option>
              <option value="fixedPrice|desc">Fixed Price Descending</option>
              <option value="priority|asc">Priority Ascending</option>
              <option value="priority|desc">Priority Descending</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-gray-300 p-2 rounded text-sm"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>

        </div>
      </div>
      {loading && (
        <div className="text-center text-gray-500 py-8">Loading pricing rules...</div>
      )}
      {error && (
        <div className="text-center text-red-500 py-4 bg-red-50 border border-red-200 rounded mb-4">
          Error: {error}
        </div>
      )}
      {!loading && !error && paginatedRules.length === 0 && filteredRules.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No data found.</div>
      ) : !loading && !error && (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('id', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >ID {sortInput.field === 'id' && (sortInput.order === 'asc' ? '↑' : '↓')}</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('description', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >Description {sortInput.field === 'description' && (sortInput.order === 'asc' ? '↑' : '↓')}</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('specialDay', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >Special Day {sortInput.field === 'specialDay' && (sortInput.order === 'asc' ? '↑' : '↓')}</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('startDate', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >Start Date {sortInput.field === 'startDate' && (sortInput.order === 'asc' ? '↑' : '↓')}</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('endDate', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >End Date {sortInput.field === 'endDate' && (sortInput.order === 'asc' ? '↑' : '↓')}</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('multiplier', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >Multiplier {sortInput.field === 'multiplier' && (sortInput.order === 'asc' ? '↑' : '↓')}</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('fixedPrice', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >Fixed Price {sortInput.field === 'fixedPrice' && (sortInput.order === 'asc' ? '↑' : '↓')}</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('priority', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >Priority {sortInput.field === 'priority' && (sortInput.order === 'asc' ? '↑' : '↓')}</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRules.map((r) => (
              <tr key={r.pricingRuleId} className="border-b border-gray-300">
                <td className="p-2 border-x border-gray-300">{r.pricingRuleId}</td>
                <td className="p-2 border-x border-gray-300 max-w-48 truncate" title={r.description}>{r.description}</td>
                <td className="p-2 border-x border-gray-300">
                  {r.specialDay || 'N/A'}
                </td>
                <td className="p-2 border-x border-gray-300">
                  {r.startDate ? new Date(r.startDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-2 border-x border-gray-300">
                  {r.endDate ? new Date(r.endDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-2 border-x border-gray-300">
                  {r.priceMultiplier ? `${r.priceMultiplier}x` : 'N/A'}
                </td>
                <td className="p-2 border-x border-gray-300">
                  {r.fixedPrice ? `$${r.fixedPrice.toFixed(2)}` : 'N/A'}
                </td>
                <td className="p-2 border-x border-gray-300">{r.priority}</td>
                <td className="p-2 border-x border-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <Button onClick={() => onEdit(r)} className="mr-2">Edit</Button>
                    <Button onClick={() => handleDelete(r.pricingRuleId)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      {!loading && !error && filteredRules.length > 0 && (
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