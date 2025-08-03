export interface IBackendRes<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: string[];
    statusCode?: number;
}

export interface ICategory {
    id: number;
    name: string;
    description?: string;
}

export interface IProduct {
    id: number;
    name: string;
    flowerStatus: number;
    description?: string;
    basePrice: number;
    condition?: string;
    stockQuantity: number;
    isActive?: boolean;
    imageUrls: string[];
    categories: ICategory[];
    reviews?: IReview[];
}

export interface ICartItem {
    id: number;
    cartId: number;
    productId: number;
    productName?: string;
    price: number;
    quantity: number;
    subTotal: number;
    productImage?: string;
}

export interface ICart {
    id: number;
    userId: number;
    userName?: string;
    cartItems?: ICartItem[];
    totalAmount: number;
    totalItems: number;
}

export enum PaymentMethod {
    COD,        // Cash on Delivery
    PayPal,
    VNPay
}

export enum BankCode {
    ANY,
    VNPAYQR,
    VNBANK,
    INTCARD
}

export enum Currency {
    VND
}

export enum DisplayLanguage {
    Vietnamese,
    English
}

export interface IPaymentRequest {
    orderId: number;
    paymentId: number;
    amount: number;
    description?: string | null;
    ipAddress?: string | null;
    method: PaymentMethod;
    bankCode: BankCode;
    createdDate: string; // ISO date-time string
    currency: Currency;
    language: DisplayLanguage;
}

export interface IOrder {
    id: number;
    userId: number;
    cartId: number;
    addressId: number;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    status: string;
    createdAt: string; // ISO date-time string
    updatedAt?: string; // ISO date-time string
}

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password?: string; // Optional for editing existing users
    confirmPassword?: string; // Optional for editing existing users
    phoneNumber?: string | null;
    roles: string[];
    isActive?: boolean;
}

export interface IPricingRule {
    pricingRuleId: number;
    description: string;
    condition?: string | null;
    specialDay?: string | null;
    startTime?: string | null; // $date-span
    endTime?: string | null;   // $date-span
    startDate?: string | null; // ISO date-time string
    endDate?: string | null;   // ISO date-time string
    priceMultiplier: number;
    fixedPrice?: number | null;
    priority: number;
    productIds?: number[] | null;
}

export interface IAddress {
    id: number;
    firstName?: string | null;
    lastName?: string | null;
    streetAddress?: string | null;
    country?: string | null;
    city?: string | null;
    zipCode?: string | null;
    applicationUserId?: number | null;
}

export interface IReview {
    id: number;
    rating: number;
    comment: string;
    userId: number;
    userName: string;
    createdAt: string; // ISO date-time string
}

export interface ILoyaltyTransaction {
    id: number;
    pointsChange: number;
    description: string;
    createdAt: string; // ISO date-time string
}

export interface IUserLoyalty {
    currentPoints: number;
    transactions: ILoyaltyTransaction[];
}

export interface IUserSummaryLoyalty {
    id: number;
    userName: string;
    email: string;
    loyaltyPoints: number;
}