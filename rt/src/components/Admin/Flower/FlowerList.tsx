import React, { useEffect, useState } from "react";
import { Button } from "../../Button";
import { ICategory, IProduct } from "../../../types/backend";
import { getCategories, getProducts } from "../../../config/api";

interface FlowerListProps {
  onAdd: () => void;
  onEdit: (product: IProduct) => void;
  onDelete: (id: number) => void;
  onDeleteSuccess?: () => void;
  refreshTrigger?: number;
}

export const FlowerList: React.FC<FlowerListProps> = ({
  onAdd,
  onEdit,
  onDelete,
  onDeleteSuccess,
  refreshTrigger,
}) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter and sort states - similar to OrderList
  const [searchTerm, setSearchTerm] = useState("");
  const [sortInput, setSortInput] = useState<{ field: string; order: 'asc' | 'desc' }>({ field: 'id', order: 'asc' });
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<number>(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Load ALL products without pagination or filtering
      const productsData = await getProducts({
        pageSize: 1000, // Load a large number to get all products
      });
      if (!productsData || !productsData.data || !productsData.data.products) {
        throw new Error("Invalid products data structure");
      }
      setProducts(productsData.data.products);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      loadProducts();
    }
  }, [refreshTrigger]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const handleSortInputChange = (field: string, order: 'asc' | 'desc') => {
    setSortInput({ field, order });
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(Number(e.target.value));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSortInput({ field: 'name', order: 'asc' });
    setStatusFilter("");
    setCategoryFilter(0);
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await onDelete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      onDeleteSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
      console.error('Error deleting product:', err);
    }
  };

  // Client-side filtering and sorting - similar to OrderList pattern
  const filteredProducts = (products ?? [])
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toString().includes(searchTerm);
      
      const matchesStatus = !statusFilter || 
        (statusFilter === 'New' && p.flowerStatus === 0) ||
        (statusFilter === 'Old' && p.flowerStatus === 1) ||
        (statusFilter === 'Low Stock' && p.stockQuantity <= 10);
      
      const matchesCategory = !categoryFilter || p.categories?.some(c => c.id === categoryFilter);
      
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      if (!sortInput.field) return 0;
      const multiplier = sortInput.order === "asc" ? 1 : -1;
      if (sortInput.field === "name") return multiplier * a.name.localeCompare(b.name);
      if (sortInput.field === "basePrice") return multiplier * (a.basePrice - b.basePrice);
      if (sortInput.field === "stockQuantity") return multiplier * (a.stockQuantity - b.stockQuantity);
      if (sortInput.field === "flowerStatus") return multiplier * (a.flowerStatus - b.flowerStatus);
      return 0;
    });

  // Pagination calculations
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter]);

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

  const handleSortChange = (field: string) => {
    const newOrder = sortInput.field === field && sortInput.order === 'asc' ? 'desc' : 'asc';
    setSortInput({ field, order: newOrder });
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
        <button onClick={() => setError(null)} className="ml-2 text-red-900 hover:text-red-700">
          ×
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-black font-bold uppercase text-2xl">Flower Products</h2>
        <div className="flex items-center gap-2">
          <Button onClick={onAdd}>Add Flower</Button>
          <Button onClick={resetFilters} className="ml-1">Reset</Button>
        </div>
      </div>

      <div className="flex flex-col mb-4 p-4 bg-gray-50 gap-2 rounded">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search products..."
            className="border border-gray-300 p-2 rounded text-sm"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filter by Status:</span>
            <select 
              value={statusFilter} 
              onChange={handleStatusFilterChange}
              className="border border-gray-300 p-1 rounded text-sm"
            >
              <option value="">All Status</option>
              <option value="New">New</option>
              <option value="Old">Old</option>
              <option value="Low Stock">Low Stock</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filter by Category:</span>
            <select
              value={categoryFilter}
              onChange={handleCategoryFilterChange}
              className="border border-gray-300 p-1 rounded text-sm"
            >
              <option value={0}>All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={`${sortInput.field}|${sortInput.order}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('|');
                handleSortInputChange(field, order as 'asc' | 'desc');
              }}
              className="border border-gray-300 p-1 rounded text-sm"
            >
              <option value="name|asc">Name (A-Z)</option>
              <option value="name|desc">Name (Z-A)</option>
              <option value="basePrice|asc">Price (Low to High)</option>
              <option value="basePrice|desc">Price (High to Low)</option>
              <option value="stockQuantity|asc">Stock (Low to High)</option>
              <option value="stockQuantity|desc">Stock (High to Low)</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-gray-300 p-1 rounded text-sm"
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

      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No products found.
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th
                className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer w-16"
                onClick={() => handleSortChange('id')}
              >
                ID {sortInput.field === 'id' && (sortInput.order === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer w-1/4"
                onClick={() => handleSortChange('name')}
              >
                Name {sortInput.field === 'name' && (sortInput.order === 'asc' ? '↑' : '↓')}
              </th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300 w-20">
                Status
              </th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300 w-1/5">
                Categories
              </th>
              <th
                className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer w-24"
                onClick={() => handleSortChange('basePrice')}
              >
                Price {sortInput.field === 'basePrice' && (sortInput.order === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer w-20"
                onClick={() => handleSortChange('stockQuantity')}
              >
                Stock {sortInput.field === 'stockQuantity' && (sortInput.order === 'asc' ? '↑' : '↓')}
              </th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300 w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((p) => (
              <tr key={p.id} className="border-b border-gray-300">
                <td className="p-2 border-x border-gray-300 w-16 font-bold">{p.id}</td>
                <td className="p-2 border-x border-gray-300 w-1/4">{p.name}</td>
                <td className="p-2 border-x border-gray-300 w-20">
                  {p.flowerStatus === 0 ? 'New' : p.flowerStatus === 1 ? 'Old' : p.stockQuantity <= 10 ? 'Low Stock' : 'Common'}
                </td>
                <td className="p-2 border-x border-gray-300 w-1/5">
                  {p.categories?.map((cat) => (
                    <span key={cat.id} className="inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs mr-1">
                      {cat.name}
                    </span>
                  )) || 'No categories'}
                </td>
                <td className="p-2 border-x border-gray-300 w-24">${p.basePrice}</td>
                <td className="p-2 border-x border-gray-300 w-20">{p.stockQuantity}</td>
                <td className="p-2 border-x border-gray-300 w-32">
                  <div className="flex items-center justify-center gap-2">
                    <Button onClick={() => onEdit(p)} className="mr-2">
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(p.id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      {filteredProducts.length > 0 && (
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
