import './Cuisine.css';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { Skeleton } from '@mui/material';

const Cuisine = () => {
    const [cuisine, setCuisine] = useState([]);
    const params = useParams();
    
    // Get API key from environment variables
    const API_KEY = import.meta.env.VITE_RECIPE_API_KEY;

    const getCuisine = async (name) => {
        if (!API_KEY) {
            console.error('API key not found');
            return;
        }

        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&cuisine=${name}&number=12`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setCuisine(data.results || []);
            console.log('Cuisine recipes:', data.results);
        } catch (error) {
            console.error('Error fetching cuisine recipes:', error);
            setCuisine([]);
        }
    }

    useEffect(() => {
        getCuisine(params.type);
    }, [params.type]);

    if(cuisine.length === 0) {
        const number = [1,2,3,4,5,6,7,8,9,10];
        return (
            <div className="cuisine-skeleton">
            {number.map((data) => (
            <Skeleton 
                variant='rounded'
                width={300}
                height={200}
                key={data}
                animation='wave'
                className='cuisine-skltn'
            />
            ))}
            </div>
        )
    }

    return (
        <div className="cuisine-container">
            {cuisine.map((data) => (
                <RecipeCard data={data} key={data.id} />
            ))}
        </div>
    )
}

export default Cuisine;