import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductPage/ProductPage.css';
import ProductImageGallery from './ProductPage/ProductImageGallery';
import ProductDetails from './ProductPage/ProductDetails';
import { getProductDetails } from '../config/api';
import { IProduct } from '../types/backend';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentDisplayImage, setCurrentDisplayImage] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await getProductDetails(Number(id));
        console.log('Product response:', response);
        setProduct(response);
        // Initialize gallery images with primary image
        const primaryImage = response.images && response.images.length > 0
          ? response.images.map(img => img.imageUrl)
          : ['https://via.placeholder.com/800x600/FFDDC1/800000?text=No+Image'];
        setGalleryImages(primaryImage);
        setCurrentDisplayImage(primaryImage[0]); // Set initial display image

      } catch (err) {
        setError('Failed to fetch product details');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleVaseSelection = (vaseImageUrl: string) => {
    setCurrentDisplayImage(vaseImageUrl);
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

  const primaryImage = product.images && product.images.length > 0
    ? product.images.map(img => img.imageUrl)
    : ['https://via.placeholder.com/800x600/FFDDC1/800000?text=No+Image'];

  const categoryName = product.categories && product.categories.length > 0
    ? product.categories[0].name
    : 'Uncategorized';

  // Calculate discount percentage if there's a difference between basePrice and finalPrice
  const finalPrice = product.basePrice - 2; // Assuming finalPrice is basePrice for now
  const hasDiscount = finalPrice < product.basePrice;
  const discountPercentage = hasDiscount ? Math.round(((product.basePrice - finalPrice) / product.basePrice) * 100) : 0;

  return (
    <div>
      <div className="product-details-wrapper">
        <ProductImageGallery
          imageUrl={currentDisplayImage}
          onVaseSelect={handleVaseSelection}
        />
        <ProductDetails
          name={product.name}
          description={product.description || ''}
          category={categoryName}
          price={finalPrice}
          basePrice={product.basePrice}
          stockQuantity={product.stockQuantity}
          discountPercentage={discountPercentage}
          hasDiscount={hasDiscount}
          imageUrls={galleryImages} // Pass original images for vase selection
          onVaseSelect={handleVaseSelection}
        />
      </div>
    </div>
  );
};

export default ProductPage;
