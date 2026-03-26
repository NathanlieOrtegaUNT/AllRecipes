import { useEffect, useState } from 'react';
import RecipeCard from './RecipeCard';

const RecentlyViewed = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        try {
            const storedRecipes = JSON.parse(localStorage.getItem('recentRecipes')) || [];
            // Ensure max 10 items
            setRecipes(storedRecipes.slice(0, 10));
        } catch (error) {
            console.error('Error loading recently viewed recipes:', error);
            setRecipes([]);
        }
    }, []);

    if (recipes.length === 0) {
        return (
            <div>
                <h2>Recently Viewed Recipes</h2>
                <p>No recently viewed recipes yet.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Recently Viewed Recipes</h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} data={recipe} />
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewed;