import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavLinks = () => {
  return (
    <>
      <Link to="/admin/dashboard">Dashboard</Link>
      <Link to="/admin/post-soil">Soil Management</Link>
      <Link to="/admin/post-distributor">Distributor Management</Link>
    </>
  );
};

export default AdminNavLinks; 