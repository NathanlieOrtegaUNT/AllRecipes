import React, { useState } from 'react';
import MealSearchBox from '../components/MealSearchBox';
import './MealPlannerPage.css';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MealPlannerPage = () => {
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [mealPlan, setMealPlan] = useState({});

  const handleAssignRecipe = (day, recipe) => {
    setMealPlan(prev => {
      const currentRecipes = prev[day] || [];
      if (currentRecipes.length >= 5) {
        alert('You can only assign up to 5 recipes per day.');
        return prev;
      }
      return {
        ...prev,
        [day]: [...currentRecipes, recipe]
      };
    });
  };

  const handleRemoveRecipe = (day, indexToRemove) => {
    setMealPlan(prev => {
      const newRecipes = (prev[day] || []).filter((_, i) => i !== indexToRemove);
      return {
        ...prev,
        [day]: newRecipes
      };
    });
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, day) => {
    const data = JSON.parse(e.dataTransfer.getData('recipe'));
    handleAssignRecipe(day, data);
  };

  const onDragStart = (e, recipe) => {
    e.dataTransfer.setData('recipe', JSON.stringify(recipe));
  };

  return (
    <div className="meal-planner-container">
      <h1 className="meal-planner-title">Meal Planner</h1>

      <MealSearchBox onUpdateFilteredRecipes={setFilteredRecipes} />

      <div className="days-row">
        {daysOfWeek.map(day => (
          <div key={day} className="day-column" onDragOver={allowDrop} onDrop={(e) => onDrop(e, day)}>
            <h3>{day}</h3>
            <div className="drop-zone">
              {(mealPlan[day] && mealPlan[day].length > 0) ? (
                mealPlan[day].map((recipe, index) => (
                  <div className="recipe-item" key={index}>
                    <span>{recipe.title}</span>
                    <button className="remove-btn" onClick={() => handleRemoveRecipe(day, index)}>Remove</button>
                  </div>
                ))
              ) : (
                <p className="placeholder">No meal assigned</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="search-results-box">
        <h2>Search Results</h2>
        <div className="results-grid">
          {filteredRecipes.map(recipe => (
            <div
              key={recipe.id}
              className="recipe-card"
              draggable
              onDragStart={(e) => onDragStart(e, recipe)}
              onClick={() => {
                const dayInput = prompt('Assign to which day? (e.g., Monday)');
                if (!dayInput) return;
                const dayFormatted = daysOfWeek.find(
                  d => d.toLowerCase() === dayInput.trim().toLowerCase()
                );
                if (dayFormatted) {
                  handleAssignRecipe(dayFormatted, recipe);
                } else {
                  alert('Invalid day. Please try again.');
                }
              }}
            >
              <img src={recipe.image} alt={recipe.title} width="100" />
              <p>{recipe.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealPlannerPage;