import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import './Searched.css';
import { Skeleton } from "@mui/material";

const Searched = () => {
    const [searchedRecipes, setSearchedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasSearched, setHasSearched] = useState(false);
    const params = useParams();
    const [searchParams] = useSearchParams();
    const cuisine = searchParams.get('cuisine');

    const API_KEY = import.meta.env.VITE_RECIPE_API_KEY;

    const getSearched = async (searchTerm, cuisineFilter) => {
        setLoading(true);
        setHasSearched(true);

        if (!API_KEY) {
            console.error('API key not found');
            setLoading(false);
            return;
        }

        try {
            let apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${searchTerm}&number=12`;
            
            if (cuisineFilter && cuisineFilter !== 'all') {
                apiUrl += `&cuisine=${cuisineFilter}`;
            }

            console.log('API URL:', apiUrl);

            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('API Response:', data);
            
            setSearchedRecipes(data.results || []);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setSearchedRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSearched(params.search, cuisine);
    }, [params.search, cuisine]);

    const getCuisineName = (cuisineKey) => {
        const cuisineNames = {
            italian: 'Italian',
            american: 'American',
            thai: 'Thai',
            chinese: 'Chinese'
        };
        return cuisineNames[cuisineKey] || cuisineKey;
    };

    if (loading) {
        const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        return (
            <div className="searched-container">
                <div className="search-header">
                    <h2>Searching...</h2>
                </div>
                <div className="cuisine-skeleton">
                    {number.map((data) => (
                        <Skeleton 
                            variant="rounded"
                            width={300}
                            height={200}
                            animation='wave'
                            key={data}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="searched-container">
            {/* Results or No Results Message */}
            {hasSearched && searchedRecipes.length === 0 ? (
                <div>
                    {/* Search Results Header */}
                    <div className="search-header">
                        <h2>
                            {cuisine && cuisine !== 'all' ? (
                                <>Search results for "{params.search}" in <span className="cuisine-highlight">{getCuisineName(cuisine)}</span> cuisine</>
                            ) : (
                                <>Search results for "{params.search}"</>
                            )}
                        </h2>
                        
                        {cuisine && cuisine !== 'all' && (
                            <div className="filter-badge">
                                <span className="filter-label">Filtered by:</span>
                                <span className="filter-value">{getCuisineName(cuisine)}</span>
                            </div>
                        )}
                    </div>

                    <div className="no-results">
                        <div className="no-results-icon">🔍</div>
                        <h3>No recipes found</h3>
                        <p>
                            {cuisine && cuisine !== 'all' ? (
                                <>
                                    Sorry, we couldn't find any <strong>{getCuisineName(cuisine)}</strong> recipes matching "<strong>{params.search}</strong>".
                                    <br />
                                    Try searching for different ingredients or remove the cuisine filter.
                                </>
                            ) : (
                                <>
                                    Sorry, we couldn't find any recipes matching "<strong>{params.search}</strong>".
                                    <br />
                                    Try searching for different ingredients or check your spelling.
                                </>
                            )}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="recipe-grid">
                    {searchedRecipes.map((data) => (
                        <RecipeCard data={data} key={data.id} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Searched;