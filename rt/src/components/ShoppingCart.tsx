import React from 'react';
import './ShoppingCart.css';

interface ShoppingCartProps {
    isOpen: boolean;
    onClose: () => void;
}

interface CartItem {
    id: number;
    imageUrl: string;
    name: string;
    quantity: number;
    price: number;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

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

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
                <ul className="cart-items">
                    {cartItems.map(item => (
                        <li key={item.id} className="cart-item">
                            <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                            <div className="cart-item-wrapper">
                                <div className="cart-item-details">
                                    <p className="cart-item-name">{item.name}</p>
                                    <p className="cart-item-quantity">Quantity: {item.quantity}</p>
                                    <p className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <button className="remove-button">
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="cart-total">
                    <p className="total-label">Subtotal:</p>
                    <p className="total-amount">${total.toFixed(2)}</p>
                </div>
                <div className="gift-message">
                    <textarea id="giftMessage" placeholder="Write your message here..." />
                </div>
                <div className="cart-caption">
                    <p>Shipping & taxes calculated at checkout</p>
                    <p>Free standard shipping within Kyiv</p>
                </div>
                <button className="checkout-button">Check out</button>
            </div>
        </>
    );
};

export default ShoppingCart;
