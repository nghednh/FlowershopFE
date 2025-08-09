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
    const { cartItems, isLoading, removeFromCart, updateCartItem } = useCart();
    // Calculate subtotal using dynamic price
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const navigate = useNavigate();

    if (!isOpen) return null;

    // Check if user is logged in
    const user = localStorage.getItem('user');
    const isLoggedIn = user && user !== 'null';

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
        if (!isLoggedIn) {
            if (window.confirm('Please sign in to proceed to checkout. Would you like to go to the login page?')) {
                onClose();
                navigate('/login');
            }
            return;
        }
        
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
            <div className="shopping-cart enhanced-cart">
                <div className="cart-header gradient-header">
                    <h2 style={{
                        background: 'linear-gradient(90deg, #db2777 0%, #7c3aed 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 800,
                        fontSize: '2rem',
                        letterSpacing: '2px',
                        margin: 0
                    }}>🛒 Shopping Cart</h2>
                    <button onClick={onClose} className="close-button" style={{ background: 'none', border: 'none' }}>
                        <img src="/close-button.svg" style={{ filter: 'drop-shadow(0 0 4px #db2777)' }} />
                    </button>
                </div>

                {isLoading ? (
                    <div className="cart-loading" style={{ textAlign: 'center', padding: '40px', color: '#7c3aed', fontWeight: 600, fontSize: '1.2rem' }}>
                        <span className="loader" style={{ marginRight: 12 }} /> Loading...
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="cart-empty-message" style={{ padding: '40px', textAlign: 'center', background: 'linear-gradient(90deg, #f3e8ff 0%, #fff1f2 100%)', borderRadius: 18 }}>
                        {!isLoggedIn ? (
                            <>
                                <h3>Sign in to view your cart</h3>
                                <p>Please sign in to add items to your cart and make purchases.</p>
                                <button 
                                    onClick={() => { onClose(); navigate('/login'); }}
                                    style={{
                                        marginTop: '20px',
                                        padding: '12px 24px',
                                        background: 'linear-gradient(90deg, #3B82F6 60%, #7c3aed 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontWeight: 600,
                                        boxShadow: '0 2px 12px #7c3aed44',
                                        cursor: 'pointer',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <span role="img" aria-label="login">🔑</span> Sign In
                                </button>
                            </>
                        ) : (
                            <>
                                <h3>Your cart is empty</h3>
                                <p>Add some beautiful flowers to your cart!</p>
                                <button 
                                    onClick={() => { onClose(); navigate('/list'); }}
                                    style={{
                                        marginTop: '20px',
                                        padding: '12px 24px',
                                        background: 'linear-gradient(90deg, #10B981 60%, #db2777 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontWeight: 600,
                                        boxShadow: '0 2px 12px #db277744',
                                        cursor: 'pointer',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <span role="img" aria-label="shop">🌸</span> Shop Now
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        <ul className="cart-items">
                            {cartItems.map(item => (
                                <li key={item.id} className="cart-item">
                                    <div className="cart-item-card" style={{ background: 'linear-gradient(90deg, #f3e8ff 0%, #fff1f2 100%)', border: '1px solid #db2777', boxShadow: '0 2px 12px #db277744' }}>
                                        <img src={item.productImage} alt={item.productName} className="cart-item-image modern" style={{ border: '2px solid #7c3aed', boxShadow: '0 2px 8px #db277722' }} />
                                        <div className="cart-item-wrapper">
                                            <div className="cart-item-details">
                                                <p className="cart-item-name" style={{ fontWeight: 700, color: '#db2777', fontSize: '1.2rem', marginBottom: 8 }}>{item.productName}</p>
                                                <QuantitySelector
                                                    quantity={item.quantity}
                                                    onQuantityChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
                                                    max={99}
                                                    label=""
                                                />
                                                <div className="cart-item-price-section">
                                                    
                                                    {item.price !== item.basePrice ? (
                                                        <>
                                                            <span className="cart-dynamic-price highlight" style={{ color: '#7c3aed', fontWeight: 700, fontSize: '1.1rem' }}>
                                                                ${(item.price * item.quantity).toFixed(2)}
                                                            </span>
                                                            <span className="cart-base-price" style={{ color: '#db2777', textDecoration: 'line-through', fontSize: '1rem' }}>
                                                                ${(item.basePrice * item.quantity).toFixed(2)}
                                                            </span>
                                                            {item.price > item.basePrice && (
                                                                <span className="cart-surcharge-badge animated" style={{ background: 'linear-gradient(90deg, #f39c12 60%, #db2777 100%)', color: 'white', fontWeight: 600 }}>
                                                                    +{Math.round(((item.price - item.basePrice) / item.basePrice) * 100)}%
                                                                </span>
                                                            )}
                                                            {item.price < item.basePrice && (
                                                                <span className="cart-discount-badge animated" style={{ background: 'linear-gradient(90deg, #e74c3c 60%, #db2777 100%)', color: 'white', fontWeight: 600 }}>
                                                                    -{Math.round(((item.basePrice - item.price) / item.basePrice) * 100)}%
                                                                </span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="cart-item-price highlight" style={{ color: '#db2777', fontWeight: 700, fontSize: '1.1rem' }}>
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                className="remove-button modern"
                                                onClick={() => removeFromCart(item.id)}
                                                title="Remove from cart"
                                                style={{ background: 'linear-gradient(90deg, #ffe4e6 60%, #f3e8ff 100%)' }}
                                            >
                                                <img src="/close-button.svg" alt="Remove" style={{ width: 24, height: 24, filter: 'drop-shadow(0 0 4px #db2777)' }} />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="cart-total" style={{ background: 'linear-gradient(90deg, #f3e8ff 0%, #fff1f2 100%)', borderRadius: 18, margin: '24px 0' }}>
                            <p className="total-label" style={{ color: '#7c3aed', fontWeight: 700, fontSize: '1.2rem' }}>Subtotal:</p>
                            <p className="total-amount" style={{ color: '#db2777', fontWeight: 800, fontSize: '1.4rem' }}>${totalAmount.toFixed(2)}</p>
                        </div>
                        <div className="gift-message" style={{ background: '#f3f4f6', borderRadius: 18, margin: '24px 0' }}>
                            <textarea id="giftMessage" placeholder="Write your message here..." style={{ borderRadius: 10, background: '#fff1f2', border: '1px solid #db2777', padding: 12, fontSize: 15, resize: 'vertical', minHeight: 60 }} />
                        </div>
                        <div className="cart-caption" style={{ background: 'linear-gradient(90deg, #f3e8ff 0%, #fff1f2 100%)', borderRadius: 18, margin: '24px 0', color: '#7c3aed', fontWeight: 600 }}>
                            <p>Shipping & taxes calculated at checkout</p>
                            <p>Free standard shipping within Kyiv</p>
                        </div>
                        <button
                            className="checkout-button"
                            onClick={handleCheckout}
                            disabled={cartItems.length === 0}
                            style={{ background: 'linear-gradient(90deg, #db2777 60%, #7c3aed 100%)', color: 'white', fontWeight: 700, fontSize: '1.2rem', borderRadius: 14, boxShadow: '0 2px 12px #db277744', padding: '24px 0', margin: '24px 0', textTransform: 'uppercase', letterSpacing: '2px', border: 'none', cursor: 'pointer' }}
                        >
                            <span role="img" aria-label="checkout">💳</span> Check out
                        </button>
                    </>
                )}
            </div>
        </>
    );
};

export default ShoppingCart;
