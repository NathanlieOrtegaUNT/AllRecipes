// src/components/UserSidebar.jsx - Account Management
import React, { useState, useRef } from 'react';
import AccountSettings from './AccountSettings';
import ImageCropperModal from './ImageCropperModal';
import { reviewService } from '../services/reviewService';
import './UserSidebar.css';

const UserSidebar = ({ user, onClose, onLogout, onUserUpdate }) => {
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // Get the most up-to-date user data from localStorage
  const getCurrentUser = () => {
    try {
      const storedUser = localStorage.getItem('allRecipesUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return userData;
      }
    } catch (error) {
      console.error('Error reading user data from localStorage:', error);
    }
    return user; // fallback to prop user
  };

  const currentUser = getCurrentUser();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Read the file and show cropper
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target.result);
      setShowImageCropper(true);
    };
    reader.readAsDataURL(file);

    // Reset file input
    e.target.value = '';
  };

  const updateUserReviewsProfilePicture = async (newProfilePicture) => {
    try {
      const userId = currentUser.uid || currentUser.email;
      console.log('🔄 Updating profile picture in all user reviews for userId:', userId);
      
      const result = await reviewService.updateUserProfilePictureInReviews(userId, newProfilePicture);
      if (result.success) {
        console.log('✅ Successfully updated profile picture in reviews');
      } else {
        console.error('❌ Failed to update profile picture in reviews:', result.error);
      }
      
      // Also update replies
      const repliesResult = await reviewService.updateUserProfilePictureInReplies(userId, newProfilePicture);
      if (repliesResult.success) {
        console.log('✅ Successfully updated profile picture in replies');
      } else {
        console.error('❌ Failed to update profile picture in replies:', repliesResult.error);
      }
    } catch (error) {
      console.error('❌ Error updating profile picture in reviews/replies:', error);
    }
  };

  const handleCropComplete = async (croppedImageUrl) => {
    setImageLoading(true);
    
    try {
      // Update user data with cropped profile picture
      const updatedUser = {
        ...currentUser,
        profilePicture: croppedImageUrl,
        profilePictureUpdated: new Date().toISOString(),
        profilePictureKey: `${currentUser.email}_${Date.now()}` // Add unique key
      };

      // Save to localStorage
      localStorage.setItem('allRecipesUser', JSON.stringify(updatedUser));
      
      // Also save profile picture separately for persistence
      localStorage.setItem(`profilePicture_${currentUser.email}`, croppedImageUrl);

      // Update all existing reviews and replies with new profile picture
      await updateUserReviewsProfilePicture(croppedImageUrl);

      // Update parent component
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      // Trigger storage event for cross-component updates
      window.dispatchEvent(new Event('storage'));

      console.log('✅ Profile picture updated from sidebar');
    } catch (error) {
      console.error('❌ Error updating profile picture:', error);
      alert('Error updating profile picture. Please try again.');
    } finally {
      setImageLoading(false);
      setShowImageCropper(false);
      setSelectedImage(null);
    }
  };

  const handleCropCancel = () => {
    setShowImageCropper(false);
    setSelectedImage(null);
  };

  const handleRemoveProfilePicture = async () => {
    if (window.confirm('Are you sure you want to remove your profile picture?')) {
      setImageLoading(true);
      
      try {
        const updatedUser = {
          ...currentUser,
          profilePicture: null,
          profilePictureRemoved: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('allRecipesUser', JSON.stringify(updatedUser));
        
        // Remove separate profile picture storage
        localStorage.removeItem(`profilePicture_${currentUser.email}`);

        // Update all existing reviews and replies to remove profile picture
        await updateUserReviewsProfilePicture(null);

        // Update parent component
        if (onUserUpdate) {
          onUserUpdate(updatedUser);
        }

        // Trigger storage event for cross-component updates
        window.dispatchEvent(new Event('storage'));

        console.log('✅ Profile picture removed');
      } catch (error) {
        console.error('❌ Error removing profile picture:', error);
        alert('Error removing profile picture. Please try again.');
      } finally {
        setImageLoading(false);
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAccountSettings = () => {
    setShowAccountSettings(true);
  };

  const handleCloseSettings = () => {
    setShowAccountSettings(false);
  };

  const handleLogoutClick = () => {
    onLogout();
  };


  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Sidebar Overlay */}
      <div className="sidebar-overlay" onClick={handleOverlayClick}>
        <div className="user-sidebar">
          {/* Close Button */}
          <button className="sidebar-close" onClick={onClose}>
            ✕
          </button>

          {/* User Profile Section */}
          <div className="user-profile">
            <div 
              className="user-avatar-large-wrapper"
              onMouseEnter={() => setShowAddButton(true)}
              onMouseLeave={() => setShowAddButton(false)}
            >
              <div className="user-avatar-large">
                {currentUser.profilePicture ? (
                  <img 
                    src={currentUser.profilePicture} 
                    alt="Profile" 
                    className="profile-image"
                  />
                ) : (
                  <span className="user-initials-large">
                    {getInitials(currentUser.name)}
                  </span>
                )}
                
                {imageLoading && (
                  <div className="image-loading-overlay">
                    <div className="loading-spinner"></div>
                  </div>
                )}
              </div>
              
              {/* Add/Change Picture Button  */}
              {showAddButton && !imageLoading && (
                <button 
                  className="add-picture-btn"
                  onClick={triggerFileInput}
                  title={currentUser.profilePicture ? 'Change picture' : 'Add picture'}
                >
                  <span className="camera-icon">📷</span>
                </button>
              )}
              
              {/* Remove Picture Button  */}
              {currentUser.profilePicture && showAddButton && !imageLoading && (
                <button 
                  className="remove-picture-btn"
                  onClick={handleRemoveProfilePicture}
                  title="Remove picture"
                >
                  <span className="remove-icon">❌</span>
                </button>
              )}
            </div>
            
            <div className="user-info">
              <h3 className="user-name">
                {currentUser.name}
              </h3>
            </div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>

          {/* Menu Options */}
          <div className="sidebar-menu">
            <button 
              className="menu-item"
              onClick={handleAccountSettings}
            >
              <span className="menu-icon">⚙️</span>
              Account Settings
              <span className="menu-arrow">→</span>
            </button>

            <button 
              className="menu-item logout-item"
              onClick={handleLogoutClick}
            >
              <span className="menu-icon">🚪</span>
              Logout
              <span className="menu-arrow">→</span>
            </button>
          </div>

          {/* Footer */}
          <div className="sidebar-footer">
            <p>All Recipes © 2025</p>
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showImageCropper && (
        <ImageCropperModal
          imageSrc={selectedImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      {/* Account Settings Modal */}
      {showAccountSettings && (
        <AccountSettings 
          user={currentUser}
          onClose={handleCloseSettings}
          onUserUpdate={onUserUpdate}
        />
      )}
    </>
  );
};

export default UserSidebar;