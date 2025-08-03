import { IBackendRes, ICart, ICategory, IPricingRule, IProduct, IUser, PaymentMethod, IUserLoyalty, IUserSummaryLoyalty, IPaymentRequest, IPaymentResponse } from "../types/backend";
import instance from "./axios-customize";

// Category service to interact with the backend API
export const getCategories = () => {
  return instance.get<IBackendRes<ICategory[]>>('/api/category');
};

export const createCategory = (category: Omit<ICategory, 'id'>) => {
  return instance.post<IBackendRes<ICategory>>('/api/category', category);
};

export const updateCategory = (id: number, category: Partial<ICategory>) => {
  return instance.put<IBackendRes<ICategory>>(`/api/category/${id}`, category);
};

export const deleteCategory = (id: number) => {
  return instance.delete<IBackendRes<{ success: boolean }>>(`/api/category/${id}`);
};

// User
export const loginUser = (email: string, password: string) => {
  return instance.post<IBackendRes<{ token: string; user: any }>>('/api/login', { email, password });
};

export const registerUser = (user: Omit<IUser, 'id'>) => {
  return instance.post<IBackendRes<{ user: IUser }>>('/api/admin/register-new-user', user);
};

export const getUsers = () => {
  return instance.get<IBackendRes<{ users: IUser[] }>>('/api/admin/users');
};

export const updateUserRole = (userId: string, roleName: string[]) => {
  return instance.post<IBackendRes<IUser>>(`/api/admin/update-user-role`, { userId, newRoleName: roleName[0] });
};

// Order
export const createOrder = (orderData: { cartId: number; addressId: number; paymentMethod: PaymentMethod }) => {
  return instance.post<IBackendRes<{ order: any }>>('/api/orders', orderData);
};

export const getOrders = () => {
  return instance.get<IBackendRes<{ orders: any[] }>>('/api/Orders');
}

export const getOrderHistory = () => {
  return instance.get<IBackendRes<{ orders: any[] }>>('/api/orders/history');
};

export const getOrderDetails = (orderId: number) => {
  return instance.get<IBackendRes<{ order: any }>>(`/api/orders/${orderId}`);
};

export const cancelOrder = (orderId: number) => {
  return instance.delete<IBackendRes<{ success: boolean }>>(`/api/orders/${orderId}`);
};

export const updateOrder = (orderId: number, orderStatus: string, trackingNumber: string) => {
  return instance.put<IBackendRes<{ order: any }>>(`/api/Orders/${orderId}`, { status: orderStatus, trackingNumber });
};

export const getMyOrders = () => {
  return instance.get<IBackendRes<{ order: any}>>(`api/Orders/my-orders`);
}

// Product
export const getProducts = (params?: {
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
}) => {
  const queryParams = new URLSearchParams();

  if (params) {
    if (params.page) queryParams.append('Page', params.page.toString());
    if (params.pageSize) queryParams.append('PageSize', params.pageSize.toString());
    if (params.flowerTypes?.length) {
      params.flowerTypes.forEach(type => queryParams.append('FlowerTypes', type.toString()));
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
  return instance.get<IBackendRes<{ products: IProduct[]; totalCount: number }>>(url);
};

export const getProductDetails = (productId: number) => {
  return instance.get<IBackendRes<IProduct>>(`/api/products/${productId}`);
};

export const createProduct = (formData: FormData) => {
  return instance.post<IBackendRes<{ product: IProduct }>>('/api/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Ensure multipart/form-data is set
    },
  });
};

