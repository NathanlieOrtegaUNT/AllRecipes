// AllRecipes/src/components/reviews/ReplyForm.jsx

import React, { useState, useEffect } from 'react';
import './ReplyForm.css';

const ReplyForm = ({ 
  onSubmit, 
  onCancel, 
  initialData = null, 
  isEditing = false, 
  loading = false,
  replyToUser = null
}) => {
  const [comment, setComment] = useState(initialData?.comment || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setComment(initialData.comment || '');
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!comment.trim()) {
      newErrors.comment = 'Please write a reply';
    } else if (comment.trim().length < 5) {
      newErrors.comment = 'Reply must be at least 5 characters long';
    } else if (comment.trim().length > 500) {
      newErrors.comment = 'Reply must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const replyData = {
      comment: comment.trim()
    };

    onSubmit(replyData);
  };

  const handleCancel = () => {
    setComment(initialData?.comment || '');
    setErrors({});
    onCancel();
  };

  return (
    <div className="reply-form-container">
      <form onSubmit={handleSubmit} className="reply-form">
        <div className="reply-form-header">
          <h4>
            {isEditing ? 'Edit Reply' : `Reply to ${replyToUser || 'Review'}`}
          </h4>
        </div>
        
        {/* Comment Section */}
        <div className="reply-form-group">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your reply..."
            className={`reply-textarea ${errors.comment ? 'error' : ''}`}
            maxLength={500}
            rows={3}
          />
          <div className="reply-textarea-footer">
            <span className="reply-character-count">
              {comment.length}/500 characters
            </span>
          </div>
          {errors.comment && (
            <span className="reply-error-message">{errors.comment}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="reply-form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="reply-btn-cancel"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="reply-btn-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="reply-loading-text">
                {isEditing ? 'Updating...' : 'Replying...'}
              </span>
            ) : (
              isEditing ? 'Update Reply' : 'Post Reply'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReplyForm;