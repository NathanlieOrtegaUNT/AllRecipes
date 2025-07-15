// AllRecipes/src/components/reviews/StarRating.jsx

import React, { useState } from 'react';
import './StarRating.css';

const StarRating = ({ 
  rating = 0, 
  onRatingChange, 
  interactive = false, 
  size = 'medium',
  showNumber = true 
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (starValue) => {
    if (interactive && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleStarHover = (starValue) => {
    if (interactive) {
      setHoverRating(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = interactive ? (hoverRating || rating) : rating;

    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= displayRating;

      stars.push(
        <button
          key={i}
          type="button"
          className={`star ${isFilled ? 'filled' : 'empty'} ${size} ${interactive ? 'interactive' : 'readonly'}`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleMouseLeave}
          disabled={!interactive}
          aria-label={`Rate ${i} star${i !== 1 ? 's' : ''}`}
        >
          ★
        </button>
      );
    }

    return stars;
  };

  return (
    <div className={`star-rating ${size}`}>
      <div className="stars-container">
        {renderStars()}
      </div>
      {showNumber && (
        <span className="rating-number">
          {rating > 0 ? rating.toFixed(1) : '0.0'}
        </span>
      )}
    </div>
  );
};

export default StarRating;