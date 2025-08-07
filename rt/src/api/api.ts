// Import all services
import { AuthService } from './auth.api';
import { AdminService } from './admin.api';
import { CategoryService } from './category.api';
import { ProductService } from './product.api';
import { OrderService } from './order.api';
import { CartService } from './cart.api';
import { PricingService } from './pricing.api';
import { AddressService } from './address.api';
import { PaymentService } from './payment.api';
import { ReportService } from './report.api';
import { LoyaltyService } from './loyalty.api';

// Export the API tree structure
export const API = {
  Auth: {
    login: AuthService.loginAccount,
    register: AuthService.registerAccount,
  },
  Admin: {
    getAll: AdminService.getUsers,
    register: AdminService.registerUser,
    updateRole: AdminService.updateUserRole,
  },
  Category: {
    getAll: CategoryService.getCategories,
    create: CategoryService.createCategory,
    update: CategoryService.updateCategory,
    delete: CategoryService.deleteCategory,
  },
  Product: {
    list: ProductService.getProducts,
    details: ProductService.getProductDetails,
    create: ProductService.createProduct,
    update: ProductService.updateProduct,
    delete: ProductService.deleteProduct,
    search: ProductService.searchProducts,
    suggestions: ProductService.getProductSuggestions,
    trackView: ProductService.trackProductView,
    reviews: ProductService.addProductReview,
    recommendForUser: ProductService.getRecommendationsForUser,
    popular: ProductService.getPopularProducts,
    similar: ProductService.getSimilarProducts,
    recentlyViewed: ProductService.getRecentlyViewedProducts,
    dynamicPrice: ProductService.getDynamicPrice,
  },
  Order: {
    create: OrderService.createOrder,
    getAll: OrderService.getOrders,
    history: OrderService.getOrderHistory,
    details: OrderService.getOrderDetails,
    cancel: OrderService.cancelOrder,
    update: OrderService.updateOrder,
    getMyOrders: OrderService.getMyOrders,
  },
  Cart: {
    get: CartService.getCart,
    add: CartService.addToCart,
    update: CartService.updateCartItem,
    remove: CartService.removeFromCart,
    clear: CartService.clearCart,
    checkout: CartService.checkoutCart,
    total: CartService.getCartTotal,
    itemCount: CartService.getCartItemCount,
    updateQuantity: CartService.updateCartItemQuantity,
    details: CartService.getCartDetails,
  },
  Pricing: {
    getRules: PricingService.getPricingRules,
    createRule: PricingService.createPricingRule,
    updateRule: PricingService.updatePricingRule,
    deleteRule: PricingService.deletePricingRule,
    applyRule: PricingService.applyPricingRule,
    removeRule: PricingService.removePricingRule,
    getRuleDetails: PricingService.getPricingRuleDetails,
    getRuleHistory: PricingService.getPricingRuleHistory,
    getRuleById: PricingService.getPricingRuleById,
  },
  Address: {
    create: AddressService.createAddress,
    getUserAddresses: AddressService.getUserAddresses,
    getById: AddressService.getAddressById,
  },
  Payment: {
    create: PaymentService.createPayment,
    getStatus: PaymentService.getPaymentStatus,
    vnpayCallback: PaymentService.vnpayCallback,
    vnpayIpnAction: PaymentService.vnpayIpnAction,
  },
  Report: {
    getSummary: ReportService.getReportSummary,
    getBestSelling: ReportService.getBestSellingProducts,
  },
  Loyalty: {
    getUserInfo: LoyaltyService.getUserLoyaltyInfo,
    redeem: LoyaltyService.redeemLoyaltyPoints,
    getAllUsers: LoyaltyService.getAllUsersLoyaltyInfo,
    updatePoints: LoyaltyService.updateUserLoyaltyPoints,
  },
};

// Export individual services for direct access if needed
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
  LoyaltyService,
};
