import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ShoppingCart.css';
import { useCart } from '../contexts/CartContext';
import QuantitySelector from './QuantitySelector';

interface ShoppingCartProps {
    isOpen: boolean;
    onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose }) => {
    const { cartItems, totalAmount, isLoading, removeFromCart, updateCartItem } = useCart();
    const navigate = useNavigate();

    if (!isOpen) return null;

    // Add handler for quantity changes
    const handleQuantityChange = async (itemId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            await removeFromCart(itemId);
        } else {
            await updateCartItem(itemId, newQuantity);
        }
    };

    // Add checkout handler
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty. Please add items before checking out.');
            return;
        }
        onClose(); // Close the cart
        navigate('/checkout'); // Navigate to checkout page
    };

    return (
        <>
            <div className="shopping-cart-overlay" onClick={onClose} />
            <div className="shopping-cart">
                <div className="cart-header">
                    <h2>Shopping Cart</h2>
                    <button onClick={onClose} className="close-button">
                        <img src="/close-button.svg" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="cart-loading">Loading...</div>
                ) : (
                    <>
                        <ul className="cart-items">
                            {cartItems.map(item => (
                                <li key={item.id} className="cart-item">
                                    <img src={item.productImage} alt={item.productName} className="cart-item-image" />
                                    <div className="cart-item-wrapper">
                                        <div className="cart-item-details">
                                            <p className="cart-item-name">{item.productName}</p>
                                            <QuantitySelector
                                                quantity={item.quantity}
                                                onQuantityChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
                                                max={99}
                                                label=""
                                            />
                                            <div className="cart-item-price-section">
                                                {item.dynamicPrice && item.dynamicPrice !== item.basePrice ? (
                                                    <>
                                                        <span className="cart-dynamic-price">
                                                            ${(item.dynamicPrice * item.quantity).toFixed(2)}
                                                        </span>
                                                        <span className="cart-base-price">
                                                            ${(item.basePrice * item.quantity).toFixed(2)}
                                                        </span>
                                                        {item.dynamicPrice > item.basePrice && (
                                                            <span className="cart-surcharge-badge">
                                                                +{Math.round(((item.dynamicPrice - item.basePrice) / item.basePrice) * 100)}%
                                                            </span>
                                                        )}
                                                        {item.dynamicPrice < item.basePrice && (
                                                            <span className="cart-discount-badge">
                                                                -{Math.round(((item.basePrice - item.dynamicPrice) / item.basePrice) * 100)}%
                                                            </span>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="cart-item-price">
                                                        ${item.subTotal.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            className="remove-button"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="cart-total">
                            <p className="total-label">Subtotal:</p>
                            <p className="total-amount">${totalAmount.toFixed(2)}</p>
                        </div>
                        <div className="gift-message">
                            <textarea id="giftMessage" placeholder="Write your message here..." />
                        </div>
                        <div className="cart-caption">
                            <p>Shipping & taxes calculated at checkout</p>
                            <p>Free standard shipping within Kyiv</p>
                        </div>
                        <button
                            className="checkout-button"
                            onClick={handleCheckout}
                            disabled={cartItems.length === 0}
                        >
                            Check out
                        </button>
                    </>
                )}
            </div>
        </>
    );
};

export default ShoppingCart;