export const updateProduct = (productId: number, formData: FormData) => {
  return instance.put<IBackendRes<{ product: IProduct }>>(`/api/products/${productId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Ensure multipart/form-data is set
    },
  });
};

export const deleteProduct = (productId: number) => {
  return instance.delete<IBackendRes<{ success: boolean }>>(`/api/products/${productId}`);
};

export const searchProducts = (query: string) => {
  return instance.get<IBackendRes<{ query: string; totalCount: number; products: any[] }>>(`/api/products/search?query=${encodeURIComponent(query)}`);
};

// Product Autocomplete
export const getProductSuggestions = (query: string) => {
  return instance.get<IBackendRes<string[]>>(`/api/products/autocomplete?query=${encodeURIComponent(query)}`);
};

// Product Reviews
export const addProductReview = (reviewData: { productId: number; rating: number; comment: string }) => {
  return instance.post<IBackendRes<any>>('/api/products/reviews', reviewData);
};

// Product View Tracking
export const trackProductView = (productId: number) => {
  return instance.post<IBackendRes<{ message: string }>>(`/api/products/${productId}/track-view`);
};

// Product Recommendations
export const getRecommendationsForUser = (count: number = 6) => {
  return instance.get<IBackendRes<{ products: IProduct[]; type: string; count: number }>>(`/api/products/recommendations/for-you?count=${count}`);
};

export const getPopularProducts = (count: number = 6) => {
  return instance.get<IBackendRes<{ products: IProduct[]; type: string; count: number }>>(`/api/products/recommendations/popular?count=${count}`);
};

export const getSimilarProducts = (productId: number, count: number = 6) => {
  return instance.get<IBackendRes<{ products: IProduct[]; type: string; count: number }>>(`/api/products/${productId}/similar?count=${count}`);
};

export const getRecentlyViewedProducts = (count: number = 6) => {
  return instance.get<IBackendRes<{ products: IProduct[]; type: string; count: number }>>(`/api/products/recommendations/recently-viewed?count=${count}`);
};

// Cart
export const getCart = () => {
  return instance.get<IBackendRes<{ cart: any[] }>>('/api/cart');
};

export const addToCart = (productId: number, quantity: number) => {
  return instance.post<IBackendRes<ICart>>('/api/Cart/add', { productId, quantity });
};

export const updateCartItem = (cartItemId: number, quantity: number) => {
  return instance.put<IBackendRes<ICart>>('/api/Cart/update', [{ cartItemId, quantity }]);
};

export const removeFromCart = (cartItemId: number) => {
  return instance.delete<IBackendRes<{ success: boolean }>>(`/api/Cart/remove/${cartItemId}`);
};

export const clearCart = () => {
  return instance.delete<IBackendRes<{ success: boolean }>>('/api/Cart/clear');
};

export const checkoutCart = () => {
  return instance.post<IBackendRes<{ order: any }>>('/api/cart/checkout');
};

export const getCartTotal = () => {
  return instance.get<IBackendRes<{ total: number }>>('/api/Cart/total');
};

export const getCartItemCount = () => {
  return instance.get<IBackendRes<{ count: number }>>('/api/Cart/count');
};

export const updateCartItemQuantity = (cartItemId: number, quantity: number) => {
  return instance.put<IBackendRes<{ cartItem: any }>>(`/api/Cart/${cartItemId}/quantity`, { quantity });
};

export const getCartDetails = () => {
  return instance.get<IBackendRes<ICart>>('/api/Cart');
};

// Pricing Rules
export const getPricingRules = () => {
  return instance.get<IBackendRes<{ rules: any[] }>>('/api/pricing/rules');
};

export const createPricingRule = (ruleData: any) => {
  return instance.post<IBackendRes<{ rule: any }>>('/api/pricing/rules', ruleData);
};

export const updatePricingRule = (ruleId: number, ruleData: IPricingRule) => {
  console.log("Updating Pricing Rule:", ruleData);
  return instance.put<IBackendRes<{ rule: IPricingRule }>>(`/api/pricing/rules/${ruleId}`, ruleData);
};

export const deletePricingRule = (ruleId: number) => {
  return instance.delete<IBackendRes<{ success: boolean }>>(`/api/pricing/rules/${ruleId}`);
};

export const applyPricingRule = (cartId: number, ruleId: number) => {
  return instance.post<IBackendRes<{ cart: any }>>(`/api/cart/${cartId}/apply-rule`, { ruleId });
};

export const removePricingRule = (cartId: number, ruleId: number) => {
  return instance.delete<IBackendRes<{ success: boolean }>>(`/api/cart/${cartId}/remove-rule/${ruleId}`);
};

export const getPricingRuleDetails = (ruleId: number) => {
  return instance.get<IBackendRes<{ rule: any }>>(`/api/pricing/rules/${ruleId}`);
};

export const getPricingRuleHistory = () => {
  return instance.get<IBackendRes<{ history: any[] }>>('/api/pricing/rules/history');
};

export const getPricingRuleById = (ruleId: number) => {
  return instance.get<IBackendRes<{ rule: any }>>(`/api/pricing/rules/${ruleId}`);
};

// Address APIs
export const createAddress = (addressData: {
  fullName: string;
  streetAddress: string;
  city: string;
  phoneNumber: string;
}) => {
  return instance.post<IBackendRes<{ address: any }>>('/api/Address', addressData);
};

export const getUserAddresses = () => {
  return instance.get<IBackendRes<{ addresses: any[] }>>('/api/Address/user');
};

export const getAddressById = (addressId: number) => {
  return instance.get<IBackendRes<{ address: any }>>(`/api/Address/${addressId}`);
};

// Payment APIs
export const createPayment = (paymentData: IPaymentRequest) => {
  return instance.post<IBackendRes<IPaymentResponse>>('/api/Payment', paymentData);
};

export const getPaymentStatus = (paymentId: number) => {
  return instance.get<IBackendRes<IPaymentResponse>>(`/api/Payment/${paymentId}`);
};

// VNPay APIs
export const vnpayCallback = (params: any) => {
  return instance.get<IBackendRes<any>>('/api/Vnpay/Callback', { params });
};

export const vnpayIpnAction = (params: any) => {
  return instance.get<IBackendRes<any>>('/api/Vnpay/IpnAction', { params });
};

// Report: summary of total revenue and total orders
export const getReportSummary = (startDate: string, endDate: string) => {
  return instance.get<IBackendRes<{ totalOrders: Number, totalRevenue: number, averageOrderValue: number }>>(
    '/api/admin/reports/sales-summary',
    { params: { startDate, endDate } }
  );
};

// Report: best-selling products in a range
export const getBestSellingProducts = (topN: number, startDate: string, endDate: string) => {
  return instance.get<IBackendRes<{ products: any[] }>>(
    '/api/admin/reports/best-selling-products',
    { params: { topN, startDate, endDate } }
  );
};

// Loyalty Points API
export const getUserLoyaltyInfo = () => {
  return instance.get<IUserLoyalty>('/api/loyalty/me');
};

export const redeemLoyaltyPoints = (pointsToRedeem: number) => {
  return instance.post('/api/loyalty/redeem', { pointsToRedeem });
};

export const getAllUsersLoyaltyInfo = () => {
  return instance.get<IBackendRes<{ users: IUserSummaryLoyalty[] }>>('/api/loyalty/all');
};

export const updateUserLoyaltyPoints = (userId: number, newPointsValue: number) => {
  return instance.put(`/api/loyalty/update/${userId}`, { newPointsValue });
};