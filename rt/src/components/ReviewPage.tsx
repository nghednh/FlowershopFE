import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductService } from '../api/product.api';
import './ReviewPage.css';
import { IProduct } from '../types/backend';

const ReviewPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProductAndReviews();
    }
  }, [productId]);

  const fetchProductAndReviews = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      const productData = await ProductService.getProductDetails(parseInt(productId));
      setProduct(productData);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setError('Failed to load product details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!product || !newReview.comment.trim()) {
      setSubmitError('Please write a comment for your review.');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);
      
      await ProductService.addProductReview({
        productId: product.id,
        rating: newReview.rating,
        comment: newReview.comment
      });

      setSubmitSuccess(true);
      setNewReview({ rating: 5, comment: '' });
      
      // Refresh product data to show new review
      await fetchProductAndReviews();
      
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
    if (!product?.reviews) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    product.reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className="review-page-loading">
        <div className="review-page-loading-content">
          <div className="review-page-loading-spinner" />
          <div className="review-page-loading-text">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="review-page-error">
        <div className="review-page-error-card">
          <div className="review-page-error-icon">😕</div>
          <h2 className="review-page-error-title">Oops! Something went wrong</h2>
          <p className="review-page-error-message">
            {error || 'Product not found'}
          </p>
          <button
            onClick={() => navigate('/list')}
            className="review-page-error-button"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const ratingDistribution = getRatingDistribution();
  const reviewCount = product.reviews?.length || 0;

  return (
    <div className="review-page">
      <div className="review-page-container">
        {/* Header */}
        <div className="review-page-header">
          <div className="review-page-header-top">
            <button
              onClick={() => navigate(-1)}
              className="review-page-back-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="review-page-back-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="review-page-title">
              Reviews for {product.name}
            </h1>
          </div>

          {/* Product Summary */}
          <div className="review-page-product-summary">
            {product.imageUrls && product.imageUrls.length > 0 && (
              <img
                src={product.imageUrls[0]}
                alt={product.name}
                className="review-page-product-image"
              />
            )}
            <div className="review-page-product-info">
              <h3 className="review-page-product-name">
                {product.name}
              </h3>
              <div className="review-page-product-rating">
                <div className="review-page-rating-stars">
                  {renderStars(Math.round(product.averageRating || 0))}
                </div>
                <span className="review-page-rating-score">
                  {(product.averageRating || 0).toFixed(1)}
                </span>
                <span className="review-page-rating-count">({reviewCount} reviews)</span>
              </div>
              <div className="review-page-product-price">
                ${product.basePrice.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="review-page-success">
            ✅ Thank you! Your review has been submitted successfully.
          </div>
        )}

        {/* Write Review Section */}
        <div className="review-page-write-section">
          <h2 className="review-page-write-title">
            ✍️ Write Your Review
          </h2>
          
          {/* Rating Selection */}
          <div className="review-page-rating-input">
            <label className="review-page-rating-label">
              Your Rating:
            </label>
            <div className="review-page-rating-stars">
              {renderStars(newReview.rating, true, (rating) => setNewReview(prev => ({ ...prev, rating })))}
            </div>
          </div>

          {/* Comment */}
          <div className="review-page-comment-input">
            <label className="review-page-comment-label">
              Your Review:
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Share your experience with this beautiful flower arrangement..."
              className="review-page-textarea"
              maxLength={1000}
            />
            <div className="review-page-char-counter">
              {newReview.comment.length}/1000 characters
            </div>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="review-page-submit-error">
              {submitError}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmitReview}
            disabled={submitting}
            className="review-page-submit-button"
          >
            {submitting ? (
              <>
                <div className="review-page-submit-spinner" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </button>
        </div>

        {/* Reviews List */}
        <div className="review-page-reviews-section">
          <div className="review-page-reviews-header">
            <h2 className="review-page-reviews-title">
              All Reviews ({reviewCount})
            </h2>

            {/* Rating Summary */}
            {reviewCount > 0 && (
              <div className="review-page-rating-summary-mini">
                <div className="review-page-rating-summary-mini-score">
                  <div className="review-page-rating-summary-mini-number">
                    {(product.averageRating || 0).toFixed(1)}
                  </div>
                  <div className="review-page-rating-summary-mini-stars">
                    {renderStars(Math.round(product.averageRating || 0))}
                  </div>
                </div>

                {/* Mini Rating Distribution */}
                <div className="review-page-mini-distribution">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="review-page-mini-distribution-row">
                      <span className="review-page-mini-star">{star}★</span>
                      <div className="review-page-mini-bar">
                        <div 
                          className="review-page-mini-fill"
                          style={{
                            width: `${reviewCount > 0 ? (ratingDistribution[star as keyof typeof ratingDistribution] / reviewCount) * 100 : 0}%`
                          }}
                        />
                      </div>
                      <span className="review-page-mini-count">
                        {ratingDistribution[star as keyof typeof ratingDistribution]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {product.reviews && product.reviews.length > 0 ? (
            <div className="review-page-reviews-list">
              {product.reviews.map((review) => (
                <div key={review.id} className="review-page-review-item">
                  <div className="review-page-review-header">
                    <div>
                      <div className="review-page-review-user">
                        <span className="review-page-review-username">{review.userName}</span>
                        {true && (
                          <span className="review-page-verified-badge">
                            ✓ Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="review-page-review-rating-date">
                        <div className="review-page-review-stars">
                          {renderStars(review.rating)}
                        </div>
                        <span className="review-page-review-date">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="review-page-review-comment">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="review-page-empty-reviews">
              <div className="review-page-empty-icon">🌸</div>
              <div className="review-page-empty-title">No reviews yet</div>
              <div>Be the first to share your experience with this beautiful arrangement!</div>
            </div>
          )}
        </div>

        {/* Back to Product Button */}
        <div className="review-page-back-to-product">
          <button
            onClick={() => navigate(`/product/${productId}`)}
            className="review-page-product-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="review-page-product-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            View Product Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;