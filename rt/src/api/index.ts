// Main API export
export { API } from './api';

// Individual service exports
export { AuthService } from './auth.api';
export { AdminService as UserService } from './admin.api';
export { CategoryService } from './category.api';
export { ProductService } from './product.api';
export { OrderService } from './order.api';
export { CartService } from './cart.api';
export { PricingService } from './pricing.api';
export { AddressService } from './address.api';
export { PaymentService } from './payment.api';
export { ReportService } from './report.api';
export { LoyaltyService } from './loyalty.api';

// Re-export all the original exports for backward compatibility
export * from './auth.api';
export * from './admin.api';
export * from './category.api';
export * from './product.api';
export * from './order.api';
export * from './cart.api';
export * from './pricing.api';
export * from './address.api';
export * from './payment.api';
export * from './report.api';
export * from './loyalty.api';
