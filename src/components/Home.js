import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css'; // Import the CSS file

const Home = () => {
  const { currentUser , isAdmin } = useAuth();

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>Welcome to the Soil Farming Agent</h1>
        <p className="hero-subtitle">
          Find the perfect soil for your crops and connect with trusted distributors
        </p>

        {!currentUser  ? (
          <div className="cta-buttons">
            <Link to="/register" className="cta-button primary">
              Sign Up
            </Link>
            <Link to="/login" className="cta-button secondary">
              Login
            </Link>
          </div>
        ) : (
          <div className="user-buttons">
            <h2>Hello, {currentUser.name}...</h2>
            <Link to="/soil-details" className="cta-button primary">
              View Soil Types
            </Link>
            <Link to="/distributor-details" className="cta-button secondary">
              View Distributors
            </Link>

            {isAdmin && (
              <Link to="/admin/dashboard" className="cta-button admin">
                Admin Dashboard
              </Link>
            )}
          </div>
        )}
      </section>

      <section className="features-section">
        <h2>Why Use Soil Farming Agent?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-seedling"></i></div>
            <h3>Detailed Soil Information</h3>
            <p>
              Access comprehensive information about various soil types,
              their characteristics, and suitability for different crops.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-truck"></i></div>
            <h3>Find Distributors</h3>
            <p>
              Connect with seed and crop distributors to source the 
              best materials for your agricultural needs.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-book-open"></i></div>
            <h3>Expert Knowledge</h3>
            <p>
              Soil and crop information curated by specialists to 
              help you make informed farming decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create an Account</h3>
            <p>Sign up to access our soil and distributor database.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Explore Soil Types</h3>
            <p>Browse through detailed soil information to find what's best for your crops.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Locate Distributors</h3>
            <p>Find and connect with seed and crop distributors in your area.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;