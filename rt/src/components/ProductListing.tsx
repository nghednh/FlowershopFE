import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IProduct, ICategory } from "../types/backend.d";
import { getCategories, getProducts } from "../config/api"
import { mockProducts } from './ProductListing/mockProducts';

import { SearchBarWithAutocomplete } from './ProductListing/SearchBarAutocomplete';

import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import { MultiSelect } from './MultiSelect';

import ProductCard from './ProductListing/ProductCard';
import ProductFilter from './ProductListing/ProductFilter';
import Pagination from './ProductListing/Pagination';


const PAGE_SIZE = 4;

const flowerTypesOptions = [0, 1, 2]; // Example IDs
const occasionOptions = ['', 'Birthday', "Valentine's Day"];
const conditionOptions = ['', 'New', 'Old'];
const sortOptions = [
  { value: 0, label: 'Name A–Z' },
  { value: 1, label: 'Price' },
  { value: 2, label: 'Stock' },
  { value: 3, label: 'Status' },
];
const trueCategories: ICategory[] = [
  {
    id: 1,
    name: "Fresh",
    description: "#FreshWeedEveryday"
  },
  {
    id: 2,
    name: "Dried",
    description: "Lay it at home, never die"
  },
  {
    id: 3,
    name: "Live",
    description: "Live plants help you live better"
  }
];

