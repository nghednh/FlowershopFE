import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './ProductPage/ProductPage.css';
import ProductImageGallery from './ProductPage/ProductImageGallery';
import ProductDetails from './ProductPage/ProductDetails';
import ProductReview from './ProductPage/ProductReview';
import { getProductDetails, getSimilarProducts, getDynamicPrice } from '../config/api';
import { IProduct } from '../types/backend';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentDisplayImage, setCurrentDisplayImage] = useState<string>('');
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [dynamicPrice, setDynamicPrice] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);

  // Review states
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await getProductDetails(Number(id));
        setProduct(response);

        // Set rating data
        setAverageRating(response.averageRating || 0);
        setReviewCount(response.reviews ? response.reviews.length : 0);

        console.log('Product response:', response.imageUrls);

        // Initialize gallery images with primary image
        const imageUrls: string[] = response.imageUrls && response.imageUrls.length > 0
          ? response.imageUrls
          : ['/no-image.svg'];
        console.log('Gallery images:', imageUrls);
        setGalleryImages(imageUrls);
        setCurrentDisplayImage(imageUrls[0]);

        // Fetch related products based on category
        if (response.categories && response.categories.length > 0) {
          try {
            const relatedResponse = await getSimilarProducts(response.id, 6);
            const filtered = relatedResponse.products;
            setRelatedProducts(filtered);
          } catch (relatedError) {
            console.error('Error fetching related products:', relatedError);
          }
        }

      } catch (err) {
        setError('Failed to fetch product details');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const fetchDynamicPrice = async (productId: number) => {
    setDynamicPrice(10);
    try {
      setPriceLoading(true);
      const currentTime = new Date().toISOString();
      const priceResponse = await getDynamicPrice(productId, currentTime);
      console.log('Dynamic price response:', priceResponse);
      setDynamicPrice(priceResponse?.data?.dynamicPrice || null);
    } catch (err) {
      console.error('Error fetching dynamic price:', err);
      // Fallback to base price if dynamic pricing fails
      setDynamicPrice(null);
    } finally {
      setPriceLoading(false);
    }
  };

  const handleVaseSelection = (vaseImageUrl: string) => {
    setCurrentDisplayImage(vaseImageUrl);
  };

  const handleReviewSubmitted = async () => {
    // Refresh product data to get updated reviews
    if (id) {
      try {
        const response = await getProductDetails(Number(id));
        setAverageRating(response.averageRating || 0);
        setReviewCount(response.reviews ? response.reviews.length : 0);
        setProduct(response);
      } catch (error) {
        console.error('Error refreshing product data:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">{error || 'Product not found'}</div>
      </div>
    );
  }

  const categoryName = product.categories && product.categories.length > 0
    ? product.categories[0].name
    : 'Uncategorized';

  // Use dynamic price if available, otherwise fall back to base price
  const finalPrice = dynamicPrice !== null ? dynamicPrice : product.basePrice;
  const hasDiscount = dynamicPrice !== null && dynamicPrice < product.basePrice;
  const hasSurcharge = dynamicPrice !== null && dynamicPrice > product.basePrice;
  const priceChangePercentage = dynamicPrice !== null
    ? Math.round(Math.abs((dynamicPrice - product.basePrice) / product.basePrice) * 100)
    : 0;

  return (
    <div className="product-page">
      <div className="product-details-wrapper">
        <ProductImageGallery
          imageUrl={currentDisplayImage}
          onVaseSelect={handleVaseSelection}
        />
        <ProductDetails
          id={product.id}
          name={product.name}
          description={product.description || ''}
          category={categoryName}
          finalPrice={finalPrice}
          basePrice={product.basePrice}
          stockQuantity={product.stockQuantity}
          discountPercentage={priceChangePercentage}
          hasDiscount={hasDiscount}
          hasSurcharge={hasSurcharge}
          imageUrls={galleryImages}
          onVaseSelect={handleVaseSelection}
          flowerStatus={product.flowerStatus}
          averageRating={averageRating}
          reviewCount={reviewCount}
        />
      </div>

      {/* Customer Reviews Section - Full Width Below Product Details */}
      <div className="reviews-section">
        <ProductReview
          productId={product.id}
          productName={product.name}
          averageRating={averageRating}
          reviewCount={reviewCount}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h3 className="you-may-also-like">You May Also Like</h3>
          <div className="recommended-products">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="recommended-product"
                onClick={() => navigate(`/product/${relatedProduct.id}`)}
              >
                <img
                  src={relatedProduct.imageUrls?.[0] || '/no-image.svg'}
                  alt={relatedProduct.name}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <div className="re-product-name">{relatedProduct.name}</div>
                <div className="re-product-price">${relatedProduct.basePrice.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;