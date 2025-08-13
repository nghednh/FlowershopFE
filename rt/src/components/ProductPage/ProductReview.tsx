import React, { useState, useEffect } from 'react';
import { ProductService } from '../../api/product.api';
import './ProductReview.css';
import { IReview } from '../../types/backend';

interface ProductReviewProps {
  productId: number;
  productName: string;
  averageRating: number;
  reviewCount: number;
  onReviewSubmitted?: () => void;
}

const ProductReview: React.FC<ProductReviewProps> = ({
  productId,
  productName,
  averageRating,
  reviewCount,
  onReviewSubmitted
}) => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const productData = await ProductService.getProductDetails(productId);
      console.log('Fetched product reviews:', productData.reviews);
      setReviews(productData.reviews || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!newReview.comment.trim()) {
      setSubmitError('Please write a comment for your review.');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);
      
      await ProductService.addProductReview({
        productId,
        rating: newReview.rating,
        comment: newReview.comment
      });

      setSubmitSuccess(true);
      setShowReviewForm(false);
      setNewReview({ rating: 5, comment: '' });
      
      // Refresh reviews
      await fetchReviews();
      
      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
      
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onStarClick?: (rating: number) => void) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => interactive && onStarClick && onStarClick(i)}
          className={`rating-star ${interactive ? 'interactive' : ''}`}
          style={{
            color: i <= rating ? '#fbbf24' : '#d1d5db',
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="product-reviews">
      {/* Success Message */}
      {submitSuccess && (
        <div className="review-success-message">
          ✅ Thank you! Your review has been submitted successfully.
        </div>
      )}

      {/* Reviews Header */}
      <div className="reviews-header">
        <h3 className="reviews-title">
          🌸 Customer Reviews
        </h3>

        {/* Rating Summary */}
        <div className="rating-summary">
          <div className="rating-summary-score">
            <div className="rating-score-number">
              {averageRating.toFixed(1)}
            </div>
            <div className="rating-stars">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="rating-summary-text">
              Based on {reviewCount} reviews
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="rating-distribution-row">
                <span className="rating-distribution-star">{star}★</span>
                <div className="rating-distribution-bar">
                  <div 
                    className="rating-distribution-fill"
                    style={{
                      width: `${reviewCount > 0 ? (ratingDistribution[star as keyof typeof ratingDistribution] / reviewCount) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="rating-distribution-count">
                  {ratingDistribution[star as keyof typeof ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review Button */}
        <div>
          {!showReviewForm ? (
            <button
              className="write-review-button"
              onClick={() => setShowReviewForm(true)}
            >
              ✍️ Write a Review
            </button>
          ) : (
            <div className="review-form">
              <h4 className="review-form-title">
                Write Your Review for {productName}
              </h4>
              
              {/* Rating Selection */}
              <div className="rating-input-section">
                <label className="rating-input-label">
                  Your Rating:
                </label>
                <div className="rating-input-stars">
                  {renderStars(newReview.rating, true, (rating) => setNewReview(prev => ({ ...prev, rating })))}
                </div>
              </div>

              {/* Comment */}
              <div className="comment-input-section">
                <label className="comment-input-label">
                  Your Review:
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience with this beautiful flower arrangement..."
                  className="comment-input"
                  maxLength={1000}
                />
                <div className="comment-counter">
                  {newReview.comment.length}/1000 characters
                </div>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="submit-error">
                  {submitError}
                </div>
              )}

              {/* Action Buttons */}
              <div className="review-form-actions">
                <button
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  className="submit-review-button"
                >
                  {submitting ? (
                    <>
                      <div className="loading-spinner" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setShowReviewForm(false);
                    setSubmitError(null);
                    setNewReview({ rating: 5, comment: '' });
                  }}
                  className="cancel-review-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div>
        <h4 className="reviews-list-title">
          Customer Reviews ({reviewCount})
        </h4>
        
        {loading ? (
          <div className="reviews-loading">
            <div className="reviews-loading-spinner" />
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="reviews-empty">
            <div className="reviews-empty-icon">🌸</div>
            <div className="reviews-empty-title">No reviews yet</div>
            <div>Be the first to share your experience with this beautiful arrangement!</div>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div>
                    <div className="review-user-info">
                      <span className="review-user-name">{review.userName}</span>
                      {true && (
                        <span className="verified-purchase-badge">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="review-rating-date">
                      <div className="rating-stars">
                        {renderStars(review.rating)}
                      </div>
                      <span className="review-date">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="review-comment">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReview;