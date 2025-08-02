import React, { useEffect, useState } from "react";
import { Button } from "../../Button";
import { ICategory } from "../../../types/backend";
import { getCategories } from "../../../config/api";

interface CategoryListProps {
  onAdd: () => void;
  onEdit: (category: ICategory) => void;
  onDelete: (id: number) => void;
  refreshTrigger?: number;
}

export const CategoryList: React.FC<CategoryListProps> = ({ onAdd, onEdit, onDelete, refreshTrigger }) => {
  const [categories, setCategories] = useState<ICategory[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortInput, setSortInput] = useState<{ field: string; order: 'asc' | 'desc' }>({ field: 'name', order: 'asc' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      console.log("Refresh trigger detected, reloading categories");
      loadCategories();
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

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await onDelete(id);
      setCategories((prev) => prev?.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
      console.error('Error deleting category:', err);
    }
  };

  const filteredCategories = (categories ?? [])
    .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (!sortInput.field) return 0;
      const multiplier = sortInput.order === "asc" ? 1 : -1;
      if (sortInput.field === "name") return multiplier * a.name.localeCompare(b.name);
      if (sortInput.field === "description") return multiplier * (a.description || "").localeCompare(b.description || "");
      return 0;
    });

  console.log("Filtered Categories id:", filteredCategories.map(c => c.id));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-black font-bold uppercase text-2xl">Categories</h2>
        <div className="flex items-center gap-2">
          <Button onClick={onAdd}>Add Category</Button>
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
              <option value="description|asc">Description Ascending</option>
              <option value="description|desc">Description Descending</option>
            </select>
          </div>

        </div>
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading categories...</div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No data found.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('name', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >Name {sortInput.field === 'name' && (sortInput.order === 'asc' ? '↑' : '↓')}</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('description', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >Description {sortInput.field === 'description' && (sortInput.order === 'asc' ? '↑' : '↓')}</th>
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
                    <Button onClick={() => handleDelete(c.id)}>Delete</Button>
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