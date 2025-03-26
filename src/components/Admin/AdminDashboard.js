import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <p>Welcome, {currentUser?.name || 'Admin'}</p>
      
      <div className="dashboard-tiles">
        <div className="dashboard-tile">
          <h3>Soil Management</h3>
          <p>Add or update soil type information for farmers</p>
          <Link to="/admin/post-soil" className="dashboard-button">
            Manage Soil Details
          </Link>
        </div>
        
        <div className="dashboard-tile">
          <h3>Distributor Management</h3>
          <p>Manage seed and crop distributor information</p>
          <Link to="/admin/post-distributor" className="dashboard-button">
            Manage Distributors
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;