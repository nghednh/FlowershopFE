import React from 'react';
import { useState } from 'react';
import './ProductPage.css';

interface ProductDetailsProps {
    name: string;
    description?: string;
    category: string;
    price: number;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ name, description, category, price }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedOption, setSelectedOption] = useState('oneTime');
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
    }

    const vases = [
        { name: 'Glass Vase', price: 20, image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Vase' },
        { name: 'Hammershol', price: 26, image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Vase' },
        { name: 'Ceramic Vase', price: 50, image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Vase' },
        { name: 'Steel Vase', price: 35, image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Vase' },
        { name: 'Bamboo', price: 15, image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Vase' },
    ];

    return (
        <div className="product-details">
            {/* Breadcrumbs */}
            <p className="breadcrumbs">
                <span className="product-category"> {category} /</span>
                <span className="product-name"> {name}</span>
            </p>

            {/* Product Name & Price */}
            <h1 className="product-title">{name} - ${price.toFixed(2)}</h1>

            {/* Product Description */}
            {description && <p className="product-description">{description}</p>}

            {/* Quantity Selector */}
            <div className="quantity-selector">
                <label htmlFor="quantity" className='quantity-label'>Quantity</label>
                <div className="quantity-input">
                    <button
                        className="quantity-button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                        <img src="/button-minus.svg" />
                    </button>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        min="1"
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="quantity-field"
                    />
                    <button
                        className="quantity-button"
                        onClick={() => setQuantity(quantity + 1)}
                    >
                        <img src="/button-plus.svg" />
                    </button>
                </div>
            </div>

            {/* Excellent Combination with */}
            <div className="excellent-combination">
                <div className="excellent-combination-heading">
                    <p className="excellent-combination-title">Excellent Combination with:</p>
                    <p className="excellent-combination-description">Vase Not Included</p>
                </div>
                <div className="vase-selection-wrapper">
                    <button className="scroll-arrow">
                        <img src="/left-arrow.svg" />
                    </button>
                    <div className="vase-selection">
                        {vases.map((vase, index) => (
                            <div key={index} className="vase-item">
                                <img src={vase.image} alt={vase.name} className="vase-image" />
                                <div className="vase-info">
                                    <p className="vase-name">{vase.name}</p>
                                    <p className="vase-price">${vase.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="scroll-arrow">
                        <img src="/right-arrow.svg" />
                    </button>
                </div>
            </div>

            {/* Price Options */}
            <div className="price-options">
                <p className="price-options-title">Price Options</p>
                <div className="price-option">
                    <input
                        type="radio"
                        id="oneTime"
                        name="priceOption"
                        value="oneTime"
                        checked={selectedOption === 'oneTime'}
                        onChange={handleOptionChange}
                        className="hidden" // Hide the default radio button
                    />
                    <label htmlFor="oneTime" className='price-option'>
                        <img src={selectedOption === 'oneTime' ? "/radio-button-active.svg" : "/radio-button.svg"} />
                        One time purchase. Price $100</label>
                </div>
                <div className="price-option">
                    <input
                        type="radio"
                        id="subscribe"
                        name="priceOption"
                        value="subscribe"
                        checked={selectedOption === 'subscribe'}
                        onChange={handleOptionChange}
                        className="hidden" // Hide the default radio button
                    />
                    <label htmlFor="subscribe" className='price-option'>
                        <img src={selectedOption === 'subscribe' ? "/radio-button-active.svg" : "/radio-button.svg"} />
                        Subscribe now, and save 25% on this order. </label>
                </div>
            </div>

            {/* Add to Basket Button */}
            <button className="add-to-basket-button">
                Add to Basket
            </button>
        </div>
    );
};

export default ProductDetails;