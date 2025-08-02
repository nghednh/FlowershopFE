import React, { useState } from "react";
import { Button } from "../../Button";
import { IPricingRule } from "../../../types/backend";

interface PricingRuleListProps {
  rules: IPricingRule[];
  onAdd: () => void;
  onEdit: (rule: IPricingRule) => void;
  onDelete: (id: number) => void;
}

export const PricingRuleList: React.FC<PricingRuleListProps> = ({ rules, onAdd, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSort, setShowSort] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  console.log("Current Rules:", rules);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSortField(null);
    setSortOrder("asc");
  };

  const filteredRules = rules
    .filter((r) => r.description.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (!sortField) return 0;
      const multiplier = sortOrder === "asc" ? 1 : -1;
      if (sortField === "description") return multiplier * a.description.localeCompare(b.description);
      if (sortField === "multiplier") return multiplier * ((a.priceMultiplier || 0) - (b.priceMultiplier || 0));
      if (sortField === "priority") return multiplier * ((a.priority || 0) - (b.priority || 0));
      return 0;
    });

    console.log("Filtered Rules id:", filteredRules.map(r => r.pricingRuleId));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-black font-bold uppercase text-2xl">Pricing Rules</h2>
        <Button onClick={onAdd}>Add Pricing Rule</Button>
      </div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by description..."
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
            <Button onClick={() => handleSort("description")}>Sort by Description</Button>
            <Button onClick={() => handleSort("multiplier")}>Sort by Multiplier</Button>
            <Button onClick={() => handleSort("priority")}>Sort by Priority</Button>
          </div>
        </div>
      )}
      {filteredRules.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No data found.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-black font-bold uppercase p-2 border border-gray-300">Description</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300">Multiplier</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300">Priority</th>
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
                    <Button onClick={() => onDelete(r.pricingRuleId)}>Delete</Button>
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