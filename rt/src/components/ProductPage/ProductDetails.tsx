import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import QuantitySelector from '../QuantitySelector';
import './ProductPage.css';

interface ProductDetailsProps {
    id: number;
    name: string;
    description?: string;
    category: string;
    price: number;
    basePrice: number;
    stockQuantity: number;
    discountPercentage: number;
    hasDiscount: boolean;
    hasSurcharge?: boolean;
    imageUrls: string[];
    onVaseSelect?: (vaseImageUrl: string) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
    name,
    id,
    description,
    category,
    price,
    basePrice,
    stockQuantity,
    discountPercentage,
    hasDiscount,
    hasSurcharge,
    imageUrls,
    onVaseSelect
}) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedOption, setSelectedOption] = useState('oneTime');
    const [addToCartSuccess, setAddToCartSuccess] = useState(false);
    const [addToCartError, setAddToCartError] = useState<string | null>(null);

    const { addItemToCart, isLoading } = useCart();

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

    const isOutOfStock = stockQuantity === 0;

    const handleAddToCart = async () => {
        if (isOutOfStock || isLoading) return;

        setAddToCartError(null);
        setAddToCartSuccess(false);

        try {
            const success = await addItemToCart(id, quantity);
            if (success) {
                setAddToCartSuccess(true);
                // Reset success message after 3 seconds
                setTimeout(() => setAddToCartSuccess(false), 3000);
            } else {
                setAddToCartError('Failed to add item to cart. Please try again.');
            }
        } catch (error) {
            setAddToCartError('An error occurred while adding to cart.');
            console.error('Add to cart error:', error);
        }
    };

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
                    {hasSurcharge && (
                        <>
                            <span className="original-price">${basePrice.toFixed(2)}</span>
                            <span className="surcharge-badge">+{discountPercentage}%</span>
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
                <QuantitySelector
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                    max={stockQuantity}
                    disabled={isOutOfStock}
                    label="Quantity"
                />

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
                        One time purchase. Price ${price}</label>
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

            {/* Success/Error Messages */}
            {addToCartSuccess && (
                <div className="add-to-cart-success">
                    ✅ Item successfully added to cart!
                </div>
            )}
            {addToCartError && (
                <div className="add-to-cart-error">
                    ❌ {addToCartError}
                </div>
            )}

            {/* Add to Basket Button */}
            <button
                className={`add-to-basket-button ${isOutOfStock ? 'disabled' : ''}`}
                disabled={isOutOfStock}
                onClick={handleAddToCart}
            >
                {isOutOfStock ? 'Out of Stock' : 'Add to Basket'}
            </button>
        </div>
    );
};

export default ProductDetails;