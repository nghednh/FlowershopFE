import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import QuantitySelector from '../QuantitySelector';
import ProductReview from './ProductReview'; // Import the new component
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
    flowerStatus
}) => {
    const [quantity, setQuantity] = useState(1);
    // ...existing code...
    const [addToCartSuccess, setAddToCartSuccess] = useState(false);
    const [addToCartError, setAddToCartError] = useState<string | null>(null);

    const { addItemToCart, isLoading } = useCart();

    const [selectedVaseIndex, setSelectedVaseIndex] = useState<number | null>(null);

    // ...existing code...

    // Handle vase selection
    const handleVaseClick = (vaseImageUrl: string, index: number) => {
        setSelectedVaseIndex(index);
        if (onVaseSelect) {
            onVaseSelect(vaseImageUrl);
        }
    };

    const isOutOfStock = stockQuantity === 0;

    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/list');
    };
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

    // Category
    const flowerType = category;

    // Always fetch flowerStatus from API for up-to-date value
    const [apiFlowerStatus, setApiFlowerStatus] = useState<number | undefined>(flowerStatus);
    React.useEffect(() => {
        const fetchStatus = async () => {
            try {
                const productData = await import('../../api/product.api').then(mod => mod.ProductService.getProductDetails(id));
                setApiFlowerStatus(productData.flowerStatus);
            } catch (error) {
                // fallback to prop value
                setApiFlowerStatus(flowerStatus);
            }
        };
        fetchStatus();
    }, [id]);

    // Status badge logic (match ProductCard)
    const getFlowerStatusInfo = () => {
        if (typeof apiFlowerStatus === 'number') {
            if (apiFlowerStatus === 0) {
                return { label: 'New', bg: '#d1fae5', color: '#059669', icon: '✨' };
            } else if (apiFlowerStatus === 1) {
                return { label: 'Old', bg: '#fef3c7', color: '#b45309', icon: '🔄' };
            } else {
                return { label: 'Low Stock', bg: '#fee2e2', color: '#dc2626', icon: '⚠️' };
            }
        }
        return null;
    };
    const statusInfo = getFlowerStatusInfo();

    // Rating and reviews from API
    const [averageRating, setAverageRating] = useState<number>(0);
    const [reviewCount, setReviewCount] = useState<number>(0);
    const [ratingLoading, setRatingLoading] = useState(false);
    const displayRating = averageRating > 0 ? averageRating.toFixed(1) : "0.0";

    const fetchRatingData = React.useCallback(async () => {
        try {
            setRatingLoading(true);
            // @ts-ignore
            const productData = await import('../../api/product.api').then(mod => mod.ProductService.getProductDetails(id));
            setAverageRating(productData.averageRating || 0);
            setReviewCount(productData.reviews ? productData.reviews.length : 0);
        } catch (error) {
            setAverageRating(0);
            setReviewCount(0);
        } finally {
            setRatingLoading(false);
        }
    }, [id]);

    React.useEffect(() => {
        fetchRatingData();
    }, [fetchRatingData]);

    // Callback to refresh rating when a new review is submitted
    const handleReviewSubmitted = () => {
        fetchRatingData();
    };

    // Dynamic price logic: fetch from API
    const [dynamicPrice, setDynamicPrice] = useState<number | null>(null);
    const [priceLoading, setPriceLoading] = useState(false);

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

    // Render stars (copied from ProductCard)
    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(averageRating);
        const partialStar = averageRating - fullStars;
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<span key={i} style={{ color: '#fbbf24', fontSize: '18px', lineHeight: '1' }}>★</span>);
            } else if (i === fullStars && partialStar > 0) {
                stars.push(<span key={i} style={{ color: '#fbbf24', fontSize: '18px', opacity: partialStar, lineHeight: '1' }}>★</span>);
            } else {
                stars.push(<span key={i} style={{ color: '#d1d5db', fontSize: '18px', lineHeight: '1' }}>★</span>);
            }
        }
        return stars;
    };

    return (
        <div className="product-page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <div className="product-details enhanced-details" style={{ background: 'linear-gradient(135deg, #fff1f2 0%, #f3e8ff 100%)', boxShadow: '0 4px 32px #f472b633', borderRadius: '24px', padding: '32px 20px', position: 'relative', overflow: 'hidden', lineHeight: '1.15', minHeight: '70vh', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            {/* Back Arrow Button - upper right corner */}
            <button
                onClick={handleBack}
                style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, background: '#2563eb', borderRadius: '50%', padding: '8px', border: 'none', boxShadow: '0 2px 8px #2563eb33', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Back to Products"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            {/* Debug: Show flowerStatus value for visibility */}
            {typeof (window as any).flowerStatus !== 'undefined' && (
                <div style={{ position: 'absolute', top: 8, right: 16, zIndex: 99, background: '#fffbe6', color: '#db2777', padding: '4px 12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', boxShadow: '0 2px 8px #db277711', border: '1px solid #db2777' }}>
                    flowerStatus: {(window as any).flowerStatus}
                </div>
            )}
                {/* Gradient overlay for shine effect */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, background: 'linear-gradient(90deg, #f3e8ff33 0%, #fff1f2 100%)', opacity: 0.5 }} />
                {/* Shine effect overlay (ProductCard style) */}
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full hover:-translate-x-full transition-transform duration-1000"></div>
                </div>

                {/* Product Name & Category */}
                <div className="product-header" style={{ zIndex: 1, position: 'relative', lineHeight: '1.05', marginBottom: '24px' }}>
                    <h1 className="product-title" style={{ color: '#222', fontWeight: 700, fontSize: '2.1rem', marginBottom: '2px', lineHeight: '1.1' }}>{name}</h1>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 rounded-full border border-pink-200" style={{ display: 'inline-block', lineHeight: '1.1' }}>{flowerType}</span>
                        {/* Always show status badge, even for low stock */}
                        {statusInfo && (
                            <span style={{ background: statusInfo.bg, color: statusInfo.color, padding: '4px 12px', borderRadius: '999px', fontWeight: 'bold', fontSize: '13px', boxShadow: '0 2px 8px #0001', border: `1px solid ${statusInfo.color}`, display: 'inline-block' }}>
                                {statusInfo.icon} {statusInfo.label}
                            </span>
                        )}
                        {/* Special offer badge beside category & status */}
                        {dynamicPrice !== null && dynamicPrice < basePrice && (
                            <span style={{ background: 'linear-gradient(90deg, #f59e42 60%, #db2777 100%)', color: 'white', padding: '2px 10px', borderRadius: '999px', fontWeight: 'bold', fontSize: '13px', marginLeft: '8px', boxShadow: '0 2px 8px #f59e4222' }}>Special Deal</span>
                        )}
                    </div>
                </div>

                {/* Rating and Review Count */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', zIndex: 1, position: 'relative', marginBottom: '16px' }}>
                    {ratingLoading ? (
                        <span style={{ fontSize: '15px', color: '#a1a1aa' }}>Loading...</span>
                    ) : (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>{renderStars()}</div>
                            <span style={{ fontSize: '15px', color: '#a78bfa', fontWeight: 600 }}>({displayRating})</span>
                            <span style={{ fontSize: '13px', color: '#6b7280' }}>{reviewCount} reviews</span>
                        </>
                    )}
                </div>

                {/* Product Description */}
                <div className="product-description" style={{ color: '#444', fontSize: '17px', zIndex: 1, position: 'relative', lineHeight: '1.2', marginBottom: '20px', marginTop: '6px' }}>{description}</div>

                {/* Price Section with dynamic price and badge (ProductCard style) */}
                <div className="price-section" style={{ zIndex: 1, position: 'relative', display: 'flex', alignItems: 'center', gap: '10px', lineHeight: '1.05' }}>
                    {priceLoading ? (
                        <span className="h-8 w-20 bg-gray-200 animate-pulse rounded" style={{ display: 'inline-block' }}></span>
                    ) : (
                        <>
                            {typeof dynamicPrice === 'number' && typeof basePrice === 'number' && dynamicPrice !== basePrice ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                                        ${dynamicPrice.toFixed(2)}
                                    </span>
                                    <span className="text-lg text-gray-400 line-through mx-2">
                                        ${basePrice.toFixed(2)}
                                    </span>
                                    <span className="text-sm text-green-600 font-semibold">
                                        -${(basePrice - dynamicPrice).toFixed(2)}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                                    ${((typeof dynamicPrice === 'number' ? dynamicPrice : basePrice) || 0).toFixed(2)}
                                </span>
                            )}
                            {hasDiscount && (dynamicPrice === null || dynamicPrice === basePrice) && (
                                <span className="discount-badge" style={{ background: '#db2777', color: 'white', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', marginLeft: '4px' }}>-{discountPercentage}%</span>
                            )}
                            {hasSurcharge && (
                                <span className="surcharge-badge" style={{ background: '#f59e42', color: 'white', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', marginLeft: '4px' }}>+{discountPercentage}%</span>
                            )}
                        </>
                    )}
                </div>
                {/* Save text below price row */}
                {dynamicPrice !== null && dynamicPrice < basePrice && (
                    <div className="text-xs text-green-600 font-medium" style={{ marginLeft: '2px', marginBottom: '10px' }}>
                        Save ${(basePrice - dynamicPrice).toFixed(2)} ({(((basePrice - dynamicPrice) / basePrice) * 100).toFixed(0)}% off)
                    </div>
                )}

                {/* Quantity Selector & Stock Info */}
                <div className="quantity-and-stock" style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 1, position: 'relative', marginBottom: '20px' }}>
                    <QuantitySelector
                        quantity={quantity}
                        onQuantityChange={setQuantity}
                        max={stockQuantity}
                        disabled={isOutOfStock}
                        label="Quantity"
                    />
                    <div className="stock-info" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Colored dot */}
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: stockQuantity > 10 ? '#22c55e' : stockQuantity > 0 ? '#facc15' : '#ef4444', marginRight: '4px', boxShadow: '0 0 6px #0002', animation: stockQuantity > 0 ? 'pulse 1.5s infinite' : 'none' }}></div>
                        <span
                            className={`stock-text px-3 py-1 rounded-full font-semibold shadow-sm border transition-all duration-300 ${
                                stockQuantity > 10
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : stockQuantity > 0
                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                    : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: '18px', fontWeight: 600 }}
                        >
                            {stockQuantity > 10
                                ? `✅ ${stockQuantity} in Stock`
                                : stockQuantity > 0
                                ? `⚡ Only ${stockQuantity} left`
                                : '❌ Out of Stock'}
                        </span>
                    </div>
                </div>

                {/* Vase Selection */}
                <div className="excellent-combination" style={{ zIndex: 1, position: 'relative', marginBottom: '20px' }}>
                    <div className="excellent-combination-heading" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <p className="excellent-combination-title" style={{ fontWeight: 600, color: '#db2777' }}>Excellent Combination with:</p>
                        <p className="excellent-combination-description" style={{ color: '#a1a1aa' }}>Vase Not Included</p>
                    </div>
                    <div className="vase-selection-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button className="scroll-arrow" tabIndex={0} aria-label="Scroll left">
                            <img src="/left-arrow.svg" alt="Scroll left" />
                        </button>
                        <div className="vase-selection" style={{ display: 'flex', gap: '16px', flex: 1 }}>
                            {imageUrls.map((vase, index) => (
                                <div
                                    key={index}
                                    className={`vase-item ${selectedVaseIndex === index ? 'selected' : ''}`}
                                    onClick={() => handleVaseClick(vase, index)}
                                    style={{ cursor: 'pointer', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: selectedVaseIndex === index ? '2px solid #db2777' : '2px solid #eee', borderRadius: '12px', boxShadow: selectedVaseIndex === index ? '0 2px 12px #db277755' : '0 1px 4px #eee', transition: 'all 0.2s', background: selectedVaseIndex === index ? '#f3e8ff' : '#fff' }}
                                    tabIndex={0}
                                    aria-label={`Select vase ${index + 1}`}
                                >
                                    <img src={vase} alt={`Vase ${index + 1}`} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: '8px', boxShadow: selectedVaseIndex === index ? '0 2px 8px #db277733' : 'none' }} />
                                </div>
                            ))}
                        </div>
                        <button className="scroll-arrow" tabIndex={0} aria-label="Scroll right">
                            <img src="/right-arrow.svg" alt="Scroll right" />
                        </button>
                    </div>
                </div>

                {/* Success/Error Messages */}
                <div style={{ minHeight: '24px', zIndex: 1, position: 'relative', marginBottom: '20px' }}>
                    {addToCartSuccess && (
                        <div className="add-to-cart-success" style={{ animation: 'fadeIn 0.5s', color: '#22c55e', fontWeight: 'bold', background: '#e7fbe7', borderRadius: '6px', padding: '8px 16px', marginBottom: '8px', boxShadow: '0 2px 8px #22c55e22' }}>
                            ✅ Item successfully added to cart!
                        </div>
                    )}
                    {addToCartError && (
                        <div className="add-to-cart-error" style={{ animation: 'fadeIn 0.5s', color: '#ef4444', fontWeight: 'bold', background: '#fde7e7', borderRadius: '6px', padding: '8px 16px', marginBottom: '8px', boxShadow: '0 2px 8px #ef444422' }}>
                            ❌ {addToCartError}
                        </div>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button
                    className={`add-to-cart-button ${isOutOfStock ? 'disabled' : ''}`}
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    style={{
                        width: '100%',
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        borderRadius: '16px',
                        fontWeight: 'bold',
                        fontSize: '20px',
                        letterSpacing: '0.09em',
                        boxShadow: isOutOfStock ? 'none' : '0 4px 16px #db2777cc',
                        background: isOutOfStock ? '#f3f4f6' : 'linear-gradient(90deg, #db2777 60%, #7c3aed 100%)',
                        color: isOutOfStock ? '#a1a1aa' : 'white',
                        cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        transform: addToCartSuccess ? 'scale(1.05)' : 'scale(1)',
                        marginTop: '20px',
                    }}
                >
                    {isOutOfStock ? (
                        <span>Out of Stock</span>
                    ) : isLoading ? (
                        <>
                            <div style={{ width: '24px', height: '24px', border: '3px solid #fff', borderTop: '3px solid #db2777', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            <span>Adding...</span>
                        </>
                    ) : (
                        <>
                            <img src="/shopping-bag.svg" alt="Basket" style={{ width: '24px', height: '24px' }} />
                            <span>Add to Cart</span>
                        </>
                    )}
                </button>
            </div>

            {/* Product Review Section - Outside the main product details card */}
            <ProductReview
                productId={id}
                productName={name}
                averageRating={averageRating}
                reviewCount={reviewCount}
                onReviewSubmitted={handleReviewSubmitted}
            />
        </div>
    );
};

export default ProductDetails;