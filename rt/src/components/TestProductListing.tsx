import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IProduct, ICategory } from "../types/backend.d";
import { getCategories, getProducts } from "../config/api"
import { mockProducts } from './ProductListing/mockProducts';

import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";

import ProductCard from './ProductListing/ProductCard';
import ProductFilter from './ProductListing/ProductFilter';
import Pagination from './ProductListing/Pagination';

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
      if (!productsData || !productsData.data) {
        throw new Error("No data returned from API");
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
useEffect(() => {
    loadProducts();
  }, []);
const [products, setProducts] = useState<IProduct[]>([]);
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