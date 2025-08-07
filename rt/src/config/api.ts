import { ICart, ICategory, IPricingRule, IProduct, IUser, IOrder, PaymentMethod, IUserLoyalty, IUserSummaryLoyalty, IPaymentRequest, IPaymentResponse, ILoginResponse, IUserRegister } from "../types/backend";
import instance from "./axios-customize";

// Category service to interact with the backend API
export const getCategories = (): Promise<ICategory[]> => {
  return instance.get('/api/category');
};

export const createCategory = (category: Omit<ICategory, 'id'>): Promise<ICategory> => {
  return instance.post('/api/category', category);
};

export const updateCategory = (id: number, category: Partial<ICategory>): Promise<ICategory> => {
  return instance.put(`/api/category/${id}`, category);
};

export const deleteCategory = (id: number): Promise<{ success: boolean }> => {
  return instance.delete(`/api/category/${id}`);
};

export const loginAccount = (email: string, password: string): Promise<ILoginResponse> => {
  return instance.post('/api/login', { email, password });
};

export const registerAccount = (
  firstname: string,
  lastname: string,
  email: string,
  username: string,
  phoneNumber: string,
  password: string,
  confirmPassword: string
): Promise<IUserRegister> => {
  return instance.post('/api/register', {
    firstName: firstname,
    lastName: lastname,
    email,
    userName: username,
    phoneNumber,
    password,
    confirmPassword
  });
};

export const registerUser = (user: Omit<IUser, 'id'>): Promise<IUser> => {
  return instance.post('/api/admin/register-new-user', user);
};

export const getUsers = (): Promise<IUser[]> => {
  return instance.get('/api/admin/users');
};

export const updateUserRole = (userId: string, roleName: string[]): Promise<IUser> => {
  return instance.post(`/api/admin/update-user-role`, { userId, newRoleName: roleName[0] });
};

// Order
export const createOrder = (orderData: { cartId: number; addressId: number; paymentMethod: PaymentMethod }): Promise<IOrder> => {
  return instance.post('/api/orders', orderData);
};

export const getOrders = (): Promise<IOrder[]> => {
  return instance.get('/api/orders');
};

export const getOrderHistory = (): Promise<IOrder[]> => {
  return instance.get('/api/orders/history');
};

export const getOrderDetails = (orderId: number): Promise<IOrder> => {
  return instance.get(`/api/orders/${orderId}`);
};

export const cancelOrder = (orderId: number): Promise<{ success: boolean }> => {
  return instance.delete(`/api/orders/${orderId}`);
};

export const updateOrder = (orderId: number, orderStatus: number, trackingNumber: string): Promise<IOrder> => {
  return instance.put(`/api/Orders/${orderId}`, { orderStatus: orderStatus, trackingNumber });
};

export const getMyOrders = (): Promise<IOrder> => {
  return instance.get(`api/Orders/my-orders`);
};

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
}): Promise<{ products: IProduct[]; pagination: { totalItems: number } }> => {
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
  return instance.get(url);
};

export const getProductDetails = (productId: number): Promise<IProduct> => {
  return instance.get(`/api/products/${productId}`);
};

export const createProduct = (formData: FormData): Promise<IProduct> => {
  return instance.post('/api/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Ensure multipart/form-data is set
    },
  });
};

