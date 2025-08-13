import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderReviewButton.css';

interface OrderReviewButtonProps {
  productId: number;
  productName: string;
  orderId: number;
  orderStatus: string;
  isDelivered?: boolean;
  hasReviewed?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const OrderReviewButton: React.FC<OrderReviewButtonProps> = ({
  productId,
  productName,
  orderId,
  orderStatus,
  isDelivered = false,
  hasReviewed = false,
  size = 'medium',
  className = ''
}) => {
  const navigate = useNavigate();

  const handleReviewClick = () => {
    // Navigate to the review page for this specific product
    navigate(`/review/${productId}`, {
      state: {
        fromOrder: orderId,
        productName: productName
      }
    });
  };

  // Only show review button for delivered orders
  if (!isDelivered || orderStatus?.toLowerCase() !== 'delivered') {
    return null;
  }

  const buttonClasses = [
    'order-review-button',
    size,
    hasReviewed ? 'reviewed' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      onClick={handleReviewClick}
      className={buttonClasses}
    >
      {hasReviewed ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="order-review-button-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Reviewed
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="order-review-button-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          Write Review
        </>
      )}
    </button>
  );
};

export default OrderReviewButton;