// AllRecipes/src/components/reviews/Reply.jsx

import React, { useState } from 'react';
import './Reply.css';

const Reply = ({ 
  reply, 
  currentUser, 
  onEdit, 
  onDelete, 
  isOwner = false 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    
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
    if (window.confirm('Are you sure you want to delete this reply?')) {
      setIsDeleting(true);
      await onDelete(reply.id);
      setIsDeleting(false);
    }
  };

  return (
    <div className="reply-item">
      <div className="reply-header">
        <div className="reply-user-info">
          <div className="reply-avatar">
            {reply.userProfilePicture ? (
              <img 
                src={reply.userProfilePicture} 
                alt={reply.userName} 
                className="reply-avatar-image"
              />
            ) : (
              <div className="reply-avatar-initials">
                {getInitials(reply.userName)}
              </div>
            )}
          </div>
          
          <div className="reply-details">
            <h5 className="reply-user-name">{reply.userName}</h5>
            <span className="reply-date">{formatDate(reply.createdAt)}</span>
          </div>
        </div>

        {/* Action buttons */}
        {isOwner && (
          <div 
            className="reply-actions"
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
          >
            <button 
              className="reply-action-menu-btn"
              aria-label="Reply options"
            >
              <svg viewBox="0 0 24 24" className="reply-dots-icon">
                <circle cx="12" cy="5" r="2"/>
                <circle cx="12" cy="12" r="2"/>
                <circle cx="12" cy="19" r="2"/>
              </svg>
            </button>
            
            {showActions && (
              <div className="reply-action-menu">
                <button 
                  onClick={() => onEdit(reply)}
                  className="reply-action-btn edit-btn"
                  disabled={isDeleting}
                >
                  <svg viewBox="0 0 24 24" className="edit-icon">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                  Edit
                </button>
                
                <button 
                  onClick={handleDelete}
                  className="reply-action-btn delete-btn"
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

      <div className="reply-content">
        <p className="reply-text">{reply.comment}</p>
      </div>
    </div>
  );
};

export default Reply;