const ProductListingPage: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Controlled filter/search/sort states
  const [searchInput, setSearchInput] = useState("");
  const [filtersInput, setFiltersInput] = useState({ New: false, Old: false, "Low Stock": false });
  const [sortInput, setSortInput] = useState<{ field: string; order: 'asc' | 'desc' }>({ field: 'name', order: 'asc' });

  // Applied filter/search/sort states
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ field: string; order: 'asc' | 'desc' }>({ field: 'name', order: 'asc' });

  const pageSizeOptions = [10, 20, 50, 100];
  const navigate = useNavigate();

  const matchesFilters = (product: IProduct) => {
    const searchTerm = searchParams.get('searchTerm')?.toLowerCase() || '';
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const flowerTypes = searchParams.getAll('flowerTypes').map(Number);
    const occasions = searchParams.getAll('occasions');
    const conditions = searchParams.getAll('conditions');
    const categories = searchParams.getAll('categories').map(Number).filter(id => trueCategories.some(p => p.id === id));

    if (searchTerm && !product.name.toLowerCase().includes(searchTerm)) return false;
    if (minPrice !== undefined && product.basePrice < minPrice) return false;
    if (maxPrice !== undefined && product.basePrice > maxPrice) return false;
    if (flowerTypes.length && !flowerTypes.includes(product.flowerStatus)) return false;
    if (occasions.length && !occasions.includes(product.description || '')) return false;
    if (conditions.length && !conditions.includes(product.condition || '')) return false;
    if (categories.length && !product.categories.some((id) => categories.includes(id.id))) return false;

    return true;
  };

  const loadProducts = async (
    page: number = 1,
    size: number = PAGE_SIZE,
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

  const fetchProducts = async () => {
    const page = Number(searchParams.get('page')) || 1;
    const sortBy = Number(searchParams.get('sortBy')) || 0;
    const sortDirection = Number(searchParams.get('sortDirection')) || 0;

    const searchTermRaw = searchParams.get('searchTerm');
    const searchTerm = searchTermRaw && searchTermRaw.trim() !== "" ? searchTermRaw : undefined;

    const minPriceRaw = searchParams.get('minPrice');
    const minPrice = minPriceRaw && minPriceRaw !== "" ? Number(minPriceRaw) : undefined;

    const maxPriceRaw = searchParams.get('maxPrice');
    const maxPrice = maxPriceRaw && maxPriceRaw !== "" ? Number(maxPriceRaw) : undefined;

    const flowerTypes = (() => {
      const raw = searchParams.getAll('flowerTypes').filter(s => s.trim() !== "");
      return raw.length ? raw.map(Number) : undefined;
    })();

    const occasions = (() => {
      const raw = searchParams.getAll('occasions').filter(s => s.trim() !== "");
      return raw.length ? raw : undefined;
    })();

    const conditions = (() => {
      const raw = searchParams.getAll('conditions').filter(s => s.trim() !== "");
      return raw.length ? raw : undefined;
    })();

    const categoryIds = (() => {
      const raw = searchParams.getAll('categories').filter(s => s.trim() !== "");
      if (!raw.length) return undefined;

      const validIds = new Set(trueCategories.map(c => c.id));
      const filtered = raw.map(Number).filter(id => validIds.has(id));
      return filtered.length ? filtered : undefined;
    })();


    const res = await getProducts({
      page,
      pageSize: PAGE_SIZE,
      sortBy,
      sortDirection,
      categoryIds, 
      searchTerm,
      minPrice,
      maxPrice,
      flowerTypes,
      occasions,
      conditions,
      isActive: true,
    });
    if (res.success) {
      const realProducts = res.data.products || [];
      const filteredMockProducts = mockProducts.filter(matchesFilters);
      const combinedProducts = [...filteredMockProducts, ...realProducts];
      setProducts(realProducts);
      setTotalCount(res.data.pagination.totalItems);// + filteredMockProducts.length);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  console.log(trueCategories);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Flowers</h1>

      {/* Wrapper grid: sidebar + content */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-4">

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <Select
            label="Sort By"
            value={searchParams.get('sortBy') || '0'}
            onChange={(e) => {
              searchParams.set('sortBy', e.target.value);
              setSearchParams(searchParams);
            }}
            options={sortOptions.map(opt => ({
              value: opt.value,
              label: opt.label,
            }))}
          />

          <MultiSelect
            label="Categories"
            value={searchParams.getAll("categories").map(Number)}
            onChange={(selected) => {
              const updated = new URLSearchParams(searchParams);
              updated.delete("categories");
              selected.forEach((id) => updated.append("categories", String(id)));
              setSearchParams(updated);
            }}
            options={trueCategories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
          />


          <Select
            label="Condition"
            value={searchParams.get('conditions') || ''}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
              searchParams.delete('conditions');
              selected.forEach(cond => searchParams.append('conditions', cond));
              setSearchParams(searchParams);
            }}
            options={conditionOptions.map(cond => ({
              value: cond,
              label: cond,
            }))}
          />

          <Select
            label="Flower Types"
            value={searchParams.get('flowerTypes') || ''}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
              searchParams.delete('flowerTypes');
              selected.forEach(type => searchParams.append('flowerTypes', String(type)));
              setSearchParams(searchParams);
            }}
            options={flowerTypesOptions.map(type => ({
              value: type,
              label: `Type ${type}`,
            }))}
          />

          <Select
            label="Occasion"
            value={searchParams.get('occasions') || ''}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
              searchParams.delete('occasions');
              selected.forEach(occ => searchParams.append('occasions', occ));
              setSearchParams(searchParams);
            }}
            options={occasionOptions.map(occ => ({
              value: occ,
              label: occ,
            }))}
          />
        </div>

        {/* Main content area */}
        <div className="flex flex-col gap-4">
          {/* Inline filters (search + price) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchBarWithAutocomplete />

            <div className="flex gap-2">
              <Input
                type="number"
                label="Min Price"
                value={searchParams.get('minPrice') || ''}
                onChange={(e) => {
                  searchParams.set('minPrice', e.target.value);
                  setSearchParams(searchParams);
                }}
              />
              <Input
                type="number"
                label="Max Price"
                value={searchParams.get('maxPrice') || ''}
                onChange={(e) => {
                  searchParams.set('maxPrice', e.target.value);
                  setSearchParams(searchParams);
                }}
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            total={totalCount}
            pageSize={PAGE_SIZE}
            currentPage={Number(searchParams.get('page')) || 1}
            onPageChange={(newPage) => {
              searchParams.set('page', String(newPage));
              setSearchParams(searchParams);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
