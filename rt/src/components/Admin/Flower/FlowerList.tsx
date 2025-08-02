import React, { useEffect } from "react";
import { Button } from "../../Button";
import { IProduct } from "../../../types/backend";

interface FlowerListProps {
  products: IProduct[];
  onAdd: () => void;
  onEdit: (product: IProduct) => void;
  onDelete: (id: number) => void;
  totalProducts?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  currentPage?: number;
  pageSize?: number;
  onFilterChange?: (search: string, filters: { [key: string]: boolean }) => void;
  searchTerm?: string;
  statusFilters?: { [key: string]: boolean };
}

export const FlowerList: React.FC<FlowerListProps> = ({
  products,
  onAdd,
  onEdit,
  onDelete,
  totalProducts = 0,
  onPageChange,
  currentPage: propCurrentPage = 1,
  pageSize: propPageSize = 20,
  onFilterChange,
  searchTerm: propSearchTerm = "",
  statusFilters: propStatusFilters = { New: false, Old: false, "Low Stock": false },
}) => {
  const [searchTerm, setSearchTerm] = React.useState(propSearchTerm);
  const [showSort, setShowSort] = React.useState(false);
  const [sortField, setSortField] = React.useState<string | null>(null);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const [statusFilters, setStatusFilters] = React.useState(propStatusFilters);

  const currentPage = propCurrentPage;
  const pageSize = propPageSize;
  const pageSizeOptions = [10, 20, 50, 100];

  useEffect(() => {
    setSearchTerm(propSearchTerm);
    setStatusFilters(propStatusFilters);
  }, [propSearchTerm, propStatusFilters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    if (onFilterChange) {
      onFilterChange(newSearchTerm, statusFilters);
    }
  };

  const handleSort = (field: string) => {
    const newSortOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
    if (onFilterChange) {
      onFilterChange(searchTerm, statusFilters);
    }
  };

  const handleStatusFilter = (status: string) => {
    const newFilters = { ...statusFilters, [status]: !statusFilters[status] };
    setStatusFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(searchTerm, newFilters);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSortField(null);
    setSortOrder("asc");
    setStatusFilters({ New: false, Old: false, "Low Stock": false });
    if (onFilterChange) {
      onFilterChange("", { New: false, Old: false, "Low Stock": false });
    }
  };

  const handlePageChange = (page: number, newPageSize?: number) => {
    const actualPageSize = newPageSize || pageSize;
    const validPage = Math.max(1, Math.min(page, Math.ceil(totalProducts / actualPageSize) || 1));
    console.log('FlowerList handlePageChange:', { page, validPage, actualPageSize, totalProducts });
    if (onPageChange) {
      onPageChange(validPage, actualPageSize);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    console.log('Page size changed to:', newPageSize);
    handlePageChange(1, newPageSize);
  };

  const totalPages = totalProducts > 0 ? Math.ceil(totalProducts / pageSize) : 0;
  const startItem = totalProducts > 0 ? Math.max(1, (currentPage - 1) * pageSize + 1) : 0;
  const endItem = totalProducts > 0 ? Math.min(currentPage * pageSize, totalProducts) : 0;
  const validCurrentPage = totalProducts > 0 ? Math.max(1, Math.min(currentPage, totalPages)) : 0;

  useEffect(() => {
    console.log('FlowerList pagination state:', {
      currentPage: validCurrentPage,
      pageSize,
      totalProducts,
      totalPages,
      hasOnPageChange: !!onPageChange,
    });
  }, [validCurrentPage, pageSize, totalProducts, onPageChange]);

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

      <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {totalProducts > 0
              ? `Showing ${startItem}-${endItem} of ${totalProducts} products`
              : 'No products found'}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="border border-gray-300 p-1 rounded text-sm"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span className="text-sm text-gray-600">per page</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => handlePageChange(validCurrentPage - 1)}
            disabled={validCurrentPage <= 1 || totalProducts === 0}
            className="px-3 py-1 text-sm"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            {totalProducts > 0 ? `Page ${validCurrentPage} of ${totalPages}` : ''}
          </span>
          <Button
            onClick={() => handlePageChange(validCurrentPage + 1)}
            disabled={validCurrentPage >= totalPages || totalProducts === 0}
            className="px-3 py-1 text-sm"
          >
            Next
          </Button>
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

      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          {totalProducts === 0 ? 'No products available.' : 'No data found.'}
        </div>
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
            {products.map((p) => (
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

      <div className="flex items-center justify-center gap-2 mt-4 p-4">
        <Button
          onClick={() => handlePageChange(1)}
          disabled={totalProducts === 0}
          className="px-3 py-1 text-sm"
        >
          First
        </Button>
        <Button
          onClick={() => handlePageChange(validCurrentPage - 1)}
          disabled={validCurrentPage <= 1 || totalProducts === 0}
          className="px-3 py-1 text-sm"
        >
          Previous
        </Button>
        {totalProducts > 0 &&
          Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = Math.max(1, Math.min(totalPages - 4, validCurrentPage - 2)) + i;
            if (pageNum <= totalPages) {
              return (
                <Button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 text-sm ${validCurrentPage === pageNum ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  {pageNum}
                </Button>
              );
            }
            return null;
          })}
        <Button
          onClick={() => handlePageChange(validCurrentPage + 1)}
          disabled={validCurrentPage >= totalPages || totalProducts === 0}
          className="px-3 py-1 text-sm"
        >
          Next
        </Button>
        <Button
          onClick={() => handlePageChange(totalPages)}
          disabled={totalProducts === 0 || validCurrentPage >= totalPages}
          className="px-3 py-1 text-sm"
        >
          Last
        </Button>
      </div>
    </div>
  );
};
