import React, { useState, useEffect } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { useNavigate } from 'react-router-dom';
import './MealPlannerPage.css';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MealPlannerPage = () => {
  const { favorites, loading } = useFavorites();
  const navigate = useNavigate();
  const [mealPlan, setMealPlan] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [draggedRecipe, setDraggedRecipe] = useState(null);

  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem('allRecipesUser');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        return parsedUser.isLoggedIn ? parsedUser : null;
      }
    } catch (error) {
      console.error('Error reading user data:', error);
    }
    return null;
  };

  // Load meal plan from localStorage
  const loadMealPlan = () => {
    try {
      const user = getCurrentUser();
      if (user) {
        const savedMealPlan = localStorage.getItem(`mealPlan_${user.email}`);
        if (savedMealPlan) {
          return JSON.parse(savedMealPlan);
        }
      }
    } catch (error) {
      console.error('Error loading meal plan:', error);
    }
    return {};
  };

  // Save meal plan to localStorage
  const saveMealPlan = (planData) => {
    try {
      const user = getCurrentUser();
      if (user) {
        localStorage.setItem(`mealPlan_${user.email}`, JSON.stringify(planData));
      }
    } catch (error) {
      console.error('Error saving meal plan:', error);
    }
  };

  useEffect(() => {
    const user = getCurrentUser();
    
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login');
      return;
    }

    // Load existing meal plan
    const existingPlan = loadMealPlan();
    setMealPlan(existingPlan);
    setIsLoaded(true);
  }, [navigate]);

  // Get available recipes 
  const getAvailableRecipes = () => {
    const assignedRecipeIds = new Set();
    
    // Collect all assigned recipe IDs
    Object.values(mealPlan).forEach(dayRecipes => {
      if (Array.isArray(dayRecipes)) {
        dayRecipes.forEach(recipe => {
          assignedRecipeIds.add(recipe.id);
        });
      }
    });

    // Return recipes that aren't assigned
    return favorites.filter(recipe => !assignedRecipeIds.has(recipe.id));
  };

  const handleAssignRecipe = (day, recipe) => {
    setMealPlan(prev => {
      const currentRecipes = prev[day] || [];
      
      if (currentRecipes.length >= 5) {
        alert('You can only assign up to 5 recipes per day.');
        return prev;
      }
      

      const isAlreadyAssigned = currentRecipes.some(r => r.id === recipe.id);
      if (isAlreadyAssigned) {
        alert('This recipe is already assigned to this day.');
        return prev;
      }

      const newPlan = {
        ...prev,
        [day]: [...currentRecipes, recipe]
      };

      // Save to localStorage
      saveMealPlan(newPlan);
      return newPlan;
    });
  };

  const handleRemoveRecipe = (day, indexToRemove) => {
    setMealPlan(prev => {
      const newRecipes = (prev[day] || []).filter((_, i) => i !== indexToRemove);
      const newPlan = {
        ...prev,
        [day]: newRecipes
      };

      // Save to localStorage
      saveMealPlan(newPlan);
      return newPlan;
    });
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, day) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('recipe'));
      

      if (data.sourceDay && data.sourceDay !== day) {
        setMealPlan(prev => {
          const newPlan = { ...prev };
          

          if (newPlan[data.sourceDay]) {
            newPlan[data.sourceDay] = newPlan[data.sourceDay].filter(r => r.id !== data.id);
          }
          

          const currentRecipes = newPlan[day] || [];
          if (currentRecipes.length >= 5) {
            alert('You can only assign up to 5 recipes per day.');
            return prev;
          }
          
          const isAlreadyAssigned = currentRecipes.some(r => r.id === data.id);
          if (isAlreadyAssigned) {
            alert('This recipe is already assigned to this day.');
            return prev;
          }
          
          newPlan[day] = [...currentRecipes, { id: data.id, title: data.title, image: data.image }];
          

          saveMealPlan(newPlan);
          return newPlan;
        });
      } else {

        handleAssignRecipe(day, data);
      }
    } catch (error) {
      console.error('Error dropping recipe:', error);
    }
  };

  const onDragStart = (e, recipe) => {
    e.dataTransfer.setData('recipe', JSON.stringify(recipe));
    setDraggedRecipe(recipe);
  };

  const onDragEnd = () => {
    setDraggedRecipe(null);
  };

  const onRecipeItemDragStart = (e, recipe, sourceDay) => {
    e.stopPropagation();
    const dragData = {
      ...recipe,
      sourceDay: sourceDay
    };
    e.dataTransfer.setData('recipe', JSON.stringify(dragData));
    setDraggedRecipe(dragData);
  };


  if (!isLoaded || loading) {
    return (
      <div className="meal-planner-container">
        <div className="meal-planner-header">
          <h1 className="meal-planner-title">Meal Planner</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your meal planner...</p>
        </div>
      </div>
    );
  }

  const availableRecipes = getAvailableRecipes();

  return (
    <div className="meal-planner-container">
      <div className="meal-planner-header">
        <h1 className="meal-planner-title">Meal Planner</h1>
        <p className="meal-planner-subtitle">
          Drag your favorite recipes to plan your weekly meals
        </p>
      </div>

      <div className="meal-planner-content">
        <div className="days-row">
          {daysOfWeek.map(day => (
            <div 
              key={day} 
              className="day-column" 
              onDragOver={allowDrop} 
              onDrop={(e) => onDrop(e, day)}
            >
              <h3 className="day-title">{day}</h3>
              <div className="drop-zone">
                {(mealPlan[day] && mealPlan[day].length > 0) ? (
                  mealPlan[day].map((recipe, index) => (
                    <div 
                      className="recipe-item" 
                      key={`${recipe.id}-${index}`}
                      draggable
                      onDragStart={(e) => onRecipeItemDragStart(e, recipe, day)}
                      onDragEnd={onDragEnd}
                    >
                      <div className="recipe-item-content">
                        <img 
                          src={recipe.image} 
                          alt={recipe.title}
                          className="recipe-item-image"
                          onError={(e) => {
                            e.target.src = '/api/placeholder/50/50';
                          }}
                        />
                        <a 
                          href={`/recipe/${recipe.id}`}
                          className="recipe-item-title-link"
                          onClick={(e) => e.stopPropagation()}
                          onDragStart={(e) => e.preventDefault()}
                        >
                          <span className="recipe-item-title">{recipe.title}</span>
                        </a>
                      </div>
                      <button 
                        className="remove-btn" 
                        onClick={() => handleRemoveRecipe(day, index)}
                        title="Remove recipe"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="empty-day-message">
                    <span>Drag recipes here</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="saved-recipes-section">
          <h2 className="saved-recipes-title">My Saved Recipes</h2>
          
          {favorites.length === 0 ? (
            <div className="empty-favorites-message">
              <p>No saved recipes found.</p>
              <p>Visit <a href="/my-favorites">My Favorites</a> to save recipes first!</p>
            </div>
          ) : availableRecipes.length === 0 ? (
            <div className="empty-favorites-message">
              <p>All your saved recipes have been assigned to your meal plan!</p>
            </div>
          ) : (
            <div className="saved-recipes-grid">
              {availableRecipes.map(recipe => (
                <div
                  key={recipe.id}
                  className={`saved-recipe-card ${draggedRecipe?.id === recipe.id ? 'dragging' : ''}`}
                  draggable
                  onDragStart={(e) => onDragStart(e, recipe)}
                  onDragEnd={onDragEnd}
                >
                  <div className="saved-recipe-image-container">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="saved-recipe-image"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/120/80';
                      }}
                    />
                  </div>
                  <div className="saved-recipe-info">
                    <a 
                      href={`/recipe/${recipe.id}`}
                      className="saved-recipe-title-link"
                    >
                      <h4 className="saved-recipe-title">{recipe.title}</h4>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlannerPage;