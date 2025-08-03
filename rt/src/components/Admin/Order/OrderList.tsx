import React, { useEffect, useState } from "react";
import { Button } from "../../Button";
import { IOrder } from "../../../types/backend";
import { getOrders } from "../../../config/api";

export enum OrderStatus {
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
}

interface OrderListProps {
  onEdit: (order: IOrder) => void;
  onDelete: (id: number) => void;
  refreshTrigger?: number;
}

export const OrderList: React.FC<OrderListProps> = ({ onEdit, onDelete, refreshTrigger }) => {
  const [orders, setOrders] = useState<IOrder[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortInput, setSortInput] = useState<{ field: string; order: 'asc' | 'desc' }>({ field: 'id', order: 'desc' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const ordersData = await getOrders();
      console.log("Fetched orders:", ordersData);
      setOrders(ordersData);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      loadOrders();
    }
  }, [refreshTrigger]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const handleSortInputChange = (field: string, order: 'asc' | 'desc') => {
    setSortInput({ field, order });
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as OrderStatus | "");
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSortInput({ field: 'id', order: 'desc' });
    setStatusFilter("");
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await onDelete(id);
      setOrders((prev) => prev?.filter((o) => o.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete order');
      console.error('Error deleting order:', err);
    }
  };

  const filteredOrders = (orders ?? [])
    .filter((o) => {
      const matchesSearch = o.id.toString().includes(searchTerm) ||
        OrderStatus[o.orderStatus].toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || OrderStatus[o.orderStatus] === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortInput.field) return 0;
      const multiplier = sortInput.order === "asc" ? 1 : -1;
      if (sortInput.field === "id") return multiplier * (a.id - b.id);
      if (sortInput.field === "orderStatus") return multiplier * a.orderStatus.localeCompare(b.orderStatus);
      if (sortInput.field === "sum") return multiplier * (a.sum - b.sum);
      if (sortInput.field === "createdAt") return multiplier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      return 0;
    });

  console.log("Filtered Orders id:", filteredOrders.map(o => o.id));

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Delivered: return 'text-green-600';
      case OrderStatus.Shipped: return 'text-blue-600';
      case OrderStatus.Processing: return 'text-yellow-600';
      case OrderStatus.Pending: return 'text-orange-600';
      case OrderStatus.Cancelled: return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-black font-bold uppercase text-2xl">Orders</h2>
        <div className="flex items-center gap-2">
          <Button onClick={resetFilters}>Reset</Button>
        </div>
      </div>
      <div className="flex flex-col mb-4 p-4 bg-gray-50 gap-2 rounded">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by ID or status or tracking number"
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 p-2 rounded text-sm"
          />

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="border border-gray-300 p-2 rounded text-sm"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortInput.field + '|' + sortInput.order}
              onChange={(e) => {
                const [field, order] = e.target.value.split('|');
                handleSortInputChange(field, order as 'asc' | 'desc');
              }}
              className="border border-gray-300 p-2 rounded text-sm"
            >
              <option value="id|desc">ID Descending</option>
              <option value="id|asc">ID Ascending</option>
              <option value="sum|asc">Amount Ascending</option>
              <option value="sum|desc">Amount Descending</option>
              <option value="createdAt|desc">Date Descending</option>
              <option value="createdAt|asc">Date Ascending</option>
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
        <div className="text-center text-gray-500 py-8">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No data found.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('id', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >Order ID {sortInput.field === 'id' && (sortInput.order === 'asc' ? '↑' : '↓')}</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
              >Status {sortInput.field === 'orderStatus'}</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('sum', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >Total Amount {sortInput.field === 'sum' && (sortInput.order === 'asc' ? '↑' : '↓')}</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortInputChange('createdAt', sortInput.order === 'asc' ? 'desc' : 'asc')}
              >Order Date {sortInput.field === 'createdAt' && (sortInput.order === 'asc' ? '↑' : '↓')}</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300">Tracking Number</th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o.id} className="border-b border-gray-300">
                <td className="p-2 border-x border-gray-300 font-medium">{o.id}</td>
                <td className={`p-2 border-x border-gray-300 font-semibold ${getStatusColor(o.orderStatus)}`}>
                  {OrderStatus[o.orderStatus]}
                </td>
                <td className="p-2 border-x border-gray-300">${o.sum}</td>
                <td className="p-2 border-x border-gray-300">{formatDate(o.createdAt)}</td>
                <td className="p-2 border-x border-gray-300">{o.trackingNumber}</td>
                <td className="p-2 border-x border-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <Button onClick={() => onEdit(o)} className="mr-2">Edit</Button>
                    <Button onClick={() => handleDelete(o.id)}>Delete</Button>
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