import React from 'react';
import './ProductPage.css';

interface ProductImageGalleryProps {
    imageUrl: string;
    onVaseSelect?: (imageUrl: string) => void;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ imageUrl, onVaseSelect }) => {
    return (
        <div className="product-image-gallery">
            <img
                src={imageUrl}
                className="product-image"
                alt="Product"
                onError={(e) => {
                    // Fallback image in case of error
                    e.currentTarget.src = 'https://via.placeholder.com/150';
                }}
            />
        </div>
    );
}

export default ProductImageGallery;