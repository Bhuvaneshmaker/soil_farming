import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { logError } from '../../utils/logger';
import './ViewDistributorDetails.css'; // Assuming you have a CSS file for styles

const DistributorCard = ({ distributor }) => {
  // Ensure cropTypes and seedsAvailable are arrays
  const cropTypes = Array.isArray(distributor.cropTypes) ? distributor.cropTypes : [];
  const seedsAvailable = Array.isArray(distributor.seedsAvailable) ? distributor.seedsAvailable : [];

  return (
    <div className="distributor-card">
      <h3>{distributor.name}</h3>
      <div className="distributor-property">
        <span className="property-label">Location:</span>
        <span className="property-value">{distributor.location}</span>
      </div>
      <div className="distributor-property">
        <span className="property-label">Contact Information:</span>
        <p className="property-value">{distributor.contactInfo}</p>
      </div>
      <div className="distributor-property">
        <span className="property-label">Crop Types:</span>
        <div className="tag-container">
          {cropTypes.length > 0 ? (
            cropTypes.map((crop, index) => (
              <span key={index} className="crop-tag">{crop}</span>
            ))
          ) : (
            <span>No crop types available</span>
          )}
        </div>
      </div>
      <div className="distributor-property">
        <span className="property-label">Seeds Available:</span>
        <div className="tag-container">
          {seedsAvailable.length > 0 ? (
            seedsAvailable.map((seed, index) => (
              <span key={index} className="seed-tag">{seed}</span>
            ))
          ) : (
            <span>No seeds available</span>
          )}
        </div>
      </div>
    </div>
  );
};

const ViewDistributorDetails = () => {
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDistributors();
  }, []);

  const fetchDistributors = async () => {
    try {
      setLoading(true);
      const distributorCollection = collection(db, 'distributors');
      const distributorSnapshot = await getDocs(distributorCollection);
      const distributorList = distributorSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDistributors(distributorList);
    } catch (error) {
      logError('Error fetching distributors', { error });
      setError('Failed to load distributor data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredDistributors = distributors.filter(distributor => {
    const matchesSearch = distributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          distributor.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCrop = cropFilter === '' || 
                        (Array.isArray(distributor.cropTypes) && 
                         distributor.cropTypes.some(crop => 
                           crop.toLowerCase().includes(cropFilter.toLowerCase())
                         )) ||
                        (Array.isArray(distributor.seedsAvailable) && 
                         distributor.seedsAvailable.some(seed => 
                           seed.toLowerCase().includes(cropFilter.toLowerCase())
                         ));

    return matchesSearch && matchesCrop;
  });

  return (
    <div className="distributor-details-container">
      <h2>Seed and Crop Distributors</h2>

      {error && <div className="error-alert">{error}</div>}

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="search">Search Distributors:</label>
          <input
            type="text"
            id="search"
            placeholder="Search by name or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search distributors"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="cropFilter">Filter by Crop/Seed:</label>
          <input
            type="text"
            id="cropFilter"
            placeholder="Enter crop or seed type"
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            aria-label="Filter by crop or seed"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading distributor information...</div>
      ) : filteredDistributors.length === 0 ? (
        <div className="no-results">
          No distributors found matching your criteria.
        </div>
      ) : (
        <div className="distributor-grid">
          {filteredDistributors.map(distributor => (
            <DistributorCard key={distributor.id} distributor={distributor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewDistributorDetails;