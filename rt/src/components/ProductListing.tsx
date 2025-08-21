import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IProduct, ICategory } from "../types/backend.d";
import { getCategories, getProducts } from "../config/api"

import { SearchBarWithAutocomplete } from './ProductListing/SearchBarAutocomplete';

import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import { MultiSelect } from './MultiSelect';

import ProductCard from './ProductListing/ProductCard';
import ProductFilter from './ProductListing/ProductFilter';
import Pagination from './ProductListing/Pagination';

import './ProductListing/index.css';


const PAGE_SIZE = 9;


// Status options based on API flowerStatus field
const statusOptions = [
  { value: '', label: 'All Status' },
  { value: '0', label: 'New' },
  { value: '1', label: 'Old' },
  { value: '2', label: 'Low Stock' }
];

const sortOptions = [
  { value: '0', label: 'Name' },
  { value: '1', label: 'Base Price' },
  { value: '2', label: 'Stock' },
  { value: '3', label: 'Status' }
];

const sortOrderOptions = [
  { value: '0', label: 'Ascending' },
  { value: '1', label: 'Descending' }
];

const ProductListingPage: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    
    fetchCategories();
  }, []);

  const pageSizeOptions = [10, 20, 50, 100];
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const page = Number(searchParams.get('page')) || 1;
      const sortBy = Number(searchParams.get('sortBy')) || 0;
      const sortDirection = Number(searchParams.get('sortDirection')) || 0;

      const searchTermRaw = searchParams.get('searchTerm');
      const searchTerm = searchTermRaw && searchTermRaw.trim() !== "" ? searchTermRaw : undefined;

      const minPriceRaw = searchParams.get('minPrice');
      const minPrice = minPriceRaw && minPriceRaw !== "" ? Number(minPriceRaw) : undefined;

      const maxPriceRaw = searchParams.get('maxPrice');
      const maxPrice = maxPriceRaw && maxPriceRaw !== "" ? Number(maxPriceRaw) : undefined;



      // Map status dropdown to flowerTypes (number) for API
      const status = searchParams.get('status');
      const flowerTypesFilter = (() => {
        if (!status || status.trim() === '') return undefined;
        // Map UI status to API flowerTypes (number[])
        if (status === '0') return { flowerTypes: [0] }; // New
        if (status === '1') return { flowerTypes: [1] }; // Old
        if (status === '2') return { flowerTypes: [2] }; // Low Stock
        return undefined;
      })();

      const categoryIds = (() => {
        const raw = searchParams.getAll('categories').filter(s => s.trim() !== "");
        if (!raw.length) return undefined;

        const validIds = new Set(categories.map(c => c.id));
        const filtered = raw.map(Number).filter(id => validIds.has(id));
        return filtered.length ? filtered : undefined;
      })();

      const apiParams = {
        page,
        pageSize: PAGE_SIZE,
        sortBy,
        sortDirection,
        categoryIds, 
        searchTerm,
        minPrice,
        maxPrice,
        isActive: true,
    ...flowerTypesFilter // Spread the flowerTypes filter parameters
      };

      const res = await getProducts(apiParams);
      
      if (!res.data) {
        throw new Error("No data returned from API");
      }
      
      if (res.success) {
        const realProducts = res.data.products || [];
        setProducts(realProducts);
        setTotalCount(res.data.pagination.totalItems);
      } else {
        throw new Error(res.message || 'Failed to fetch products');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
      console.error('Error fetching products:', err);
      // Fallback to empty array instead of crashing
      setProducts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  console.log('Categories loaded:', categories);

  return (
  <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-25 to-purple-50 flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-300/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-rose-300/20 to-pink-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-yellow-300/30 to-orange-400/30 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="flex-1 relative z-10">
        <div className="w-full px-4 py-8">
          {/* Enhanced Two-column layout with proper gap handling */}
          <div className="flex gap-8 min-h-[calc(100vh-180px)]">
            {/* Left Sidebar - Enhanced Filters - Fixed width */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 sticky top-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Filters & Search
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        const updated = new URLSearchParams(searchParams);
                        const current = searchParams.get('sortDirection') || '0';
                        updated.set('sortDirection', current === '0' ? '1' : '0');
                        setSearchParams(updated);
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 border-green-300 ml-2 ${
                        (searchParams.get('sortDirection') || '0') === '0'
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-green-700 text-white shadow-lg'
                      }`}
                      aria-label={(searchParams.get('sortDirection') || '0') === '0' ? 'Ascendig' : 'Descending'}
                    >
                      {(searchParams.get('sortDirection') || '0') === '0' ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Sort Descending">
                          <path d="M12 18V6m0 0l-6 6m6-6l6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Sort Ascending">
                          <path d="M12 6v12m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <SearchBarWithAutocomplete />
                  
                  <div className="space-y-4">
                    <Select
                      label="Sort By"
                      value={searchParams.get('sortBy') || '0'}
                      onChange={(e) => {
                        const updated = new URLSearchParams(searchParams);
                        updated.set('sortBy', e.target.value);
                        setSearchParams(updated);
                      }}
                      options={sortOptions.map(opt => ({
                        value: opt.value,
                        label: opt.label,
                      }))}
                    />

                    {/* Convert Sort Order to icon buttons */}

                    <MultiSelect
                      label="Categories (Multiple Choice)"
                      value={searchParams.getAll("categories").map(Number)}
                      onChange={(selected) => {
                        const updated = new URLSearchParams(searchParams);
                        updated.delete("categories");
                        selected.forEach((id) => updated.append("categories", String(id)));
                        setSearchParams(updated);
                      }}
                      options={categories.map((cat) => ({
                        value: cat.id,
                        label: cat.name,
                      }))}
                    />

                    <Select
                      label="Status (New/Old/Low Stock)"
                      value={searchParams.get('status') || ''}
                      onChange={(e) => {
                        const updated = new URLSearchParams(searchParams);
                        updated.delete('status');
                        if (e.target.value && e.target.value.trim() !== '') {
                          updated.append('status', e.target.value);
                        }
                        setSearchParams(updated);
                      }}
                      options={statusOptions.map(status => ({
                        value: status.value,
                        label: status.label,
                      }))}
                    />



                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                      <label className="block text-sm font-semibold text-blue-800 mb-3">Price Range</label>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          type="number"
                          label="Min ($)"
                          value={searchParams.get('minPrice') || ''}
                          onChange={(e) => {
                            const updated = new URLSearchParams(searchParams);
                            if (e.target.value && e.target.value.trim() !== '') {
                              updated.set('minPrice', e.target.value);
                            } else {
                              updated.delete('minPrice');
                            }
                            setSearchParams(updated);
                          }}
                          placeholder="0"
                        />
                        <Input
                          type="number"
                          label="Max ($)"
                          value={searchParams.get('maxPrice') || ''}
                          onChange={(e) => {
                            const updated = new URLSearchParams(searchParams);
                            if (e.target.value && e.target.value.trim() !== '') {
                              updated.set('maxPrice', e.target.value);
                            } else {
                              updated.delete('maxPrice');
                            }
                            setSearchParams(updated);
                          }}
                          placeholder="1000"
                        />
                      </div>
                    </div>

                    {/* Clear Filters Button */}
                    <Button 
                      onClick={() => setSearchParams(new URLSearchParams())}
                      className="filter-button-primary w-full"
                    >
                      <svg className="filter-button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Side - Enhanced Products Display - Takes remaining space */}
            <div className="flex-1 min-w-0">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
                {/* Enhanced Loading State */}
                {loading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-gradient-to-r from-rose-300 to-pink-300 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-600 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-700">Loading beautiful flowers...</p>
                        <p className="text-sm text-gray-500">Preparing the best selection for you</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Error State */}
                {error && !loading && (
                  <div className="flex items-center justify-center p-6">
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-8 max-w-md text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
                      <p className="text-red-600 mb-4">{error}</p>
                      <Button 
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2 flex items-center justify-center"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}

                {/* Products Display */}
                {!loading && !error && (
                  <>
                    {products.length === 0 ? (
                      <div className="flex items-center justify-center py-12 min-h-[40vh]">
                        <div className="flex flex-col items-center justify-center text-center max-w-md w-full">
                          <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-3">No flowers bloom here yet</h3>
                          <p className="text-gray-500 mb-6 leading-relaxed">
                            We couldn't find any flowers matching your criteria. Try adjusting your filters or search terms to discover our beautiful collection.
                          </p>
                      <Button 
                        onClick={() => setSearchParams(new URLSearchParams())}
                        className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Start Fresh
                      </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Results Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                          <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold text-gray-800">
                              Found {totalCount} beautiful flowers
                            </h2>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Page {Number(searchParams.get('page')) || 1}</span>
                          </div>
                        </div>

                        {/* Enhanced Products Grid - 4 cards per row */}
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-max">
                          {products.map((product, index) => (
                            <div 
                              key={product.id}
                              className="transform transition-all duration-300 hover:scale-105"
                              style={{
                                animationDelay: `${index * 100}ms`,
                                animation: 'fadeInUp 0.6s ease-out forwards'
                              }}
                            >
                              <ProductCard product={product} />
                            </div>
                          ))}
                        </div>

                        {/* Enhanced Pagination */}
                        {totalCount > PAGE_SIZE && (
                          <div className="border-t border-gray-200 pt-6 mt-6">
                            <Pagination
                              total={totalCount}
                              pageSize={PAGE_SIZE}
                              currentPage={Number(searchParams.get('page')) || 1}
                              onPageChange={(newPage) => {
                                searchParams.set('page', String(newPage));
                                setSearchParams(searchParams);
                                // Scroll to top when page changes
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
