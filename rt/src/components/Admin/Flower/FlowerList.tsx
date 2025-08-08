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
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define filter types
  type FilterKey = 'New' | 'Old' | 'Low Stock';
  
  // Controlled filter/search/sort states
  const [searchInput, setSearchInput] = useState("");
  const [filtersInput, setFiltersInput] = useState<Record<FilterKey, boolean>>({ New: false, Old: false, "Low Stock": false });
  const [categoriesInput, setCategoriesInput] = useState(categories[0]?.id || 0);
  const [sortInput, setSortInput] = useState<{ field: string; order: 'asc' | 'desc' }>({ field: 'name', order: 'asc' });

  // Applied filter/search/sort states
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ field: string; order: 'asc' | 'desc' }>({ field: 'name', order: 'asc' });

  const pageSizeOptions = [10, 20, 50, 100];

  const loadProducts = async (
    page: number = currentPage,
    size: number = pageSize,
    flowerTypes: number[] = [],
    categoryIds: number[] = [],
    searchTerm: string = search,
    sortParam: { field: string; order: 'asc' | 'desc' } = sort
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Map sort field and order to sortBy and sortDirection numbers
      const sortFieldMap: { [key: string]: number } = { name: 0, basePrice: 1, stockQuantity: 2, flowerStatus: 3 };
      const sortBy = sortFieldMap[sortParam.field] ?? 0;
      const sortDirection = sortParam.order === 'asc' ? 0 : 1;

      const productsData = await getProducts({
        page,
        pageSize: size,
        flowerTypes: flowerTypes.length > 0 ? flowerTypes : undefined,
        categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
        searchTerm: searchTerm,
        sortBy,
        sortDirection,
      });
      if (!productsData || !productsData.data || !productsData.data.products) {
        throw new Error("Invalid products data structure");
      }
      setProducts(productsData.data.products);
      setTotalProducts(productsData.data.pagination.totalItems);
      setCurrentPage(page);
      setPageSize(size);
      setSearch(searchTerm);
      setSort(sortParam);
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
      console.log('Categories loaded:', response);
      setCategories(response);
      console.log('Categories:', categories);
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

  const handlePageChange = (page: number, newPageSize?: number) => {
    const actualPageSize = newPageSize || pageSize;
    const validPage = Math.max(1, Math.min(page, Math.ceil(totalProducts / actualPageSize) || 1));
    loadProducts(validPage, actualPageSize, [], [], search, sort);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    handlePageChange(1, newPageSize);
  };

  // Controlled input handlers
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleFilterInputChange = (filterName: FilterKey) => {
    setFiltersInput({ ...filtersInput, [filterName]: !filtersInput[filterName] });
  };

  const handleSortInputChange = (field: string, order: 'asc' | 'desc') => {
    setSortInput({ field, order });
  };

  const handleApplyFilters = () => {
    if (categoriesInput === 0) {
      loadProducts(1, pageSize, getSelectedFlowerTypes(), [], searchInput, sortInput);
    } else {
      loadProducts(1, pageSize, getSelectedFlowerTypes(), [categoriesInput], searchInput, sortInput);
    }
  };

  const getSelectedFlowerTypes = () => {
    return Object.entries(filtersInput)
      .filter(([_, value]) => value)
      .map(([key]) => {
        switch (key) {
          case "New": return 0;
          case "Old": return 1;
          case "Low Stock": return 2;
          default: return -1; // Invalid status
        }
      })
      .filter(type => type !== -1);
  }

  const handleResetFilters = () => {
    setSearchInput("");
    setFiltersInput({ "New": false, Old: false, "Low Stock": false });
    setSortInput({ field: 'name', order: 'asc' });
    loadProducts(1, pageSize, [], [], "", { field: 'name', order: 'asc' });
  };

  const handleSortChange = (field: string) => {
    const newOrder = sortInput.field === field && sortInput.order === 'asc' ? 'desc' : 'asc';
    setSortInput({ field, order: newOrder });
  };

  const handleDelete = async (id: number) => {
    try {
      await onDelete(id);
      await loadProducts();
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const totalPages = totalProducts > 0 ? Math.ceil(totalProducts / pageSize) : 0;
  const startItem = totalProducts > 0 ? Math.max(1, (currentPage - 1) * pageSize + 1) : 0;
  const endItem = totalProducts > 0 ? Math.min(currentPage * pageSize, totalProducts) : 0;
  const validCurrentPage = totalProducts > 0 ? Math.max(1, Math.min(currentPage, totalPages)) : 0;

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
          <Button onClick={handleApplyFilters} className="ml-2">Apply</Button>
          <Button onClick={handleResetFilters} className="ml-1">Reset</Button>
        </div>
      </div>

      <div className="flex flex-col mb-4 p-4 bg-gray-50 gap-2 rounded">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchInputChange}
            placeholder="Search products..."
            className="border border-gray-300 p-2 rounded text-sm"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filter by Status:</span>
            {(["New", "Old", "Low Stock"] as FilterKey[]).map((status) => (
              <label key={status} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={filtersInput[status]}
                  onChange={() => handleFilterInputChange(status)}
                />
                {status}
              </label>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filter by Category:</span>
            <select
              value={categoriesInput}
              onChange={(e) => setCategoriesInput(Number(e.target.value))}
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

        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {totalProducts > 0
              ? `Showing ${startItem}-${endItem} of ${totalProducts} products`
              : "No products found"}
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
      </div>

      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          {totalProducts === 0 ? "No products available." : "No data found."}
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th
                className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortChange('name')}
              >
                Name {sort.field === 'name' && (sort.order === 'asc' ? '↑' : '↓')}
              </th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300">
                Status
              </th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300">
                Categories
              </th>
              <th
                className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortChange('basePrice')}
              >
                Price {sort.field === 'basePrice' && (sort.order === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="text-black font-bold uppercase p-2 border border-gray-300 cursor-pointer"
                onClick={() => handleSortChange('stockQuantity')}
              >
                Stock {sort.field === 'stockQuantity' && (sort.order === 'asc' ? '↑' : '↓')}
              </th>
              <th className="text-black font-bold uppercase p-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-gray-300">
                <td className="p-2 border-x border-gray-300">{p.name}</td>
                <td className="p-2 border-x border-gray-300">{["New", "Old", "Low Stock"][p.flowerStatus]}</td>
                <td className="p-2 border-x border-gray-300">
                  {p.categories.map((id) => (
                    <span key={id.id} className="inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs mr-1">
                      {id.name}
                    </span>
                  ))}
                </td>
                <td className="p-2 border-x border-gray-300">${p.basePrice}</td>
                <td className="p-2 border-x border-gray-300">{p.stockQuantity}</td>
                <td className="p-2 border-x border-gray-300">
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
                  className={`px-3 py-1 text-sm ${validCurrentPage === pageNum ? "bg-blue-500 text-white" : "bg-gray-200"}`}
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
