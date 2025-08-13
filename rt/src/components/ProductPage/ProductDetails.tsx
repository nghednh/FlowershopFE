import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import QuantitySelector from '../QuantitySelector';
import './ProductPage.css';
import './ProductDetails.css';

interface ProductDetailsProps {
    flowerStatus?: number;
    id: number;
    name: string;
    description?: string;
    category: string;
    finalPrice: number;
    basePrice: number;
    stockQuantity: number;
    discountPercentage: number;
    hasDiscount: boolean;
    hasSurcharge?: boolean;
    imageUrls: string[];
    onVaseSelect?: (vaseImageUrl: string) => void;
    averageRating: number;
    reviewCount: number;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
    name,
    id,
    description,
    category,
    finalPrice,
    basePrice,
    stockQuantity,
    discountPercentage,
    hasDiscount,
    hasSurcharge,
    imageUrls,
    onVaseSelect,
    flowerStatus,
    averageRating: initialAverageRating,
    reviewCount: initialReviewCount
}) => {
    const [quantity, setQuantity] = useState(1);
    const [addToCartSuccess, setAddToCartSuccess] = useState(false);
    const [addToCartError, setAddToCartError] = useState<string | null>(null);
    const [selectedVaseIndex, setSelectedVaseIndex] = useState<number | null>(null);
    const [apiFlowerStatus, setApiFlowerStatus] = useState<number | undefined>(flowerStatus);
    const [averageRating, setAverageRating] = useState<number>(initialAverageRating);
    const [reviewCount, setReviewCount] = useState<number>(initialReviewCount);
    const [ratingLoading, setRatingLoading] = useState(false);
    const [dynamicPrice, setDynamicPrice] = useState<number | null>(null);
    const [priceLoading, setPriceLoading] = useState(false);

    const { addItemToCart, isLoading } = useCart();
    const navigate = useNavigate();

    // Always fetch flowerStatus from API for up-to-date value
    React.useEffect(() => {
        const fetchStatus = async () => {
            try {
                const productData = await import('../../api/product.api').then(mod => mod.ProductService.getProductDetails(id));
                setApiFlowerStatus(productData.flowerStatus);
            } catch (error) {
                setApiFlowerStatus(flowerStatus);
            }
        };
        fetchStatus();
    }, [id, flowerStatus]);

    // Fetch rating data
    const fetchRatingData = React.useCallback(async () => {
        try {
            setRatingLoading(true);
            // @ts-ignore
            const productData = await import('../../api/product.api').then(mod => mod.ProductService.getProductDetails(id));
            setAverageRating(productData.averageRating || 0);
            setReviewCount(productData.reviews ? productData.reviews.length : 0);
        } catch (error) {
            // Keep initial values on error
            setAverageRating(initialAverageRating);
            setReviewCount(initialReviewCount);
        } finally {
            setRatingLoading(false);
        }
    }, [id, initialAverageRating, initialReviewCount]);

    React.useEffect(() => {
        fetchRatingData();
    }, [fetchRatingData]);

    // Fetch dynamic price
    React.useEffect(() => {
        const fetchDynamicPrice = async () => {
            try {
                setPriceLoading(true);
                // @ts-ignore
                const priceData = await import('../../api/product.api').then(mod => mod.ProductService.getDynamicPrice(id));
                setDynamicPrice(priceData.data?.dynamicPrice || basePrice);
            } catch (error) {
                setDynamicPrice(basePrice);
            } finally {
                setPriceLoading(false);
            }
        };
        fetchDynamicPrice();
    }, [id, basePrice]);

    // Event handlers
    const handleBack = () => {
        navigate('/list');
    };

    const handleViewAllReviews = () => {
        navigate(`/review/${id}`);
    };

    const handleVaseClick = (vaseImageUrl: string, index: number) => {
        setSelectedVaseIndex(index);
        if (onVaseSelect) {
            onVaseSelect(vaseImageUrl);
        }
    };

    const handleAddToCart = async () => {
        if (isOutOfStock || isLoading) return;

        setAddToCartError(null);
        setAddToCartSuccess(false);

        try {
            const success = await addItemToCart(id, quantity);
            if (success) {
                setAddToCartSuccess(true);
                setTimeout(() => setAddToCartSuccess(false), 3000);
            } else {
                setAddToCartError('Failed to add item to cart. Please try again.');
            }
        } catch (error) {
            setAddToCartError('An error occurred while adding to cart.');
            console.error('Add to cart error:', error);
        }
    };

    const handleReviewSubmitted = () => {
        fetchRatingData();
    };

    // Computed values
    const isOutOfStock = stockQuantity === 0;
    const flowerType = category;
    const displayRating = averageRating > 0 ? averageRating.toFixed(1) : "0.0";

    // Status badge logic
    const getFlowerStatusInfo = () => {
        if (typeof apiFlowerStatus === 'number') {
            if (apiFlowerStatus === 0) {
                return { label: 'New', className: 'status-new', icon: '✨' };
            } else if (apiFlowerStatus === 1) {
                return { label: 'Old', className: 'status-old', icon: '🔄' };
            } else {
                return { label: 'Low Stock', className: 'status-low-stock', icon: '⚠️' };
            }
        }
        return null;
    };

    const statusInfo = getFlowerStatusInfo();

    // Render stars
    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(averageRating);
        const partialStar = averageRating - fullStars;
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<span key={i} className="star star-full">★</span>);
            } else if (i === fullStars && partialStar > 0) {
                stars.push(<span key={i} className="star star-partial" style={{ opacity: partialStar }}>★</span>);
            } else {
                stars.push(<span key={i} className="star star-empty">★</span>);
            }
        }
        return stars;
    };

    return (
        <div className="product-page-container">
            <div className="product-details enhanced-details">
                {/* Back Button */}
                <button 
                    onClick={handleBack}
                    className="back-button"
                    aria-label="Back to Products"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    <span>Back</span>
                </button>

                {/* Debug info */}
                {typeof (window as any).flowerStatus !== 'undefined' && (
                    <div className="debug-info">
                        flowerStatus: {(window as any).flowerStatus}
                    </div>
                )}

                {/* Gradient overlays */}
                <div className="gradient-overlay" />
                <div className="shine-overlay">
                    <div className="shine-effect"></div>
                </div>

                {/* Product Header */}
                <div className="product-header">
                    <h1 className="product-title">{name}</h1>
                    <div className="badges-container">
                        <span className="category-badge">{flowerType}</span>
                        {statusInfo && (
                            <span className={`status-badge ${statusInfo.className}`}>
                                {statusInfo.icon} {statusInfo.label}
                            </span>
                        )}
                        {dynamicPrice !== null && dynamicPrice < basePrice && (
                            <span className="special-deal-badge">Special Deal</span>
                        )}
                    </div>
                </div>

                {/* Rating Section */}
                <div className="rating-section">
                    {ratingLoading ? (
                        <span className="loading-text">Loading...</span>
                    ) : (
                        <>
                            <div className="stars-container">{renderStars()}</div>
                            <span className="rating-score">({displayRating})</span>
                            <span className="review-count">{reviewCount} reviews</span>
                            <div className="review-actions">
                                {reviewCount > 0 && (
                                    <button 
                                        onClick={handleViewAllReviews}
                                        className="review-action-button view-reviews"
                                    >
                                        📖 View All Reviews
                                    </button>
                                )}
                                <button 
                                    onClick={handleViewAllReviews}
                                    className="review-action-button write-review"
                                >
                                    ✍️ Write a Review
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Product Description */}
                <div className="product-description">{description}</div>

                {/* Price Section */}
                <div className="price-section">
                    {priceLoading ? (
                        <div className="price-loading"></div>
                    ) : (
                        <>
                            {typeof dynamicPrice === 'number' && typeof basePrice === 'number' && dynamicPrice !== basePrice ? (
                                <div className="price-with-discount">
                                    <span className="current-price">
                                        ${dynamicPrice.toFixed(2)}
                                    </span>
                                    <span className="original-price">
                                        ${basePrice.toFixed(2)}
                                    </span>
                                    <span className="savings-amount">
                                        -${(basePrice - dynamicPrice).toFixed(2)}
                                    </span>
                                </div>
                            ) : (
                                <span className="current-price">
                                    ${((typeof dynamicPrice === 'number' ? dynamicPrice : basePrice) || 0).toFixed(2)}
                                </span>
                            )}
                            {hasDiscount && (dynamicPrice === null || dynamicPrice === basePrice) && (
                                <span className="discount-badge">-{discountPercentage}%</span>
                            )}
                            {hasSurcharge && (
                                <span className="surcharge-badge">+{discountPercentage}%</span>
                            )}
                        </>
                    )}
                </div>

                {/* Save amount text */}
                {dynamicPrice !== null && dynamicPrice < basePrice && (
                    <div className="savings-text">
                        Save ${(basePrice - dynamicPrice).toFixed(2)} ({(((basePrice - dynamicPrice) / basePrice) * 100).toFixed(0)}% off)
                    </div>
                )}

                {/* Quantity and Stock */}
                <div className="quantity-and-stock">
                    <QuantitySelector
                        quantity={quantity}
                        onQuantityChange={setQuantity}
                        max={stockQuantity}
                        disabled={isOutOfStock}
                        label="Quantity"
                    />
                    <div className="stock-info">
                        <div className={`stock-indicator ${
                            stockQuantity > 10 ? 'in-stock' : 
                            stockQuantity > 0 ? 'low-stock' : 'out-of-stock'
                        }`}></div>
                        <span className={`stock-text ${
                            stockQuantity > 10 ? 'in-stock' : 
                            stockQuantity > 0 ? 'low-stock' : 'out-of-stock'
                        }`}>
                            {stockQuantity > 10
                                ? `✅ ${stockQuantity} in Stock`
                                : stockQuantity > 0
                                ? `⚡ Only ${stockQuantity} left`
                                : '❌ Out of Stock'}
                        </span>
                    </div>
                </div>

                {/* Vase Selection */}
                <div className="excellent-combination">
                    <div className="excellent-combination-heading">
                        <p className="excellent-combination-title">Excellent Combination with:</p>
                        <p className="excellent-combination-description">Vase Not Included</p>
                    </div>
                    <div className="vase-selection-wrapper">
                        <button className="scroll-arrow" tabIndex={0} aria-label="Scroll left">
                            <img src="/left-arrow.svg" alt="Scroll left" />
                        </button>
                        <div className="vase-selection">
                            {imageUrls.map((vase, index) => (
                                <div
                                    key={index}
                                    className={`vase-item ${selectedVaseIndex === index ? 'selected' : ''}`}
                                    onClick={() => handleVaseClick(vase, index)}
                                    tabIndex={0}
                                    aria-label={`Select vase ${index + 1}`}
                                >
                                    <img src={vase} alt={`Vase ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                        <button className="scroll-arrow" tabIndex={0} aria-label="Scroll right">
                            <img src="/right-arrow.svg" alt="Scroll right" />
                        </button>
                    </div>
                </div>

                {/* Success/Error Messages */}
                <div className="messages-container">
                    {addToCartSuccess && (
                        <div className="message success-message">
                            ✅ Item successfully added to cart!
                        </div>
                    )}
                    {addToCartError && (
                        <div className="message error-message">
                            ❌ {addToCartError}
                        </div>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button
                    className={`add-to-cart-button ${isOutOfStock ? 'disabled' : ''} ${addToCartSuccess ? 'success' : ''}`}
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                >
                    {isOutOfStock ? (
                        <span>Out of Stock</span>
                    ) : isLoading ? (
                        <>
                            <div className="loading-spinner"></div>
                            <span>Adding...</span>
                        </>
                    ) : (
                        <>
                            <img src="/shopping-bag.svg" alt="Basket" className="cart-icon" />
                            <span>Add to Cart</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;