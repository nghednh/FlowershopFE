import React from "react";

interface RecommendedProductsProps {
    products: {
        id: number;
        name: string;
        imageUrl: string;
        price: number;
    }[];
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ products }) => {
    return (
        <div className="recommended-products">
            {products.map((product) => (
                <div key={product.id} className="recommended-product">
                    <img src={product.imageUrl} />
                    <h2 className="re-product-name">{product.name}</h2>
                    <p className="re-product-price">${product.price.toFixed(2)}</p>
                </div>
            ))}
        </div>
    );
};

export default RecommendedProducts;