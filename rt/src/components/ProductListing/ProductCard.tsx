import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye, Sparkles } from 'lucide-react';
import { IProduct } from '../../types/backend.d';
import { Button } from "../Button"

interface Props {
  product: IProduct;
}


const ProductCard: React.FC<Props> = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const flowerType = product.categories?.map((cat) => cat.name).join(", ");
  const conditionLabel = product.condition?.toLowerCase() === "new" ? "New" : "Old";
  
  // Handle image URL - ensure it's a complete URL
  const rawImageUrl = product.imageUrls?.[0];
  const imageUrl = rawImageUrl 
    ? (rawImageUrl.startsWith('http') ? rawImageUrl : `https://localhost:5001${rawImageUrl.startsWith('/') ? rawImageUrl : `/${rawImageUrl}`}`)
    : null;
    
  const navigate = useNavigate();

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:border-pink-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay for enhanced visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/0 via-transparent to-purple-50/0 group-hover:from-rose-50/20 group-hover:to-purple-50/20 transition-all duration-500 pointer-events-none z-10"></div>
      
      {/* Image Section with enhanced effects */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50">
        {imageUrl ? (
          <div className="relative">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
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
          <div className="w-full h-56 bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 flex items-center justify-center relative overflow-hidden">
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
        {product.condition && (
          <div className="absolute top-4 left-4 z-20">
            <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-lg backdrop-blur-sm border ${
              product.condition.toLowerCase() === 'new' 
                ? 'bg-emerald-100/90 text-emerald-700 border-emerald-200' 
                : 'bg-amber-100/90 text-amber-700 border-amber-200'
            } transition-all duration-300 group-hover:scale-110`}>
              ✨ {conditionLabel}
            </span>
          </div>
        )}

        {/* Enhanced Quick Actions */}
        <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 z-20 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2.5 rounded-full shadow-lg backdrop-blur-sm border transition-all duration-300 ${
              isLiked 
                ? 'bg-red-500 border-red-600 text-white hover:bg-red-600' 
                : 'bg-white/90 border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-500'
            } hover:scale-110`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:scale-110">
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Special offer badge */}
        {product.basePrice > 50 && (
          <div className="absolute bottom-4 left-4 z-20">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
              Special Deal
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Content Section */}
      <div className="p-6 relative z-20">
        {/* Title and Category with improved styling */}
        <div className="mb-4">
          <div className="mb-2">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-pink-600 transition-colors duration-300 line-clamp-2 leading-snug mb-2">
              {product.name}
            </h3>
            {flowerType && (
              <div className="w-full">
                <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 rounded-full border border-pink-200">
                  {flowerType}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description || "A beautiful flower that will brighten your day with its natural elegance and sweet fragrance."}
        </p>

        {/* Enhanced Rating with animation */}
        <div className="mb-4">
          <div className="flex items-center gap-0.5 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 transition-all duration-200 ${
                  i < 4 
                    ? 'text-yellow-400 fill-current hover:scale-110' 
                    : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
          <div className="text-sm text-gray-500 font-medium mb-1">(4.8)</div>
          <div className="text-xs text-gray-400">127 reviews</div>
        </div>

        {/* Enhanced Stock Status with better colors */}
        {product.stockQuantity !== undefined && (
          <div className="mb-4">
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
                  ? '✅ In Stock' 
                  : product.stockQuantity > 0 
                  ? `⚡ Only ${product.stockQuantity} left`
                  : '❌ Out of Stock'
                }
              </span>
            </div>
          </div>
        )}

        {/* Enhanced Price and Action Section */}
        <div className="pt-2 border-t border-gray-100 space-y-3">
          <div className="w-full">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                ${product.basePrice.toFixed(2)}
              </span>
              {product.basePrice > 50 && (
                <span className="text-sm text-gray-400 line-through">
                  ${(product.basePrice * 1.2).toFixed(2)}
                </span>
              )}
            </div>
            {product.basePrice > 50 && (
              <div className="text-xs text-green-600 font-medium">
                Save ${((product.basePrice * 1.2) - product.basePrice).toFixed(2)}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 w-full">
            <button 
              className="p-2.5 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-600 rounded-xl border border-pink-200 hover:from-pink-200 hover:to-rose-200 hover:border-pink-300 transition-all duration-300 hover:scale-110 shadow-sm"
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
            <Button 
              onClick={() => navigate(`/products/${product.id}`)}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex-1"
            >
              View Details
            </Button>
          </div>
        </div>

        {/* Delivery info */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Free delivery</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>2-3 days</span>
            </div>
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
