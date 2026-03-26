/// kobra's code 

import RecentlyViewed from "../components/RecentlyViewed";


import Veggie from "../components/Veggie";
import Popular from "../components/Popular";
import './Home.css';

const Home = () => {

/// kobra's code 
    return (
        <div className="home-container">
        <RecentlyViewed />
            <Popular />
            <Veggie />
        </div>
    )
}

export default Home;
