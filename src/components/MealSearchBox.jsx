import React, { useState, useEffect } from 'react';
import { API_KEY } from "../assets/API_KEY";
import './MealSearchBox.css'; // Optional: styling

const MealSearchBox = ({ onUpdateFilteredRecipes }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (searchTerm.trim() === '') {
      onUpdateFilteredRecipes([]);
      return;
    }

    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?query=${searchTerm}&number=10&apiKey=${API_KEY}`
        );
        const data = await response.json();
        onUpdateFilteredRecipes(data.results || []);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, [searchTerm, onUpdateFilteredRecipes]);

  return (
    <div className="meal-search-box">
      <input
        type="text"
        placeholder="Search for meals..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default MealSearchBox;