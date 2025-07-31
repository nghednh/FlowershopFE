import React from 'react';
import { useState } from 'react';
import './ProductPage.css';

interface ProductDetailsProps {
    name: string;
    description?: string;
    category: string;
    price: number;
    basePrice: number;
    stockQuantity: number;
    discountPercentage: number;
    hasDiscount: boolean;
    imageUrls: string[];
    onVaseSelect?: (vaseImageUrl: string) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
    name,
    description,
    category,
    price,
    basePrice,
    stockQuantity,
    discountPercentage,
    hasDiscount,
    imageUrls,
    onVaseSelect
}) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedOption, setSelectedOption] = useState('oneTime');
    const [selectedVaseIndex, setSelectedVaseIndex] = useState<number | null>(null);

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
    }

    // Handle vase selection
    const handleVaseClick = (vaseImageUrl: string, index: number) => {
        setSelectedVaseIndex(index);
        if (onVaseSelect) {
            onVaseSelect(vaseImageUrl);
        }
    };

    const vases = [
        { name: 'Glass Vase', price: 20, image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Vase' },
        { name: 'Hammershol', price: 26, image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Vase' },
        { name: 'Ceramic Vase', price: 50, image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Vase' },
        { name: 'Steel Vase', price: 35, image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Vase' },
        { name: 'Bamboo', price: 15, image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Vase' },
    ];

    const isOutOfStock = stockQuantity === 0;

    return (
        <div className="product-details">
            {/* Breadcrumbs */}
            <p className="breadcrumbs">
                <span className="product-category"> {category} /</span>
                <span className="product-name"> {name}</span>
            </p>

            {/* Product Name & Price */}
            <div className="product-header">
                <h1 className="product-title">{name}</h1>
                <div className="price-section">
                    <span className="current-price">${price.toFixed(2)}</span>
                    {hasDiscount && (
                        <>
                            <span className="original-price">${basePrice.toFixed(2)}</span>
                            <span className="discount-badge">-{discountPercentage}%</span>
                        </>
                    )}
                </div>
            </div>

            {/* Product Description */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem' }}>
                <div className="product-description">{description}</div>
            </div>

            <div className="quantity-and-stock">
                {/* Quantity Selector */}
                <div className="quantity-selector">
                    <label htmlFor="quantity" className='quantity-label'>Quantity</label>
                    <div className="quantity-input">
                        <button
                            className="quantity-button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={isOutOfStock}
                        >
                            <img src="/button-minus.svg" />
                        </button>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            min="1"
                            max={stockQuantity}
                            onChange={(e) => setQuantity(Math.min(stockQuantity, Math.max(1, Number(e.target.value))))}
                            className="quantity-field"
                            disabled={isOutOfStock}
                        />
                        <button
                            className="quantity-button"
                            onClick={() => setQuantity(Math.min(stockQuantity, quantity + 1))}
                            disabled={isOutOfStock || quantity >= stockQuantity}
                        >
                            <img src="/button-plus.svg" />
                        </button>
                    </div>
                </div>

                {/* Stock Information */}
                <div className="stock-info">
                    <span className={`stock-text ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
                        {isOutOfStock ? 'Out of Stock' : `${stockQuantity} in stock`}
                    </span>
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
                        {imageUrls.map((vase, index) => (
                            <div 
                                key={index} 
                                className={`vase-item ${selectedVaseIndex === index ? 'selected' : ''}`}
                                onClick={() => handleVaseClick(vase, index)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img src={vase} alt={`Vase ${index + 1}`} />
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
                        className="hidden"
                        disabled={isOutOfStock}
                    />
                    <label htmlFor="oneTime" className={`price-option ${isOutOfStock ? 'disabled' : ''}`}>
                        <img src={selectedOption === 'oneTime' ? "/radio-button-active.svg" : "/radio-button.svg"} />
                        One time purchase. Price ${price.toFixed(2)}</label>
                </div>
                <div className="price-option">
                    <input
                        type="radio"
                        id="subscribe"
                        name="priceOption"
                        value="subscribe"
                        checked={selectedOption === 'subscribe'}
                        onChange={handleOptionChange}
                        className="hidden"
                        disabled={isOutOfStock}
                    />
                    <label htmlFor="subscribe" className={`price-option ${isOutOfStock ? 'disabled' : ''}`}>
                        <img src={selectedOption === 'subscribe' ? "/radio-button-active.svg" : "/radio-button.svg"} />
                        Subscribe now, and save 25% on this order. </label>
                </div>
            </div>

            {/* Add to Basket Button */}
            <button
                className={`add-to-basket-button ${isOutOfStock ? 'disabled' : ''}`}
                disabled={isOutOfStock}
            >
                {isOutOfStock ? 'Out of Stock' : 'Add to Basket'}
            </button>
        </div>
    );
};

export default ProductDetails;