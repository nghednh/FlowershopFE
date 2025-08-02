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
  const [sortInput, setSortInput] = useState<{ field: string; order: 'asc' | 'desc' }>({ field: 'name', order: 'asc' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setSortInput({ field: 'description', order: 'asc' });
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
    .filter((r) => r.description.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (!sortInput.field) return 0;
      const multiplier = sortInput.order === "asc" ? 1 : -1;
      if (sortInput.field === "description") return multiplier * a.description.localeCompare(b.description);
      if (sortInput.field === "multiplier") return multiplier * ((a.priceMultiplier || 0) - (b.priceMultiplier || 0));
      if (sortInput.field === "priority") return multiplier * ((a.priority || 0) - (b.priority || 0));
      return 0;
    });

  console.log("Filtered Rules id:", filteredRules.map(r => r.pricingRuleId));

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
            placeholder="Search by description..."
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
              <option value="description|asc">Description Ascending</option>
              <option value="description|desc">Description Descending</option>
              <option value="multiplier|asc">Multiplier Ascending</option>
              <option value="multiplier|desc">Multiplier Descending</option>
              <option value="priority|asc">Priority Ascending</option>
              <option value="priority|desc">Priority Descending</option>
            </select>
          </div>

        </div>

        {/* {showSort && (
          <div className="mb-4 p-4 border border-gray-300 rounded flex flex-col items-end">
            <div className="flex gap-4">
              <Button onClick={() => handleSort("description")}>Sort by Description</Button>
              <Button onClick={() => handleSort("multiplier")}>Sort by Multiplier</Button>
              <Button onClick={() => handleSort("priority")}>Sort by Priority</Button>
            </div>
          </div>
        )} */}
      </div>
      {filteredRules.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No data found.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('description', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >Description {sortInput.field === 'description' && (sortInput.order === 'asc' ? '↑' : '↓')}</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('multiplier', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >Multiplier {sortInput.field === 'multiplier' && (sortInput.order === 'asc' ? '↑' : '↓')}</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('priority', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >Priority {sortInput.field === 'priority' && (sortInput.order === 'asc' ? '↑' : '↓')}</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRules.map((r) => (
              <tr key={r.pricingRuleId} className="border-b border-gray-300">
                <td className="p-2 border-x border-gray-300">{r.description}</td>
                <td className="p-2 border-x border-gray-300">{r.priceMultiplier}</td>
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
    </div>
  );
};