import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IProduct } from '../../types/backend.d';
import { Button } from "../Button"

interface Props {
  product: IProduct;
}


const ProductCard: React.FC<Props> = ({ product }) => {
  const flowerType = product.categories?.map((cat) => cat.name).join(", ");
  const conditionLabel = product.condition?.toLowerCase() === "new" ? "New" : "Old";
  const imageUrl = product.imageUrls?.[0];
  const navigate = useNavigate();

  return (
    <div className="border p-4 rounded shadow flex flex-col gap-2">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover rounded"
        />
      )}
      <h2 className="font-bold text-lg">{product.name}</h2>
      <p className="text-gray-700 text-sm">{product.description}</p>
      <p><span className="font-medium">Flower Type:</span> {flowerType || "N/A"}</p>
      <p><span className="font-medium">Condition:</span> {conditionLabel || "Unknown"}</p>
      <p className="text-green-600 font-semibold">Price: ${product.basePrice.toFixed(2)}</p>
      <Button className="w-full" onClick={() => navigate(`/products/${product.id}`)}>View Details</Button>
    </div>
  );
};

export default ProductCard;
