import React from 'react';
import './ProductPage/ProductPage.css';
import ProductImageGallery from './ProductPage/ProductImageGallery';
import ProductDetails from './ProductPage/ProductDetails';
import RecommendedProducts from './ProductPage/RecommendedProducts';

const ProductPage: React.FC = () => {
  return (
    <div>
      <div className="product-details-wrapper">
        <ProductImageGallery imageUrl='https://placehold.co/800x600/FFDDC1/800000?text=Rosy+Delight+Bouquet' />
        {/* Placeholder image URL, replace with actual product image URL */}
        <ProductDetails name="Rosy Delight Bouquet" description='A beautiful arrangement of fresh roses in various shades of pink, perfect for any occasion.' category='Flesh Flowers' price={29.99} />
        {/* Placeholder product details, replace with actual product data */}
      </div>
      <div className="you-may-also-like">
        <p>You may also like...</p>
      </div>
      <RecommendedProducts products={
        [
          {
            id: 1,
            name: 'Sunshine Yellow Bouquet',
            imageUrl: 'https://placehold.co/200x200/FFDDC1/800000?text=Sunshine+Yellow+Bouquet',
            price: 24.99,
          },
          {
            id: 2,
            name: 'Elegant White Lily Arrangement',
            imageUrl: 'https://placehold.co/200x200/FFDDC1/800000?text=Elegant+White+Lily+Arrangement',
            price: 34.99,
          },
          {
            id: 3,
            name: 'Vibrant Mixed Flower Basket',
            imageUrl: 'https://placehold.co/200x200/FFDDC1/800000?text=Vibrant+Mixed+Flower+Basket',
            price: 39.99,
          },
          {
            id: 4,
            name: 'Classic Red Rose Bouquet',
            imageUrl: 'https://placehold.co/200x200/FFDDC1/800000?text=Classic+Red+Rose+Bouquet',
            price: 49.99,
          },
        ]
      } />
    </div>
  );
};

export default ProductPage;
