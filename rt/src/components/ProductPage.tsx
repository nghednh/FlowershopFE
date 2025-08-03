import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductPage/ProductPage.css';
import ProductImageGallery from './ProductPage/ProductImageGallery';
import ProductDetails from './ProductPage/ProductDetails';
import { getProductDetails, getSimilarProducts, getDynamicPrice } from '../config/api';
import { IProduct } from '../types/backend';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentDisplayImage, setCurrentDisplayImage] = useState<string>('');
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [dynamicPrice, setDynamicPrice] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);

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
        setCurrentDisplayImage(primaryImage[0]);

        // Fetch dynamic pricing
        await fetchDynamicPrice(Number(id));

        // Fetch related products based on category
        if (response.categories && response.categories.length > 0) {
          try {
            const relatedResponse = await getSimilarProducts(response.id, 6);
            const filtered = relatedResponse.data?.products || relatedResponse.products || [];
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
    try {
      setPriceLoading(true);
      const currentTime = new Date().toISOString();
      const priceResponse = await getDynamicPrice(productId, currentTime);
      console.log('Dynamic price response:', priceResponse);

      if (priceResponse.success && priceResponse.data) {
        setDynamicPrice(priceResponse.data.dynamicPrice);
        console.log('Dynamic price fetched:', priceResponse.data);
      }
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
  const discountPercentage = hasDiscount ? Math.round(((product.basePrice - finalPrice) / product.basePrice) * 100) : 0;

  return (
    <div>
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
          price={finalPrice}
          basePrice={product.basePrice}
          stockQuantity={product.stockQuantity}
          discountPercentage={discountPercentage}
          hasDiscount={hasDiscount}
          imageUrls={galleryImages}
          onVaseSelect={handleVaseSelection}
        />
      </div>
    </div>
  );
};

export default ProductPage;
