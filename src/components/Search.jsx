import './Search.css';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const [input, setInput] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('all');
    const navigate = useNavigate();

    const cuisineOptions = [
        { value: 'all', label: 'All Cuisines' },
        { value: 'italian', label: 'Italian' },
        { value: 'american', label: 'American' },
        { value: 'thai', label: 'Thai' },
        { value: 'chinese', label: 'Chinese' }
    ];

    const handleInput = (e) => { setInput(e.target.value) }
    
    const handleSubmit = (e) => { 
        e.preventDefault();
        
        if (input.trim() === '') {
            return;
        }

        if (selectedCuisine !== 'all') {
            navigate(`/searched/${input}?cuisine=${selectedCuisine}`);
        } else {
            navigate('/searched/' + input);
        }
    }

    return (
        <div className="search-container">
            <form onSubmit={handleSubmit} className="search-form">
                {/* Cuisine Filter Dropdown */}
                <div className="cuisine-filter-container">
                    <select 
                        value={selectedCuisine} 
                        onChange={(e) => setSelectedCuisine(e.target.value)}
                        className="cuisine-select"
                    >
                        {cuisineOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Original Search Input */}
                <div className="search-input-wrapper">
                    <FaSearch />
                    <input 
                        type="text" 
                        className='search-field'
                        value={input}
                        onChange={handleInput}
                        placeholder={
                            selectedCuisine === 'all' 
                                ? "Search for recipes..." 
                                : `Search ${cuisineOptions.find(c => c.value === selectedCuisine)?.label} recipes...`
                        }
                    />
                </div>
            </form>
            
            {/* Filter Indicator */}
            {selectedCuisine !== 'all' && (
                <div className="filter-indicator">
                    <span className="filter-text">
                        Filtering by: <strong>{cuisineOptions.find(c => c.value === selectedCuisine)?.label}</strong>
                    </span>
                    <button 
                        type="button" 
                        onClick={() => setSelectedCuisine('all')}
                        className="clear-filter"
                    >
                        Clear Filter
                    </button>
                </div>
            )}
        </div>
    )
}

export default Search;