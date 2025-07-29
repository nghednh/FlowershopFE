import React, { useState } from "react";
import { Button } from "../../Button";
import { ICategory } from "../../../types/backend";

interface CategoryListProps {
  categories: ICategory[];
  onAdd: () => void;
  onEdit: (category: ICategory) => void;
  onDelete: (id: number) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories, onEdit, onDelete, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSort, setShowSort] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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

  const filteredCategories = categories
    .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (!sortField) return 0;
      const multiplier = sortOrder === "asc" ? 1 : -1;
      if (sortField === "name") return multiplier * a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-black font-bold uppercase text-2xl">Categories</h2>
        <Button onClick={onAdd}>Add Category</Button>
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
          <Button onClick={() => handleSort("name")}>Sort by Name</Button>
        </div>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-black font-bold uppercase p-2 border border-gray-300">Name</th>
            <th className="text-black font-bold uppercase p-2 border border-gray-300">Description</th>
            <th className="text-black font-bold uppercase p-2 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((c) => (
            <tr key={c.id} className="border-b border-gray-300">
              <td className="p-2 border-x border-gray-300">{c.name}</td>
              <td className="p-2 border-x border-gray-300">{c.description}</td>
              <td className="p-2 border-x border-gray-300">
                <div className="flex items-center justify-center gap-2">
                  <Button onClick={() => onEdit(c)} className="mr-2">Edit</Button>
                  <Button onClick={() => onDelete(c.id)}>Delete</Button>
                </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};