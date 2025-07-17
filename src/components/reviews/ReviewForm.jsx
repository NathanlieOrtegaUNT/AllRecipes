// AllRecipes/src/components/reviews/ReviewForm.jsx

import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import './ReviewForm.css';

const ReviewForm = ({ 
  onSubmit, 
  onCancel, 
  initialData = null, 
  isEditing = false, 
  loading = false 
}) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [comment, setComment] = useState(initialData?.comment || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setRating(initialData.rating || 0);
      setComment(initialData.comment || '');
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!comment.trim()) {
      newErrors.comment = 'Please write a review comment';
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'Review must be at least 10 characters long';
    } else if (comment.trim().length > 1000) {
      newErrors.comment = 'Review must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const reviewData = {
      rating,
      comment: comment.trim()
    };

    onSubmit(reviewData);
  };

  const handleCancel = () => {
    setRating(initialData?.rating || 0);
    setComment(initialData?.comment || '');
    setErrors({});
    onCancel();
  };

  return (
    <div className="review-form-container">
      <form onSubmit={handleSubmit} className="review-form">
        <h3>{isEditing ? 'Edit Your Review' : 'Write a Review'}</h3>
        
        {/* Rating Section */}
        <div className="form-group">
          <label className="form-label">
            Your Rating 
          </label>
          <div className="rating-input">
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              interactive={true}
              size="large"
              showNumber={true}
            />
          </div>
          {errors.rating && (
            <span className="error-message">{errors.rating}</span>
          )}
        </div>

        {/* Comment Section */}
        <div className="form-group">
          <label htmlFor="review-comment" className="form-label">
            Your Review 
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this recipe..."
            className={`review-textarea ${errors.comment ? 'error' : ''}`}
            maxLength={1000}
            rows={4}
          />
          <div className="textarea-footer">
            <span className="character-count">
              {comment.length}/1000 characters
            </span>
          </div>
          {errors.comment && (
            <span className="error-message">{errors.comment}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-cancel"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-text">
                {isEditing ? 'Updating...' : 'Submitting...'}
              </span>
            ) : (
              isEditing ? 'Update Review' : 'Submit Review'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;