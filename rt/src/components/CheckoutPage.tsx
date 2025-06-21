import React, { useState } from "react";
import "./CheckoutPage.css";

interface CartItem {
    id: number;
    imageUrl: string;
    name: string;
    quantity: number;
    price: number;
}

const CheckoutPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    // const [cartItems, setCartItems] = useState([
    //     { id: 1, name: "Item 1", price: 10.00 },
    //     { id: 2, name: "Item 2", price: 20.00 },
    //     { id: 3, name: "Item 3", price: 30.00 }
    // ]);

    // Placeholder cart items
    const cartItems: CartItem[] = [
        {
            id: 1,
            imageUrl: 'https://placehold.co/100x100/FFDDC1/800000?text=Item+1',
            name: 'Rosy Delight Bouquet',
            quantity: 2,
            price: 29.99,
        },
        {
            id: 2,
            imageUrl: 'https://placehold.co/100x100/FFDDC1/800000?text=Item+2',
            name: 'Sunshine Yellow Bouquet',
            quantity: 1,
            price: 24.99,
        },
        {
            id: 3,
            imageUrl: 'https://placehold.co/100x100/FFDDC1/800000?text=Item+3',
            name: 'Elegant White Lily Arrangement',
            quantity: 1,
            price: 34.99,
        },
        {
            id: 4,
            imageUrl: 'https://placehold.co/100x100/FFDDC1/800000?text=Item+4',
            name: 'Vibrant Mixed Flower Basket',
            quantity: 3,
            price: 39.99,
        },
        {
            id: 5,
            imageUrl: 'https://placehold.co/100x100/FFDDC1/800000?text=Item+5',
            name: 'Classic Red Rose Bouquet',
            quantity: 1,
            price: 49.99,
        },
        {
            id: 6,
            imageUrl: 'https://placehold.co/100x100/FFDDC1/800000?text=Item+6',
            name: 'Lavender Bliss Bouquet',
            quantity: 2,
            price: 19.99,
        },
        {
            id: 7,
            imageUrl: 'https://placehold.co/100x100/FFDDC1/800000?text=Item+7',
            name: 'Peach Perfection Arrangement',
            quantity: 1,
            price: 27.99,
        },
        {
            id: 8,
            imageUrl: 'https://placehold.co/100x100/FFDDC1/800000?text=Item+8',
            name: 'Bluebell Beauty Bouquet',
            quantity: 1,
            price: 22.99,
        },
    ];

    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const goToStep = (step: number) => {
        setCurrentStep(step);
    }

    const totalAmount = cartItems.reduce((total, item) => total + item.price, 0);

    return (
        <div className="checkout-page">
            {/* Left Panel: Contact Information and Steps */}
            <div className="contact-info">
                {/* Breadcrumb Navigation */}
                <div className="breadcrumb">
                    <span className={`cursor-pointer ${currentStep === 1 ? 'text-black' : ''}`} onClick={() => goToStep(1)}>Information</span>
                    <img src="./breadcrumb-arrow-right.svg" alt="Arrow Right" className="breadcrumb-arrow" />
                    <span className={`cursor-pointer ${currentStep === 2 ? 'text-black' : ''}`} onClick={() => goToStep(2)}>Shipping</span>
                    <img src="./breadcrumb-arrow-right.svg" alt="Arrow Right" className="breadcrumb-arrow" />
                    <span className={`cursor-pointer ${currentStep === 3 ? 'text-black' : ''}`} onClick={() => goToStep(3)}>Payment</span>
                </div>

                {currentStep > 1 && (
                    <div className="prev-step-placeholder">
                        {currentStep > 1 && (
                            <div className="prev-step-container">
                                <div className="prev-step-button" onClick={() => goToStep(1)}>
                                    <img src="./tick-icon.svg" alt="Tick Icon" className="tick-icon" />
                                    Contact Information
                                </div>
                                <button className="edit-square-button" onClick={() => goToStep(1)}>
                                    <img src="./edit-square-button.svg" alt="Edit Icon" className="edit-icon" />
                                </button>
                            </div>
                        )}

                        {currentStep > 2 && (
                            <div className="prev-step-container">
                                <div className="prev-step-button" onClick={() => goToStep(2)}>
                                    <img src="./tick-icon.svg" alt="Tick Icon" className="tick-icon" />
                                    Shipping Details
                                </div>
                                <button className="edit-square-button" onClick={() => goToStep(2)}>
                                    <img src="./edit-square-button.svg" alt="Edit Icon" className="edit-icon" />
                                </button>
                            </div>
                        )}
                    </div>)}

                {/* Conditional Rendering of Checkout Steps */}
                {currentStep === 1 && (
                    // Step 1: Information
                    <div className="info-section">
                        <h2 className="info-title">1 Contact Information</h2>
                        <form className="contact-form" onSubmit={e => { e.preventDefault(); handleNextStep(); }}>
                            <input type="text" placeholder="Full Name" required />
                            <input type="email" placeholder="Email Address" required />
                            <input type="tel" placeholder="Phone Number" required />
                            <button type="submit"
                                onClick={handleNextStep}
                            >Continue to Shipping</button>
                        </form>
                        {/* Placeholder for subsequent steps */}


                    </div>
                )}

                {/* Step 2: Shipping Details */}
                {currentStep === 2 && (
                    <div className="info-section">
                        <h2 className="info-title">2 Shipping Details</h2>
                        <form className="contact-form" onSubmit={e => {
                            e.preventDefault();
                            handleNextStep();
                        }
                        }>
                            <input type="text" placeholder="Recipients Name" required />
                            <input type="tel" placeholder="Recipients Phone number *" required />
                            <input type="date" required />
                            <input type="time" placeholder="Delivery Time" required />
                            <div className="address-section">
                                <input type="text" placeholder="Street" required />
                                <input type="text" placeholder="Apartment Number" required />
                            </div>
                            <div className="checkbox-section">
                                <input
                                    type="checkbox"

                                />
                                I don't know the address, please call the recipient.
                            </div>
                            <button type="submit"
                                onClick={handleNextStep}
                            >Continue to Payment</button>
                        </form>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="info-section">
                        <h2 className="info-title">3 Payment</h2>
                        <p className="pay-instructions">Pay by card. Your payment is secure.</p>
                        <form className="contact-form" onSubmit={e => {
                            e.preventDefault();
                            // Handle payment submission
                        }}>
                            <input type="text" placeholder="Card Number" required />
                            <div className="card-details">
                                <input type="date" placeholder="Expiry Date" required />
                                <input type="text" placeholder="CVV" required />
                            </div>
                            <button type="submit">Make a purchase</button>
                        </form>
                        <p className="pay-instructions">Or pay using:</p>
                        <div className="payment-options">
                            <button className="payment-option-button">
                                <img src="./apple-icon.svg" alt="Apple Pay" />
                                Apple Pay
                            </button>
                            <button className="payment-option-button">
                                <img src="./google-icon.svg" alt="Google Pay" />
                                Google Pay
                            </button>
                        </div>
                    </div>
                )}

                {/* Placeholder for subsequent steps */}

                {currentStep < 3 && (
                    <div className="next-step-placeholder">
                        {currentStep < 2 && (
                            <button className="next-step-button" onClick={() => goToStep(2
                            )}>
                                2 Shipping details
                            </button>
                        )}

                        {currentStep < 3 && (
                            <button className="next-step-button" onClick={handleNextStep}>
                                3 Payment
                            </button>
                        )}
                    </div>)}

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
