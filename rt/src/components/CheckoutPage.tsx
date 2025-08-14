import React, { useState, useEffect } from "react";
import "./CheckoutPage.css";
import { useCart } from "../contexts/CartContext";
import { createOrder, createAddress, createPayment } from "../config/api";
import { useNavigate } from "react-router-dom";
import { IPaymentRequest } from "../types/backend";
import { PaymentMethod, DisplayLanguage, Currency, BankCode } from "../types/backend.d";

interface CartItem {
    id: number;
    imageUrl: string;
    name: string;
    quantity: number;
    price: number;
    basePrice: number;
    dynamicPrice?: number;
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
    const [paymentDetails, setPaymentDetails] = useState<any>(null);
    const [addressData, setAddressData] = useState<AddressData>({
        fullName: '',
        phoneNumber: '',
        streetAddress: '',
        city: '',
        callRecipient: false
    });
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedBankCode, setSelectedBankCode] = useState<BankCode>(BankCode.ANY);

    // Use cart context instead of hardcoded data
    const { cartItems: contextCartItems, totalAmount: contextTotalAmount, refreshCart } = useCart();
    const navigate = useNavigate();

    // Check if cart is empty and redirect
    useEffect(() => {
        if (contextCartItems.length === 0 && !orderSuccess) {
            // Redirect to products page or home if cart is empty
            navigate('/home');
        }
    }, [contextCartItems, orderSuccess, navigate]);

    // Convert context cart items to local format
    const cartItems: CartItem[] = contextCartItems.map(item => ({
        id: item.id,
        imageUrl: item.productImage,
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
        basePrice: item.basePrice
    }));

    const totalAmount = contextTotalAmount;
    // Calculate subtotal using dynamic price
    const dynamicSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Show loading or empty state while checking cart
    if (contextCartItems.length === 0 && !orderSuccess) {
        return (
            <div className="checkout-page enhanced-checkout" style={{ background: 'linear-gradient(90deg, #f3e8ff 0%, #fff1f2 100%)' }}>
                <div className="contact-info">
                    <div className="empty-cart-message" style={{ background: 'linear-gradient(90deg, #f3e8ff 0%, #fff1f2 100%)', borderRadius: 18, padding: 40, textAlign: 'center' }}>
                        <h2 style={{ background: 'linear-gradient(90deg, #db2777 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800, fontSize: '2rem', marginBottom: 12 }}>Your cart is empty</h2>
                        <p style={{ color: '#7c3aed', fontWeight: 600 }}>Please add some items to your cart before proceeding to checkout.</p>
                        <button
                            className="continue-shopping-btn"
                            style={{ marginTop: 20, padding: '12px 24px', background: 'linear-gradient(90deg, #10B981 60%, #db2777 100%)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, boxShadow: '0 2px 12px #db277744', cursor: 'pointer', fontSize: '1rem' }}
                            onClick={() => navigate('/home')}
                        >
                            <span role="img" aria-label="shop">🌸</span> Continue Shopping
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

            // Create order first with initial status (0 - Pending)
            const orderData = {
                cartId: contextCartItems[0].cartId,
                addressId: addressId,
                paymentMethod: paymentMethod,
                paymentId: null, // Will be updated after payment
                status: 0 // Initial status - Pending
            };

            const orderResponse = await createOrder(orderData);
            console.log("Order created successfully:", orderResponse);
            setOrderDetails({ ...orderResponse, totalAmount: dynamicSubtotal + 5.00 });

            if (paymentMethod === PaymentMethod.PayPal) {
                console.log("Processing PayPal payment...");
                await refreshCart();
                setOrderSuccess(true);
                return;
            }

            // For VNPay/PayPal, create payment with the order ID
            const paymentRequest: IPaymentRequest = {
                orderId: orderResponse.id, // Use the created order ID
                paymentId: 0,
                amount: orderResponse.sum + 5.00,
                description: `Order #${orderResponse.id} payment`,
                ipAddress: "",
                method: orderResponse.paymentMethod,
                bankCode: BankCode.ANY, // Default to ANY for now
                createdDate: new Date().toISOString(),
                currency: Currency.VND,
                language: DisplayLanguage.Vietnamese
            };

            const paymentResponse = await createPayment(paymentRequest);
            console.log("Payment created successfully:", paymentResponse);
            setPaymentDetails(paymentResponse.data);

            // If VNPay, redirect to payment URL
            if (!paymentResponse.data)
                throw new Error("Payment creation failed, no payment URL returned");
            if (paymentMethod === PaymentMethod.VNPay && paymentResponse.data.paymentUrl) {
                // Store necessary data in localStorage before redirect
                localStorage.setItem('pendingOrder', JSON.stringify({
                    orderId: orderResponse.id,
                    paymentId: paymentResponse.data.paymentId,
                    cartItems: contextCartItems,
                    totalAmount: totalAmount + 5.00,
                    addressData
                }));

                // Redirect to VNPay
                window.location.href = paymentResponse.data.paymentUrl;
                return;
            }

            // For PayPal, update order status immediately after payment creation
            await refreshCart();
            setOrderSuccess(true);

        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Failed to process payment. Please try again.');
            console.log("Error details:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle return from VNPay
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        console.log("URL Params:", urlParams.toString());
        const vnpResponseCode = urlParams.get('vnp_ResponseCode');
        console.log("VNPay response code:", vnpResponseCode);

        if (vnpResponseCode) {
            handleVNPayReturn(urlParams);
        }
    }, []);

    const handleVNPayReturn = async (urlParams: URLSearchParams) => {
        const responseCode = urlParams.get('vnp_ResponseCode');
        const pendingOrderData = localStorage.getItem('pendingOrder');
        console.log("Pending order data:", pendingOrderData);

        if (!pendingOrderData) {
            alert('Order data not found. Please try again.');
            navigate('/checkout');
            return;
        }

        const orderData = JSON.parse(pendingOrderData);

        if (responseCode === '00') {
            // Payment successful - update order status from 0 to 1
            try {
                console.log("Order updated after successful payment");
                await refreshCart();
                setOrderSuccess(true);
                setOrderDetails({ id: orderData.orderId, totalAmount: dynamicSubtotal + 5.00 });
                localStorage.removeItem('pendingOrder');
            } catch (error) {
                console.error('Error updating order after successful payment:', error);
                alert('Payment successful but order update failed. Please contact support.');
            }
        } else {
            // Payment failed - you might want to update order status to cancelled or delete it
            try {
                alert('Payment failed. Order has been cancelled.');
            } catch (error) {
                console.error('Error cancelling order after failed payment:', error);
            }
            localStorage.removeItem('pendingOrder');
            navigate('/checkout');
        }
    };

    const handlePaymentMethodSelect = (method: PaymentMethod) => {
        setPaymentMethod(method);
    };

    // Success component
    const OrderSuccessMessage = () => (
        <div className="order-success" style={{ background: 'linear-gradient(90deg, #f3e8ff 0%, #fff1f2 100%)', borderRadius: 18, padding: 40, textAlign: 'center' }}>
            <div className="success-icon" style={{ fontSize: 64, marginBottom: 16, color: '#db2777' }}>✅</div>
            <h2 className="success-title" style={{ background: 'linear-gradient(90deg, #db2777 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800, fontSize: '2rem', marginBottom: 24 }}>Order Placed Successfully!</h2>
            <div className="success-details" style={{ background: '#fff1f2', padding: 24, borderRadius: 18, border: '1px solid #db2777', textAlign: 'left', width: '100%', maxWidth: 500, margin: '0 auto' }}>
                <p><strong>Order ID:</strong> {orderDetails?.id}</p>
                                <p><strong>Total Amount:</strong> <span style={{ color: '#db2777', fontWeight: 700 }}>
                                    {orderDetails && orderDetails.totalAmount
                                        ? `$${orderDetails.totalAmount.toFixed(2)}`
                                        : `$${(totalAmount).toFixed(2)}`}
                                </span></p>
                <p><strong>Payment Method:</strong> {
                    paymentMethod === PaymentMethod.COD ? 'Cash on Delivery' :
                        paymentMethod === PaymentMethod.PayPal ? 'PayPal' :
                            paymentMethod === PaymentMethod.VNPay ? 'VNPay' : 'Unknown'
                }</p>
                <p><strong>Delivery Address:</strong> {addressData.fullName}, {addressData.streetAddress}, {addressData.city}</p>
                {paymentMethod === PaymentMethod.COD && (
                    <p className="cod-note" style={{ background: 'linear-gradient(90deg, #e8f5e8 60%, #db2777 100%)', padding: 12, borderRadius: 4, marginTop: 16, fontWeight: 500 }}>💰 You will pay when your order is delivered.</p>
                )}
                {paymentMethod !== PaymentMethod.COD && (
                    <p className="payment-note" style={{ background: 'linear-gradient(90deg, #e8f5e8 60%, #db2777 100%)', padding: 12, borderRadius: 4, marginTop: 16, fontWeight: 500 }}>💳 Payment has been processed successfully.</p>
                )}
            </div>
            <div className="success-actions" style={{ display: 'flex', gap: 16, marginTop: 24, justifyContent: 'center' }}>
                <button
                    className="track-order-btn"
                    style={{ padding: '16px 24px', fontSize: 16, fontWeight: 500, borderRadius: 10, cursor: 'pointer', textTransform: 'uppercase', background: 'linear-gradient(90deg, #db2777 60%, #7c3aed 100%)', color: 'white', border: 'none', boxShadow: '0 2px 12px #db277744' }}
                    onClick={() => window.location.href = `/orders/${orderDetails?.id}`}
                >
                    <span role="img" aria-label="track">📦</span> Track Your Order
                </button>
                <button
                    className="continue-shopping-btn"
                    style={{ padding: '16px 24px', fontSize: 16, fontWeight: 500, borderRadius: 10, cursor: 'pointer', textTransform: 'uppercase', background: 'linear-gradient(90deg, #10B981 60%, #db2777 100%)', color: 'white', border: 'none', boxShadow: '0 2px 12px #db277744' }}
                    onClick={() => window.location.href = '/home'}
                >
                    <span role="img" aria-label="shop">🌸</span> Continue Shopping
                </button>
            </div>
        </div>
    );

    // If order is successful, show success message
    if (orderSuccess) {
        return (
            <div className="checkout-page enhanced-checkout" style={{ background: 'linear-gradient(90deg, #f3e8ff 0%, #fff1f2 100%)' }}>
                <div className="contact-info">
                    <OrderSuccessMessage />
                </div>
                <div className="order-summary">
                    <h2 className="breadcrumb" style={{ background: 'linear-gradient(90deg, #db2777 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800, fontSize: '2rem', marginBottom: 24 }}>Order Confirmation</h2>
                    <div className="order-summary-section">
                        <div className="confirmation-message" style={{ background: 'linear-gradient(90deg, #e8f5e8 0%, #fff1f2 100%)', borderRadius: 18, padding: 40, textAlign: 'center' }}>
                            <h3 style={{ background: 'linear-gradient(90deg, #27ae60 0%, #db2777 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800, fontSize: '1.5rem', marginBottom: 16 }}>Thank you for your purchase!</h3>
                            <p style={{ color: '#7c3aed', fontWeight: 600 }}>Your order has been successfully placed and will be processed shortly.</p>
                            {paymentMethod === PaymentMethod.COD ? (
                                <p style={{ color: '#db2777', fontWeight: 600 }}>Please have the exact amount ready when your order arrives.</p>
                            ) : (
                                <p style={{ color: '#db2777', fontWeight: 600 }}>Payment confirmation will be sent to your email.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Update payment method selection section
    const renderPaymentMethodSelection = () => (
        <div className="payment-options">
            <select
                className="payment-method-select"
                value={paymentMethod}
                onChange={e => handlePaymentMethodSelect(Number(e.target.value))}
            >
                <option value={PaymentMethod.COD}>Cash on Delivery</option>
                <option value={PaymentMethod.PayPal}>PayPal</option>
                <option value={PaymentMethod.VNPay}>VNPay</option>
            </select>

            {paymentMethod === PaymentMethod.VNPay && (
                <select
                    className="bank-code-select"
                    value={selectedBankCode}
                    onChange={e => setSelectedBankCode(Number(e.target.value) as BankCode)}
                >
                    <option value={BankCode.ANY}>Any Bank</option>
                    <option value={BankCode.VNPAYQR}>VNPay QR</option>
                    <option value={BankCode.VNBANK}>VN Bank</option>
                    <option value={BankCode.INTCARD}>International Card</option>
                </select>
            )}
        </div>
    );

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

                        {renderPaymentMethodSelection()}

                        {paymentMethod !== PaymentMethod.COD && (
                            <form className="contact-form" onSubmit={handlePaymentSubmit}>
                                <p className="pay-instructions">
                                    {paymentMethod === PaymentMethod.VNPay
                                        ? "You will be redirected to VNPay to complete your payment."
                                        : "Pay by card. Your payment is secure."
                                    }
                                </p>
                                {paymentMethod === PaymentMethod.PayPal && (
                                    <>
                                        <input type="text" placeholder="Card Number" required />
                                        <div className="card-details">
                                            <input type="date" placeholder="Expiry Date" required />
                                            <input type="text" placeholder="CVV" required />
                                        </div>
                                    </>
                                )}
                                <button type="submit" disabled={isProcessing}>
                                    {isProcessing ? 'Processing...' :
                                        paymentMethod === PaymentMethod.VNPay ? 'Proceed to VNPay' : 'Make Payment'}
                                </button>
                            </form>
                        )}

                        {paymentMethod === PaymentMethod.COD && (
                            <form className="contact-form" onSubmit={handlePaymentSubmit}>
                                <p className="pay-instructions">You will pay when your order is delivered.</p>
                                <button type="submit" disabled={isProcessing}>
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
                            <li key={item.id} className="checkout-cart-item" style={{ background: 'linear-gradient(90deg, #f3e8ff 0%, #fff1f2 100%)', borderRadius: 18, border: '1px solid #db2777', boxShadow: '0 2px 12px #db277744', marginBottom: 18 }}>
                                <img src={item.imageUrl} alt={item.name} className="checkout-cart-item-image" style={{ border: '2px solid #7c3aed', boxShadow: '0 2px 8px #db277722' }} />
                                <div className="checkout-cart-item-wrapper">
                                    <div className="checkout-cart-item-details">
                                        <p className="checkout-cart-item-name" style={{ fontWeight: 700, color: '#db2777', fontSize: '1.2rem', marginBottom: 8 }}>{item.name}</p>
                                        <p className="checkout-cart-item-quantity" style={{ color: '#7c3aed', fontWeight: 600 }}>Quantity: {item.quantity}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {item.price !== item.basePrice ? (
                                            <>
                                                <span style={{ color: '#7c3aed', fontWeight: 700, fontSize: '1.1rem' }}>
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                                <span style={{ color: '#db2777', textDecoration: 'line-through', fontSize: '1rem' }}>
                                                    ${(item.basePrice * item.quantity).toFixed(2)}
                                                </span>
                                                {item.price > item.basePrice && (
                                                    <span style={{ background: 'linear-gradient(90deg, #f39c12 60%, #db2777 100%)', color: 'white', fontWeight: 600, padding: '2px 6px', borderRadius: 3, fontSize: 12 }}>
                                                        +{Math.round(((item.price - item.basePrice) / item.basePrice) * 100)}%
                                                    </span>
                                                )}
                                                {item.price < item.basePrice && (
                                                    <span style={{ background: 'linear-gradient(90deg, #e74c3c 60%, #db2777 100%)', color: 'white', fontWeight: 600, padding: '2px 6px', borderRadius: 3, fontSize: 12 }}>
                                                        -{Math.round(((item.basePrice - item.price) / item.basePrice) * 100)}%
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <span style={{ color: '#db2777', fontWeight: 700, fontSize: '1.1rem' }}>
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
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
                            <span className="order-summary-price">${dynamicSubtotal.toFixed(2)}</span>
                        </div>
                        <div className="order-summary-row">
                            <span className="order-summary-text">Shipping</span>
                            <span className="order-summary-price">$5.00

                            </span>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="order-summary-sub-section-total">
                        <div className="order-summary-row">
                            <span className="order-summary-text-total">Total</span>
                                                        <span className="order-summary-price-total">
                                                            {orderSuccess && orderDetails && orderDetails.totalAmount
                                                                ? `$${orderDetails.totalAmount.toFixed(2)}`
                                                                : `$${(dynamicSubtotal + 5.00).toFixed(2)}`}
                                                        </span>
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
