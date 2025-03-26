import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logInfo } from '../../utils/logger';
import UserNavLinks from '../User/UserNavLink'; // Import UserNavLinks
import AdminNavLinks from '../Admin/AdminNavLink'; // Import AdminNavLinks
import './Navbar.css'; // Import the CSS file for styling

const Navbar = () => {
  const { currentUser , logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      logInfo('User  logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Bhuvi's Soil Farming</Link>
      </div>
      
      <div className="navbar-links">
        {currentUser  ? (
          <>
            {isAdmin ? <AdminNavLinks /> : <UserNavLinks />}
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;