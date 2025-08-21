import { IBackendRes, IProduct } from "../types/backend";
import instance from "../config/axios-customize";
import { ins } from "framer-motion/client";

export const ProductService = {
  getProducts: async (params?: {
    page?: number;
    pageSize?: number;
    flowerTypes?: number[];
    occasions?: string[];
    minPrice?: number;
    maxPrice?: number;
    conditions?: string[];
    categoryIds?: number[];
    isActive?: boolean;
    searchTerm?: string;
    sortBy?: number; // 0: Name, 1: Price, 2: Stock, 3: Status
    sortDirection?: number; // 0: Asc, 1: Desc
  }): Promise<IBackendRes<{ products: IProduct[]; pagination: { totalItems: number } }>> => {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.page) queryParams.append('Page', params.page.toString());
      if (params.pageSize) queryParams.append('PageSize', params.pageSize.toString());
      if (params.flowerTypes?.length) {
        params.flowerTypes.forEach(type => queryParams.append('FlowerStatuses', type.toString()));
      }
      if (params.occasions?.length) {
        params.occasions.forEach(occasion => queryParams.append('Occasions', occasion));
      }
      if (params.minPrice !== undefined) queryParams.append('MinPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) queryParams.append('MaxPrice', params.maxPrice.toString());
      if (params.conditions?.length) {
        params.conditions.forEach(condition => queryParams.append('Conditions', condition));
      }
      if (params.categoryIds?.length) {
        params.categoryIds.forEach(id => queryParams.append('CategoryIds', id.toString()));
      }
      if (params.isActive !== undefined) queryParams.append('IsActive', params.isActive.toString());
      if (params.searchTerm) queryParams.append('SearchTerm', params.searchTerm);
      if (params.sortBy !== undefined) queryParams.append('SortBy', params.sortBy.toString());
      if (params.sortDirection !== undefined) queryParams.append('SortDirection', params.sortDirection.toString());
    }

    const url = `/api/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await instance.get(url);
    
    // Transform the response to ensure imageUrls are properly formatted
    const backendData = response as any;
    if (backendData.data && backendData.data.products) {
      backendData.data.products = backendData.data.products.map((product: any) => ({
        ...product,
        // Extract imageUrls from the images array structure: {id, imageUrls, publicId}
        imageUrls: product.images 
          ? product.images.map((img: any) => img.imageUrls || img.imageUrl || img.url)
          : (product.imageUrls || [])
      }));
    }
    
    return backendData;
  },

  getProductDetails: async (productId: number): Promise<IProduct> => {
    const response = await instance.get(`/api/products/${productId}`);
    
    // The axios interceptor returns response.data directly, so response is the actual data
    const backendData = response as any;
    
    // Transform the backend response to match IProduct interface
    const productData: IProduct = {
      id: backendData.id,
      name: backendData.name,
      flowerStatus: backendData.flowerStatus,
      description: backendData.description,
      basePrice: backendData.basePrice,
      condition: backendData.condition,
      stockQuantity: backendData.stockQuantity,
      isActive: backendData.isActive,
      // Extract imageUrls from the images array structure: {id, imageUrls, publicId}
      imageUrls: backendData.images 
        ? backendData.images.map((img: any) => img.imageUrls || img.imageUrl || img.url)
        : (backendData.imageUrls || []),
      categories: backendData.categories || [],
      createdAt: backendData.createdAt,
      updatedAt: backendData.updatedAt,
      reviews: backendData.reviews,
      averageRating: backendData.averageRating
    };
    
    return productData;
  },

  createProduct: (formData: FormData): Promise<IBackendRes<IProduct>> => {
    return instance.post('/api/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateProduct: (productId: number, formData: FormData): Promise<IProduct> => {
    return instance.put(`/api/products/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteProduct: (productId: number): Promise<{ success: boolean }> => {
    return instance.delete(`/api/products/${productId}`);
  },

  searchProducts: (query: string): Promise<{ query: string; totalCount: number; products: IProduct[] }> => {
    return instance.get(`/api/products/search?query=${encodeURIComponent(query)}`);
  },

  getProductSuggestions: (query: string): Promise<string[]> => {
    return instance.get(`/api/products/autocomplete?query=${encodeURIComponent(query)}`);
  },

  addProductReview: (reviewData: { productId: number; rating: number; comment: string }): Promise<any> => {
    return instance.post('/api/products/reviews', reviewData);
  },

  trackProductView: (productId: number): Promise<{ message: string }> => {
    return instance.post(`/api/products/${productId}/track-view`);
  },

  getRecommendationsForUser: (count: number = 6): Promise<{ products: IProduct[]; type: string; count: number }> => {
    return instance.get(`/api/products/recommendations/for-you?count=${count}`);
  },

  getPopularProducts: (count: number = 6): Promise<{ products: IProduct[]; type: string; count: number }> => {
    return instance.get(`/api/products/recommendations/popular?count=${count}`);
  },

  getSimilarProducts: (productId: number, count: number = 6): Promise<{ products: IProduct[]; type: string; count: number }> => {
    return instance.get(`/api/products/${productId}/similar?count=${count}`);
  },

  getRecentlyViewedProducts: (count: number = 6): Promise<{ products: IProduct[]; type: string; count: number }> => {
    return instance.get(`/api/products/recommendations/recently-viewed?count=${count}`);
  },

  getDynamicPrice: (productId: number, requestTime?: string): Promise<IBackendRes<{
    productId: number;
    productName: string;
    basePrice: number;
    dynamicPrice: number;
    discount: number;
    discountPercentage: number;
    appliedRule: any | null;
    calculatedAt: string;
    hasDiscount: boolean;
    hasSurcharge: boolean;
  }>> => {
    const params = new URLSearchParams();
    if (requestTime) {
      params.append('requestTime', requestTime);
    }
    return instance.get(`/api/pricing/products/${productId}/price?${params.toString()}`);
  },
};
