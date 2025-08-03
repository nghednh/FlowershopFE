import React, { useState, useEffect } from "react";
import "./CheckoutPage.css";
import { useCart } from "../contexts/CartContext";
import { createOrder, clearCart, createAddress } from "../config/api";
import { useNavigate } from "react-router-dom";

export enum PaymentMethod {
    COD,        // Cash on Delivery
    PayPal,
    VNPay
}

interface CartItem {
    id: number;
    imageUrl: string;
    name: string;
    quantity: number;
    price: number;
}

interface AddressData {
    fullName: string;
    phoneNumber: string;
    streetAddress: string;
    city: string;
    callRecipient: boolean;
}

const CheckoutPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(2);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [addressData, setAddressData] = useState<AddressData>({
        fullName: '',
        phoneNumber: '',
        streetAddress: '',
        city: '',
        callRecipient: false
    });
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
    const [isProcessing, setIsProcessing] = useState(false);

    // Use cart context instead of hardcoded data
    const { cartItems: contextCartItems, totalAmount: contextTotalAmount, refreshCart } = useCart();
    const navigate = useNavigate();

    // Check if cart is empty and redirect
    useEffect(() => {
        if (contextCartItems.length === 0 && !orderSuccess) {
            // Redirect to products page or home if cart is empty
            navigate('/products');
        }
    }, [contextCartItems, orderSuccess, navigate]);

    // Convert context cart items to local format
    const cartItems: CartItem[] = contextCartItems.map(item => ({
        id: item.id,
        imageUrl: item.productImage,
        name: item.productName,
        quantity: item.quantity,
        price: item.price
    }));

    const totalAmount = contextTotalAmount;

    // Show loading or empty state while checking cart
    if (contextCartItems.length === 0 && !orderSuccess) {
        return (
            <div className="checkout-page">
                <div className="contact-info">
                    <div className="empty-cart-message">
                        <h2>Your cart is empty</h2>
                        <p>Please add some items to your cart before proceeding to checkout.</p>
                        <button 
                            className="continue-shopping-btn"
                            onClick={() => navigate('/home')}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const goToStep = (step: number) => {
        setCurrentStep(step);
    };

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleNextStep();
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            // First create address
            const addressResponse = await createAddress({
                fullName: addressData.fullName,
                phoneNumber: addressData.phoneNumber,
                streetAddress: addressData.streetAddress,
                city: addressData.city,
            });
            const addressId = addressResponse.id;

            // Create order
            const orderData = {
                cartId: contextCartItems[0].cartId,
                addressId: addressId,
                paymentMethod: paymentMethod
            };

            const orderResponse = await createOrder(orderData);
            console.log("Order created successfully:", orderResponse);

            // Set success state
            setOrderSuccess(true);
            setOrderDetails(orderResponse);

        } catch (error) {
            console.error('Error creating order:', error);
            console.error("Error status:", error.response?.status);
            console.error("Error data:", error.response?.data);
            console.error("Error config:", error.config?.data);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaymentMethodSelect = (method: PaymentMethod) => {
        setPaymentMethod(method);
    };

    // Success component
    const OrderSuccessMessage = () => (
        <div className="order-success">
            <div className="success-icon">✅</div>
            <h2 className="success-title">Order Placed Successfully!</h2>
            <div className="success-details">
                <p><strong>Order ID:</strong> {orderDetails?.id}</p>
                <p><strong>Total Amount:</strong> ${(totalAmount + 5.00).toFixed(2)}</p>
                <p><strong>Payment Method:</strong> {
                    paymentMethod === PaymentMethod.COD ? 'Cash on Delivery' :
                        paymentMethod === PaymentMethod.PayPal ? 'PayPal' :
                            paymentMethod === PaymentMethod.VNPay ? 'VNPay' : 'Unknown'
                }</p>
                <p><strong>Delivery Address:</strong> {addressData.fullName}, {addressData.streetAddress}, {addressData.city}</p>
                {paymentMethod === PaymentMethod.COD && (
                    <p className="cod-note">💰 You will pay when your order is delivered.</p>
                )}
                {paymentMethod !== PaymentMethod.COD && (
                    <p className="payment-note">💳 Payment has been processed successfully.</p>
                )}
            </div>
            <div className="success-actions">
                <button
                    className="track-order-btn"
                    onClick={() => window.location.href = `/order-tracking/${orderDetails?.id}`}
                >
                    Track Your Order
                </button>
                <button
                    className="continue-shopping-btn"
                    onClick={() => window.location.href = '/'}
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );

    // If order is successful, show success message
    if (orderSuccess) {
        return (
            <div className="checkout-page">
                <div className="contact-info">
                    <OrderSuccessMessage />
                </div>
                <div className="order-summary">
                    <h2 className="breadcrumb">Order Confirmation</h2>
                    <div className="order-summary-section">
                        <div className="confirmation-message">
                            <h3>Thank you for your purchase!</h3>
                            <p>Your order has been successfully placed and will be processed shortly.</p>
                            {paymentMethod === PaymentMethod.COD ? (
                                <p>Please have the exact amount ready when your order arrives.</p>
                            ) : (
                                <p>Payment confirmation will be sent to your email.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            {/* Left Panel: Contact Information and Steps */}
            <div className="contact-info">
                {/* Breadcrumb Navigation */}
                <div className="breadcrumb">
                    <span className={`cursor-pointer ${currentStep === 2 ? 'text-black' : ''}`} onClick={() => goToStep(2)}>Shipping</span>
                    <img src="./breadcrumb-arrow-right.svg" alt="Arrow Right" className="breadcrumb-arrow" />
                    <span className={`cursor-pointer ${currentStep === 3 ? 'text-black' : ''}`} onClick={() => goToStep(3)}>Payment</span>
                </div>

                {currentStep > 2 && (
                    <div className="prev-step-placeholder">
                        <div className="prev-step-container">
                            <div className="prev-step-button" onClick={() => goToStep(2)}>
                                <img src="./tick-icon.svg" alt="Tick Icon" className="tick-icon" />
                                Shipping Details
                            </div>
                            <button className="edit-square-button" onClick={() => goToStep(2)}>
                                <img src="./edit-square-button.svg" alt="Edit Icon" className="edit-icon" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Shipping Details */}
                {currentStep === 2 && (
                    <div className="info-section">
                        <h2 className="info-title">1 Shipping Details</h2>
                        <form className="contact-form" onSubmit={handleAddressSubmit}>
                            <input
                                type="text"
                                placeholder="Recipients Name"
                                value={addressData.fullName}
                                onChange={(e) => setAddressData({ ...addressData, fullName: e.target.value })}
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Recipients Phone number *"
                                value={addressData.phoneNumber}
                                onChange={(e) => setAddressData({ ...addressData, phoneNumber: e.target.value })}
                                required
                            />
                            <div className="address-section">
                                <input
                                    type="text"
                                    placeholder="Street"
                                    value={addressData.streetAddress}
                                    onChange={(e) => setAddressData({ ...addressData, streetAddress: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={addressData.city}
                                    onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="checkbox-section">
                                <input
                                    type="checkbox"
                                    checked={addressData.callRecipient}
                                    onChange={(e) => setAddressData({ ...addressData, callRecipient: e.target.checked })}
                                />
                                I don't know the address, please call the recipient.
                            </div>
                            <button type="submit">Continue to Payment</button>
                        </form>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="info-section">
                        <h2 className="info-title">2 Payment</h2>
                        <p className="pay-instructions">Choose your payment method.</p>

                        {/* Payment Method Selection */}
                        <div className="payment-options">
                            <button
                                className={`payment-option-button ${paymentMethod === PaymentMethod.COD ? 'selected' : ''}`}
                                onClick={() => handlePaymentMethodSelect(PaymentMethod.COD)}
                                type="button"
                            >
                                Cash on Delivery
                            </button>
                            <button
                                className={`payment-option-button ${paymentMethod === PaymentMethod.PayPal ? 'selected' : ''}`}
                                onClick={() => handlePaymentMethodSelect(PaymentMethod.PayPal)}
                                type="button"
                            >
                                <img src="./apple-icon.svg" alt="PayPal" />
                                PayPal
                            </button>
                            <button
                                className={`payment-option-button ${paymentMethod === PaymentMethod.VNPay ? 'selected' : ''}`}
                                onClick={() => handlePaymentMethodSelect(PaymentMethod.VNPay)}
                                type="button"
                            >
                                <img src="./google-icon.svg" alt="VNPay" />
                                VNPay
                            </button>
                        </div>

                        {paymentMethod !== PaymentMethod.COD && (
                            <form className="contact-form" onSubmit={handlePaymentSubmit}>
                                <p className="pay-instructions">Pay by card. Your payment is secure.</p>
                                <input type="text" placeholder="Card Number" required />
                                <div className="card-details">
                                    <input type="date" placeholder="Expiry Date" required />
                                    <input type="text" placeholder="CVV" required />
                                </div>
                                <button type="submit" disabled={isProcessing}>
                                    {isProcessing ? 'Processing...' : 'Make a purchase'}
                                </button>
                            </form>
                        )}

                        {paymentMethod === PaymentMethod.COD && (
                            <form className="contact-form" onSubmit={handlePaymentSubmit}>
                                <p className="pay-instructions">You will pay when your order is delivered.</p>
                                <button type="submit" disabled={isProcessing}
                                >
                                    {isProcessing ? 'Processing...' : 'Place Order'}
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {/* Placeholder for subsequent steps */}
                {currentStep < 3 && (
                    <div className="next-step-placeholder">
                        <button className="next-step-button" onClick={handleNextStep}>
                            2 Payment
                        </button>
                    </div>
                )}
            </div>

            {/* Right Panel: Order Summary */}
            <div className="order-summary">
                <h2 className="breadcrumb">Order Summary</h2>
                <div className="order-summary-section">
                    {/* Product Details */}
                    <ul className="checkout-cart-items">
                        {cartItems.map(item => (
                            <li key={item.id} className="checkout-cart-item">
                                <img src={item.imageUrl} alt={item.name} className="checkout-cart-item-image" />
                                <div className="checkout-cart-item-wrapper">
                                    <div className="checkout-cart-item-details">
                                        <p className="checkout-cart-item-name">{item.name}</p>
                                        <p className="checkout-cart-item-quantity">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="checkout-cart-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Gift Card */}
                    <div className="order-summary-sub-section">
                        <h3 className="order-summary-text">If you have our gift card, enter the code to get discounts</h3>
                        <div className="gift-card-input-wrapper">
                            <input type="text" placeholder="Gift card" className="gift-card-input" />
                            <button className="apply-gift-card-button">Apply</button>
                        </div>
                    </div>

                    {/* Subtotal & Shipping */}
                    <div className="order-summary-sub-section">
                        <div className="order-summary-row">
                            <span className="order-summary-text">Subtotal</span>
                            <span className="order-summary-price">${totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="order-summary-row">
                            <span className="order-summary-text">Shipping</span>
                            <span className="order-summary-price">$5.00</span>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="order-summary-sub-section-total">
                        <div className="order-summary-row">
                            <span className="order-summary-text-total">Total</span>
                            <span className="order-summary-price-total">${(totalAmount + 5.00).toFixed(2)}</span>
                        </div>
                        <div className="secure-checkout">
                            <span className="secure-checkout-text">Secure checkout</span>
                            <img src="./lock-icon.svg" alt="Secure Checkout" className="secure-checkout-icon" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
