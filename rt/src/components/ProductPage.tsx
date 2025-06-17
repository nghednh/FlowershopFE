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
      <div className="product-details-wrapper">
        <ProductImageGallery imageUrl='https://placehold.co/800x600/FFDDC1/800000?text=Rosy+Delight+Bouquet' />
        {/* Placeholder image URL, replace with actual product image URL */}
        <ProductDetails name="Rosy Delight Bouquet" description='A beautiful arrangement of fresh roses in various shades of pink, perfect for any occasion.' category='Flesh Flowers' price={29.99} />
        {/* Placeholder product details, replace with actual product data */}
      </div>
      {/* <RecommendedProducts /> */}
      {/* <Footer /> */}
    </div>
  );
};

export default ProductPage;