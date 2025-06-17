import React from 'react';
// import Header from './components/Header';
import ProductImageGallery from './ProductPage/ProductImageGallery';
import ProductDetails from './ProductPage/ProductDetails';
import RecommendedProducts from './ProductPage/RecommendedProducts';
// import Footer from './components/Footer';

const ProductPage: React.FC = () => {
  return (
    <div>
      {/* <Header /> */}
      <ProductImageGallery imageUrl='https://placehold.co/800x600/FFDDC1/800000?text=Rosy+Delight+Bouquet' />
        {/* Placeholder image URL, replace with actual product image URL */}
      {/* <ProductDetails /> */}
      {/* <RecommendedProducts /> */}
      {/* <Footer /> */}
    </div>
  );
};

export default ProductPage;