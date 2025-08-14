// Re-export the new API structure for backward compatibility
// This file now serves as a bridge between the old and new API structure

import { 
  AuthService,
  AdminService,
  CategoryService,
  ProductService,
  OrderService,
  CartService,
  PricingService,
  AddressService,
  PaymentService,
  ReportService,
  LoyaltyService,
  API 
} from "../api";

// Export the main API tree
export { API };

// Export individual services
export {
  AuthService,
  AdminService,
  CategoryService,
  ProductService,
  OrderService,
  CartService,
  PricingService,
  AddressService,
  PaymentService,
  ReportService,
  LoyaltyService
};

// Backward compatibility - re-export all individual functions with their original names
// Auth
export const loginAccount = AuthService.loginAccount;
export const registerAccount = AuthService.registerAccount;
export const logoutAccount = AuthService.logoutAccount;

// User
export const registerUser = AdminService.registerUser;
export const getUsers = AdminService.getUsers;
export const updateUserRole = AdminService.updateUserRole;

// Category
export const getCategories = CategoryService.getCategories;
export const createCategory = CategoryService.createCategory;
export const updateCategory = CategoryService.updateCategory;
export const deleteCategory = CategoryService.deleteCategory;

// Order
export const createOrder = OrderService.createOrder;
export const getOrders = OrderService.getOrders;
export const getOrderHistory = OrderService.getOrderHistory;
export const getOrderDetails = OrderService.getOrderDetails;
export const cancelOrder = OrderService.cancelOrder;
export const updateOrder = OrderService.updateOrder;
export const getMyOrders = OrderService.getMyOrders;

// Product
export const getProducts = ProductService.getProducts;
export const getProductDetails = ProductService.getProductDetails;
export const createProduct = ProductService.createProduct;
export const updateProduct = ProductService.updateProduct;
export const deleteProduct = ProductService.deleteProduct;
export const searchProducts = ProductService.searchProducts;
export const getProductSuggestions = ProductService.getProductSuggestions;
export const addProductReview = ProductService.addProductReview;
export const trackProductView = ProductService.trackProductView;
export const getRecommendationsForUser = ProductService.getRecommendationsForUser;
export const getPopularProducts = ProductService.getPopularProducts;
export const getSimilarProducts = ProductService.getSimilarProducts;
export const getRecentlyViewedProducts = ProductService.getRecentlyViewedProducts;
export const getDynamicPrice = ProductService.getDynamicPrice;

// Cart
export const getCart = CartService.getCart;
export const addToCart = CartService.addToCart;
export const updateCartItem = CartService.updateCartItem;
export const removeFromCart = CartService.removeFromCart;
export const clearCart = CartService.clearCart;
export const checkoutCart = CartService.checkoutCart;
export const getCartTotal = CartService.getCartTotal;
export const getCartItemCount = CartService.getCartItemCount;
export const updateCartItemQuantity = CartService.updateCartItemQuantity;
export const getCartDetails = CartService.getCartDetails;

// Pricing
export const getPricingRules = PricingService.getPricingRules;
export const createPricingRule = PricingService.createPricingRule;
export const updatePricingRule = PricingService.updatePricingRule;
export const deletePricingRule = PricingService.deletePricingRule;
export const applyPricingRule = PricingService.applyPricingRule;
export const removePricingRule = PricingService.removePricingRule;
export const getPricingRuleDetails = PricingService.getPricingRuleDetails;
export const getPricingRuleHistory = PricingService.getPricingRuleHistory;
export const getPricingRuleById = PricingService.getPricingRuleById;

// Address
export const createAddress = AddressService.createAddress;
export const getUserAddresses = AddressService.getUserAddresses;
export const updateAddress = AddressService.updateAddress;
export const getAddressById = AddressService.getAddressById;

// Payment
export const createPayment = PaymentService.createPayment;
export const getPaymentStatus = PaymentService.getPaymentStatus;
export const vnpayCallback = PaymentService.vnpayCallback;
export const vnpayIpnAction = PaymentService.vnpayIpnAction;

// Report
export const getReportSummary = ReportService.getReportSummary;
export const getBestSellingProducts = ReportService.getBestSellingProducts;

// Loyalty
export const getUserLoyaltyInfo = LoyaltyService.getUserLoyaltyInfo;
export const redeemLoyaltyPoints = LoyaltyService.redeemLoyaltyPoints;
export const getAllUsersLoyaltyInfo = LoyaltyService.getAllUsersLoyaltyInfo;
export const updateUserLoyaltyPoints = LoyaltyService.updateUserLoyaltyPoints;