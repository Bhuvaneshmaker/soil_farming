import React from 'react';
import { Link } from 'react-router-dom';

const UserNavLinks = () => {
  return (
    <>
      <Link to="/soil-details">Soil Types</Link>
      <Link to="/distributor-details">Distributors</Link>
    </>
  );
};

export default UserNavLinks;