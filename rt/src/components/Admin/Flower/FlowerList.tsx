import React, { useState } from "react";
import { Button } from "../../Button";
import { IProduct } from "../../../types/backend";

interface FlowerListProps {
  products: IProduct[];
  onAdd: () => void;
  onEdit: (product: IProduct) => void;
  onDelete: (id: number) => void;
}

export const FlowerList: React.FC<FlowerListProps> = ({ products, onAdd, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSort, setShowSort] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [statusFilters, setStatusFilters] = useState<{ [key: string]: boolean }>({
    New: false,
    Old: false,
    "Low Stock": false,
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

  const handleStatusFilter = (status: string) => {
    setStatusFilters((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSortField(null);
    setSortOrder("asc");
    setStatusFilters({ New: false, Old: false, "Low Stock": false });
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((p) => {
      if (Object.values(statusFilters).every((v) => !v)) return true;
      return statusFilters[["New", "Old", "Low Stock"][p.flowerStatus]];
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const multiplier = sortOrder === "asc" ? 1 : -1;
      if (sortField === "name") return multiplier * a.name.localeCompare(b.name);
      if (sortField === "status") return multiplier * a.flowerStatus - b.flowerStatus;
      if (sortField === "price") return multiplier * (a.basePrice - b.basePrice);
      if (sortField === "stock") return multiplier * (a.stockQuantity - b.stockQuantity);
      return 0;
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-black font-bold uppercase text-2xl">Flower Products</h2>
        <Button onClick={onAdd}>Add Flower</Button>
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
            <Button onClick={() => handleSort("price")}>Sort by Price</Button>
            <Button onClick={() => handleSort("stock")}>Sort by Stock</Button>
          </div>
          <div className="mt-2">
            {["New", "Old", "Low Stock"].map((status) => (
                <label key={status} className="mr-4" style={{ fontSize: "18px" }}>
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={statusFilters[status]}
                  onChange={() => handleStatusFilter(status)}
                />
                {status}
                </label>
            ))}
          </div>
        </div>
      )}
      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No data found.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
        <tr className="bg-gray-100">
          <th className="text-black font-bold uppercase p-2 border border-gray-300">Name</th>
          <th className="text-black font-bold uppercase p-2 border border-gray-300">Status</th>
          <th className="text-black font-bold uppercase p-2 border border-gray-300">Price</th>
          <th className="text-black font-bold uppercase p-2 border border-gray-300">Stock</th>
          <th className="text-black font-bold uppercase p-2 border border-gray-300">Actions</th>
        </tr>
          </thead>
          <tbody>
        {filteredProducts.map((p) => (
          <tr key={p.id} className="border-b border-gray-300">
            <td className="p-2 border-x border-gray-300">{p.name}</td>
            <td className="p-2 border-x border-gray-300">{["New", "Old", "Low Stock"][p.flowerStatus]}</td>
            <td className="p-2 border-x border-gray-300">${p.basePrice}</td>
            <td className="p-2 border-x border-gray-300">{p.stockQuantity}</td>
            <td className="p-2 border-x border-gray-300">
          <div className="flex items-center justify-center gap-2">
            <Button onClick={() => onEdit(p)} className="mr-2">Edit</Button>
            <Button onClick={() => onDelete(p.id)}>Delete</Button>
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
