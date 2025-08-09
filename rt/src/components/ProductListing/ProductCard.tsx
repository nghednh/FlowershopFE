import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Sparkles, ShoppingCart } from 'lucide-react';
import { IProduct } from '../../types/backend.d';
import { CartService } from '../../api/cart.api';
import { ProductService } from '../../api/product.api';
import { API_BASE_URL } from '../../config';

interface Props {
  product: IProduct;
}


const ProductCard: React.FC<Props> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [dynamicPrice, setDynamicPrice] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  
  const flowerType = product.categories?.map((cat) => cat.name).join(", ");
  
  // Get flower status based on flowerStatus number and stock quantity
  const getFlowerStatusInfo = () => {
    // Based on FlowerList logic:
    // flowerStatus === 0 → "New"
    // flowerStatus === 1 → "Old"  
    // → "Low Stock" (priority condition)
    
    if (product.flowerStatus === 0) {
      return {
        label: 'New',
        bgClass: 'bg-emerald-100/90 text-emerald-700 border-emerald-200',
        icon: '✨'
      };
    } else if (product.flowerStatus === 1) {
      return {
        label: 'Old',
        bgClass: 'bg-amber-100/90 text-amber-700 border-amber-200',
        icon: '🔄'
      };
    } else {
      return {
        label: 'Low Stock',
        bgClass: 'bg-red-100/90 text-red-700 border-red-200',
        icon: '⚠️'
      };
    };
  }
  const statusInfo = getFlowerStatusInfo();
  
  // Handle image URL - ensure it's a complete URL
  const rawImageUrl = product.imageUrls?.[0];
  const imageUrl = rawImageUrl 
    ? (rawImageUrl.startsWith('http') ? rawImageUrl : `${API_BASE_URL}/${rawImageUrl.startsWith('/') ? rawImageUrl : `/${rawImageUrl}`}`)
    : null;
    
  const navigate = useNavigate();

  // Fetch dynamic pricing on component mount
  useEffect(() => {
    const fetchDynamicPrice = async () => {
      try {
        setPriceLoading(true);
        const priceData = await ProductService.getDynamicPrice(product.id);
        console.log(priceData);
        console.log('Dynamic Price Data vs Base Price:', priceData.data?.dynamicPrice, product.basePrice);
        setDynamicPrice(priceData.data?.dynamicPrice || product.basePrice);
      } catch (error) {
        console.error('Failed to fetch dynamic price:', error);
        // Fallback to base price
        setDynamicPrice(product.basePrice);
      } finally {
        setPriceLoading(false);
      }
    };

    fetchDynamicPrice();
  }, [product.id, product.basePrice]);

  const handleCardClick = () => {
    // Track product view
    ProductService.trackProductView(product.id).catch(console.error);
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      setIsAddingToCart(true);
      await CartService.addToCart(product.id, 1);
      
      // Show success feedback (you can replace with toast notification)
      console.log('Product added to cart successfully');
      
      // Optional: Show temporary success state
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 1000);
      
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      setIsAddingToCart(false);
      // Show error feedback (you can replace with toast notification)
      alert('Failed to add product to cart. Please try again.');
    }
  };

  // Calculate rating data
  const averageRating = product.averageRating || 0;
  const reviewCount = product.reviews?.length || 0;
  const displayRating = averageRating > 0 ? averageRating.toFixed(1) : "0.0";

  // Function to render stars with exact percentage fill
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(averageRating);
    const partialStar = averageRating - fullStars;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        // Full star
        stars.push(
          <Star 
            key={i} 
            className="w-4 h-4 text-yellow-400 fill-current transition-all duration-200 hover:scale-110" 
          />
        );
      } else if (i === fullStars && partialStar > 0) {
        // Partial star with gradient fill
        stars.push(
          <div key={i} className="relative w-4 h-4">
            <Star className="w-4 h-4 text-gray-300 absolute" />
            <div 
              className="overflow-hidden absolute"
              style={{ width: `${partialStar * 100}%` }}
            >
              <Star className="w-4 h-4 text-yellow-400 fill-current transition-all duration-200 hover:scale-110" />
            </div>
          </div>
        );
      } else {
        // Empty star
        stars.push(
          <Star 
            key={i} 
            className="w-4 h-4 text-gray-300 transition-all duration-200" 
          />
        );
      }
    }
    return stars;
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:border-pink-200 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Gradient overlay for enhanced visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/0 via-transparent to-purple-50/0 group-hover:from-rose-50/20 group-hover:to-purple-50/20 transition-all duration-500 pointer-events-none z-10"></div>
      
      {/* Image Section with enhanced effects - Fixed height */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50 h-56">
        {imageUrl ? (
          <div className="relative h-full">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              onError={(e) => {
                console.error('Error loading product image:', imageUrl);
                e.currentTarget.src = 'https://via.placeholder.com/400x300/FFDDC1/800000?text=Beautiful+Flower';
              }}
            />
            {/* Image overlay with sparkle effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 flex items-center justify-center relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                ></div>
              ))}
            </div>
            <div className="text-center z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-rose-300 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Sparkles className="w-8 h-8 text-pink-600" />
              </div>
              <p className="text-sm font-medium text-pink-700">Beautiful Flower</p>
            </div>
          </div>
        )}
        
        {/* Enhanced Status Badge */}
        {statusInfo && (
          <div className="absolute top-4 left-4 z-20">
            <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-lg backdrop-blur-sm border ${
              statusInfo.bgClass
            } transition-all duration-300 group-hover:scale-110`}>
              {statusInfo.icon} {statusInfo.label}
            </span>
          </div>
        )}

        {/* Special offer badge */}
        {typeof dynamicPrice === 'number' && typeof product.basePrice === 'number' && dynamicPrice < product.basePrice && (
          <div className="absolute bottom-4 left-4 z-20">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
              Special Deal
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Content Section - Fixed height structure */}
      <div className="p-6 relative z-20 h-96 flex flex-col">
        {/* Title and Category with improved styling - Fixed height */}
        <div className="h-20 mb-4">
          <div className="mb-2">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-pink-600 transition-colors duration-300 line-clamp-2 leading-snug mb-2 h-12 overflow-hidden">
              {product.name}
            </h3>
            <div className="w-full h-6 flex items-center">
              {flowerType && (
                <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 rounded-full border border-pink-200">
                  {flowerType}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Rating with animation - Fixed height */}
        <div className="h-16 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-0.5">
              {renderStars()}
            </div>
            <span className="text-sm text-gray-500 font-medium">({displayRating})</span>
          </div>
          <div className="text-xs text-gray-400">
            {reviewCount > 0 ? `${reviewCount} review${reviewCount !== 1 ? 's' : ''}` : 'No reviews yet'}
          </div>
        </div>

        {/* Enhanced Stock Status with better colors - Fixed height */}
        <div className="h-8 mb-4">
          {product.stockQuantity !== undefined ? (
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                product.stockQuantity > 10 ? 'bg-green-500 animate-pulse' :
                product.stockQuantity > 0 ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
              }`}></div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                product.stockQuantity > 10 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : product.stockQuantity > 0
                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {product.stockQuantity > 10 
                  // ? '✅ In Stock' 
                  ? `✅ ${product.stockQuantity} in Stock`
                  : product.stockQuantity > 0 
                  ? `⚡ Only ${product.stockQuantity} left`
                  : '❌ Out of Stock'
                }
              </span>
            </div>
          ) : (
            <div></div>
          )}
        </div>

        {/* Enhanced Price and Action Section - Fixed height, positioned at bottom */}
        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="h-16 mb-3">
            <div className="flex flex-col gap-1 mb-1">
              {priceLoading ? (
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <>
                  {typeof dynamicPrice === 'number' && typeof product.basePrice === 'number' && dynamicPrice !== product.basePrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                        ${dynamicPrice.toFixed(2)}
                      </span>
                      <span className="text-lg text-gray-400 line-through mx-2">
                        ${product.basePrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-green-600 font-semibold">
                        -${(product.basePrice - dynamicPrice).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      ${((typeof dynamicPrice === 'number' ? dynamicPrice : product.basePrice) || 0).toFixed(2)}
                    </span>
                  )}
                </>
              )}
            </div>
            {dynamicPrice && dynamicPrice < product.basePrice && (
              <div className="text-xs text-green-600 font-medium">
                Save ${(product.basePrice - dynamicPrice).toFixed(2)} ({(((product.basePrice - dynamicPrice) / product.basePrice) * 100).toFixed(0)}% off)
              </div>
            )}
            {dynamicPrice && dynamicPrice > product.basePrice && (
              <div className="text-xs text-orange-600 font-medium">
                +${(dynamicPrice - product.basePrice).toFixed(2)} (Peak pricing)
              </div>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <div className="h-10">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stockQuantity <= 0}
              className={`w-full h-full flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 ${
                product.stockQuantity <= 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isAddingToCart
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
              }`}
            >
              {isAddingToCart ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </>
              ) : product.stockQuantity <= 0 ? (
                <span>Out of Stock</span>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hover shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
      </div>
    </div>
  );
};

export default ProductCard;
