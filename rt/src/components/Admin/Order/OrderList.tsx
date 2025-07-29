import React, { useState } from "react";
import { Button } from "../../Button";
import { IOrder } from "../../../types/backend";

interface OrderListProps {
  orders: IOrder[];
  onAdd: () => void;
  onEdit: (order: IOrder) => void;
  onDelete: (id: number) => void;
}

export const OrderList: React.FC<OrderListProps> = ({ orders, onEdit, onDelete, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSort, setShowSort] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [statusFilters, setStatusFilters] = useState<{ [key: string]: boolean }>({
    Completed: false,
    Pending: false,
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
    setStatusFilters({ Completed: false, Pending: false });
  };

  const filteredOrders = orders
    .filter((o) => o.id.toString().includes(searchTerm))
    .filter((o) => {
      if (Object.values(statusFilters).every((v) => !v)) return true;
      return statusFilters[o.status];
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const multiplier = sortOrder === "asc" ? 1 : -1;
      if (sortField === "id") return multiplier * (a.id - b.id);
      if (sortField === "status") return multiplier * a.status.localeCompare(b.status);
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
          placeholder="Search by ID..."
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
            <Button onClick={() => handleSort("id")}>Sort by ID</Button>
          </div>
          <div className="mt-2">
            {["Completed", "Pending"].map((status) => (
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
      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No data found.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-black font-bold uppercase p-2 border border-gray-300">ID</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300">Status</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300">Delivery Info</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o.id} className="border-b border-gray-300">
                <td className="p-2 border-x border-gray-300">{o.id}</td>
                <td className="p-2 border-x border-gray-300">{o.status}</td>
                <td className="p-2 border-x border-gray-300">{/* o.deliveryInfo */}</td>
                <td className="p-2 border-x border-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <Button onClick={() => onEdit(o)} className="mr-2">Edit</Button>
                    <Button onClick={() => onDelete(o.id)}>Delete</Button>
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