export const updateProduct = (productId: number, formData: FormData): Promise<IProduct> => {
  return instance.put(`/api/products/${productId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Ensure multipart/form-data is set
    },
  });
};

export const deleteProduct = (productId: number): Promise<{ success: boolean }> => {
  return instance.delete(`/api/products/${productId}`);
};

export const searchProducts = (query: string): Promise<{ query: string; totalCount: number; products: IProduct[] }> => {
  return instance.get(`/api/products/search?query=${encodeURIComponent(query)}`);
};

// Product Autocomplete
export const getProductSuggestions = (query: string): Promise<string[]> => {
  return instance.get(`/api/products/autocomplete?query=${encodeURIComponent(query)}`);
};

// Product Reviews
export const addProductReview = (reviewData: { productId: number; rating: number; comment: string }): Promise<any> => {
  return instance.post('/api/products/reviews', reviewData);
};

// Product View Tracking
export const trackProductView = (productId: number): Promise<{ message: string }> => {
  return instance.post(`/api/products/${productId}/track-view`);
};

// Product Recommendations
export const getRecommendationsForUser = (count: number = 6): Promise<{ products: IProduct[]; type: string; count: number }> => {
  return instance.get(`/api/products/recommendations/for-you?count=${count}`);
};

export const getPopularProducts = (count: number = 6): Promise<{ products: IProduct[]; type: string; count: number }> => {
  return instance.get(`/api/products/recommendations/popular?count=${count}`);
};

export const getSimilarProducts = (productId: number, count: number = 6): Promise<{ products: IProduct[]; type: string; count: number }> => {
  return instance.get(`/api/products/${productId}/similar?count=${count}`);
};

export const getRecentlyViewedProducts = (count: number = 6): Promise<{ products: IProduct[]; type: string; count: number }> => {
  return instance.get(`/api/products/recommendations/recently-viewed?count=${count}`);
};

// Cart
export const getCart = (): Promise<any[]> => {
  return instance.get('/api/cart');
};

export const addToCart = (productId: number, quantity: number): Promise<ICart> => {
  return instance.post('/api/Cart/add', { productId, quantity });
};

export const updateCartItem = (cartItemId: number, quantity: number): Promise<ICart> => {
  return instance.put('/api/Cart/update', [{ cartItemId, quantity }]);
};

export const removeFromCart = (cartItemId: number): Promise<{ success: boolean }> => {
  return instance.delete(`/api/Cart/remove/${cartItemId}`);
};

export const clearCart = (): Promise<{ success: boolean }> => {
  return instance.delete('/api/Cart/clear');
};

export const checkoutCart = (): Promise<IOrder> => {
  return instance.post('/api/cart/checkout');
};

export const getCartTotal = (): Promise<{ total: number }> => {
  return instance.get('/api/Cart/total');
};

export const getCartItemCount = (): Promise<{ count: number }> => {
  return instance.get('/api/Cart/count');
};

export const updateCartItemQuantity = (cartItemId: number, quantity: number): Promise<any> => {
  return instance.put(`/api/Cart/${cartItemId}/quantity`, { quantity });
};

export const getCartDetails = (): Promise<ICart> => {
  return instance.get('/api/Cart');
};

// Pricing Rules
export const getPricingRules = (): Promise<IPricingRule[]> => {
  return instance.get('/api/pricing/rules');
};

export const createPricingRule = (ruleData: any): Promise<IPricingRule> => {
  return instance.post('/api/pricing/rules', ruleData);
};

export const updatePricingRule = (ruleId: number, ruleData: IPricingRule): Promise<IPricingRule> => {
  console.log("Updating Pricing Rule:", ruleData);
  return instance.put(`/api/pricing/rules/${ruleId}`, ruleData);
};

export const deletePricingRule = (ruleId: number): Promise<{ success: boolean }> => {
  return instance.delete(`/api/pricing/rules/${ruleId}`);
};

export const applyPricingRule = (cartId: number, ruleId: number): Promise<any> => {
  return instance.post(`/api/cart/${cartId}/apply-rule`, { ruleId });
};

export const removePricingRule = (cartId: number, ruleId: number): Promise<{ success: boolean }> => {
  return instance.delete(`/api/cart/${cartId}/remove-rule/${ruleId}`);
};

export const getPricingRuleDetails = (ruleId: number): Promise<IPricingRule> => {
  return instance.get(`/api/pricing/rules/${ruleId}`);
};

export const getPricingRuleHistory = (): Promise<any[]> => {
  return instance.get('/api/pricing/rules/history');
};

export const getPricingRuleById = (ruleId: number): Promise<IPricingRule> => {
  return instance.get(`/api/pricing/rules/${ruleId}`);
};

// Address APIs
export const createAddress = (addressData: {
  fullName: string;
  streetAddress: string;
  city: string;
  phoneNumber: string;
}): Promise<any> => {
  return instance.post('/api/Address', addressData);
};

export const getUserAddresses = (): Promise<any[]> => {
  return instance.get('/api/Address/user');
};

export const getAddressById = (addressId: number): Promise<any> => {
  return instance.get(`/api/Address/${addressId}`);
};

// Payment APIs
export const createPayment = (paymentData: IPaymentRequest): Promise<IPaymentResponse> => {
  return instance.post('/api/Payment', paymentData);
};

export const getPaymentStatus = (paymentId: number): Promise<IPaymentResponse> => {
  return instance.get(`/api/Payment/${paymentId}`);
};

// VNPay APIs
export const vnpayCallback = (params: any): Promise<any> => {
  return instance.get('/api/Vnpay/Callback', { params });
};

export const vnpayIpnAction = (params: any): Promise<any> => {
  return instance.get('/api/Vnpay/IpnAction', { params });
};

// Report: summary of total revenue and total orders
export const getReportSummary = (startDate: string, endDate: string): Promise<{ totalOrders: number, totalRevenue: number, averageOrderValue: number }> => {
  return instance.get(
    '/api/admin/reports/sales-summary',
    { params: { startDate, endDate } }
  );
};

// Report: best-selling products in a range
export const getBestSellingProducts = (topN: number, startDate: string, endDate: string): Promise<{ products: any[] }> => {
  return instance.get(
    '/api/admin/reports/best-selling-products',
    { params: { topN, startDate, endDate } }
  );
};

// Loyalty Points API
export const getUserLoyaltyInfo = (): Promise<IUserLoyalty> => {
  return instance.get('/api/loyalty/me');
};

export const redeemLoyaltyPoints = (pointsToRedeem: number): Promise<any> => {
  return instance.post('/api/loyalty/redeem', { pointsToRedeem });
};

export const getAllUsersLoyaltyInfo = (): Promise<{ users: IUserSummaryLoyalty[] }> => {
  return instance.get('/api/loyalty/all');
};

export const updateUserLoyaltyPoints = (userId: number, newPointsValue: number): Promise<any> => {
  return instance.put(`/api/loyalty/update/${userId}`, { newPointsValue });
};

export const getDynamicPrice = (productId: number, requestTime?: string): Promise<{
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
}> => {
  const params = new URLSearchParams();
  if (requestTime) {
    params.append('requestTime', requestTime);
  }
  return instance.get(`/api/pricing/products/${productId}/price?${params.toString()}`);
};