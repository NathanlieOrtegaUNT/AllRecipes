// AllRecipes/src/pages/Pages.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./Home";
import Cuisine from "./Cuisine";
import Searched from "./Searched";
import Recipe from "./Recipe";
import AuthPage from "./AuthPage";
import MyFavorites from "./MyFavorites";
import Category from "../components/Category";
import Search from "../components/Search";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Pages = () => {
    return (
        <Router>
            <div style={{ minHeight: '100vh' }}>
                <Header />
                <div className="pages-container" style={{ 
                    paddingTop: '80px',  // Space for fixed header
                    paddingBottom: '60px', // Space for fixed footer
                    minHeight: 'calc(100vh - 140px)' // Ensure content area fills space
                }}>
                    <Routes>
                        {/* ORIGINAL ROUTES - Keep exactly as they were */}
                        <Route path="/" element={[<Search />, <Category />, <Home />]} />
                        <Route path="/cuisine/:type" element={[<Search />, <Category />, <Cuisine />]} />
                        <Route path="/searched/:search" element={[<Search />, <Category />, <Searched />]} />
                        <Route path="/searched/:search/recipe/:name" element={<Recipe />} />
                        <Route path="/cuisine/:type/recipe/:name" element={<Recipe />} />
                        <Route path="/recipe/:name" element={<Recipe />} />
                        
                        {/* LOGIN ROUTE - Use your existing AuthPage */}
                        <Route path="/login" element={<AuthPage />} />
                        
                        {/* NEW: MY FAVORITES ROUTE */}
                        <Route path="/my-favorites" element={<MyFavorites />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
};

export default Pages;