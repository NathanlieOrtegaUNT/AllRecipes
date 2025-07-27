import { FaPizzaSlice, FaHamburger } from 'react-icons/fa';
import { GiNoodles, GiChopsticks } from 'react-icons/gi';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import './Category.css'

const Category = () => {
    const navigate = useNavigate();
    const { type } = useParams();

    const handleCategoryClick = (cuisine, e) => {

        if (type === cuisine) {
            e.preventDefault();
            navigate('/');
        }
    };

    return (
        <div className="category-container">
            <NavLink 
                to={'/cuisine/Italian'}
                onClick={(e) => handleCategoryClick('Italian', e)}
            >
                <FaPizzaSlice />
                <p>Italian</p>
            </NavLink>
            <NavLink 
                to={'/cuisine/American'}
                onClick={(e) => handleCategoryClick('American', e)}
            >
                <FaHamburger />
                <p>American</p>
            </NavLink>
            <NavLink 
                to={'/cuisine/Thai'}
                onClick={(e) => handleCategoryClick('Thai', e)}
            >
                <GiNoodles />
                <p>Thai</p>
            </NavLink>
            <NavLink 
                to={'/cuisine/Chinese'}
                onClick={(e) => handleCategoryClick('Chinese', e)}
            >
                <GiChopsticks />
                <p>Chinese</p>
            </NavLink>
        </div>
    )
}

export default Category;