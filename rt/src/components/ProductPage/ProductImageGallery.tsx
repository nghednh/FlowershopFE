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
                    console.error('Error loading product image:', e);
                    e.currentTarget.src = '/no-image.svg';
                }}
            />
        </div>
    );
}

export default ProductImageGallery;