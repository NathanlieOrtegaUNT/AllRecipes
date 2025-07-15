// AllRecipes/src/components/reviews/ReviewItem.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import Reply from './Reply';
import ReplyForm from './ReplyForm';
import './ReviewItem.css';

const ReviewItem = ({ 
  review, 
  currentUser, 
  onEdit, 
  onDelete, 
  isOwner = false,
  showRecipeInfo = false,
  replies = [],
  onReply,
  onEditReply,
  onDeleteReply 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [editingReply, setEditingReply] = useState(null);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    
    // Handle Firestore timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
    return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setIsDeleting(true);
      await onDelete(review.id);
      setIsDeleting(false);
    }
  };

  const handleReplySubmit = async (replyData) => {
    if (editingReply) {
      await onEditReply(editingReply.id, replyData);
      setEditingReply(null);
    } else {
      await onReply(review.id, replyData);
    }
    setShowReplyForm(false);
  };

  const handleReplyCancel = () => {
    setShowReplyForm(false);
    setEditingReply(null);
  };

  const handleEditReply = (reply) => {
    setEditingReply(reply);
    setShowReplyForm(true);
  };

  return (
    <div className="review-item">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            {review.userProfilePicture ? (
              <img 
                src={review.userProfilePicture} 
                alt={review.userName} 
                className="avatar-image"
              />
            ) : (
              <div className="avatar-initials">
                {getInitials(review.userName)}
              </div>
            )}
          </div>
          
          <div className="reviewer-details">
            <h4 className="reviewer-name">{review.userName}</h4>
            <div className="review-meta">
              <StarRating 
                rating={review.rating} 
                interactive={false} 
                size="small" 
                showNumber={false}
              />
              <span className="review-date">{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {isOwner && (
          <div 
            className="review-actions"
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
          >
            <button 
              className="action-menu-btn"
              aria-label="Review options"
            >
              <svg viewBox="0 0 24 24" className="dots-icon">
                <circle cx="12" cy="5" r="2"/>
                <circle cx="12" cy="12" r="2"/>
                <circle cx="12" cy="19" r="2"/>
              </svg>
            </button>
            
            {showActions && (
              <div className="action-menu">
                <button 
                  onClick={() => onEdit(review)}
                  className="action-btn edit-btn"
                  disabled={isDeleting}
                >
                  <svg viewBox="0 0 24 24" className="edit-icon">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                  Edit
                </button>
                
                <button 
                  onClick={handleDelete}
                  className="action-btn delete-btn"
                  disabled={isDeleting}
                >
                  <svg viewBox="0 0 24 24" className="delete-icon">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="review-content">
        <p className="review-comment">{review.comment}</p>
      </div>

      {/* Recipe info */}
      {showRecipeInfo && review.recipeTitle && (
        <div className="review-recipe-info">
          <span className="recipe-link-text">Review for: </span>
          <Link 
            to={`/recipe/${review.recipeId}`} 
            className="recipe-title-link"
          >
            <strong className="recipe-title">{review.recipeTitle}</strong>
          </Link>
        </div>
      )}

      {/* Reply button for ALL logged-in users */}
      {currentUser && (
        <div className="review-reply-section">
          <button 
            onClick={() => setShowReplyForm(true)}
            className="reply-btn"
            disabled={showReplyForm}
          >
            <svg viewBox="0 0 24 24" className="reply-icon">
              <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/>
            </svg>
            Reply
          </button>
        </div>
      )}

      {/* Reply Form */}
      {showReplyForm && (
        <ReplyForm
          onSubmit={handleReplySubmit}
          onCancel={handleReplyCancel}
          initialData={editingReply}
          isEditing={!!editingReply}
          replyToUser={review.userName}
        />
      )}

      {/* Replies List */}
      {replies && replies.length > 0 && (
        <div className="replies-section">
          {replies.map((reply) => (
            <Reply
              key={reply.id}
              reply={reply}
              currentUser={currentUser}
              onEdit={handleEditReply}
              onDelete={onDeleteReply}
              isOwner={currentUser && (reply.userId === (currentUser.uid || currentUser.email))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewItem;