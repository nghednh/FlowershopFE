import React from 'react';
import './ProductPage.css';

interface ProductImageGalleryProps {
    imageUrl: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ imageUrl }) => {
    return (
        <div className="product-image-gallery">
            <img
                src={imageUrl}
                className="product-image"
                onError={(e) => {
                    // Fallback image in case of error
                    e.currentTarget.src = 'https://via.placeholder.com/150';
                }}
            />
        </div>
    );
}

export default ProductImageGallery;