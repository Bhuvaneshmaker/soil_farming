import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { logError } from '../../utils/logger';
import './ViewSoilDetails.css'; // Assuming you have a CSS file for styles

const SoilCard = ({ soil }) => {
  const suitableCrops = Array.isArray(soil.suitableCrops) ? soil.suitableCrops : [];

  return (
    <div className="soil-card">
      <h3>{soil.soilType}</h3>
      <div className="soil-property">
        <span className="property-label">pH Level:</span>
        <span className="property-value">{soil.pH}</span>
      </div>
      <div className="soil-property">
        <span className="property-label">Nutrients:</span>
        <p className="property-value">{soil.nutrients}</p>
      </div>
      <div className="soil-property">
        <span className="property-label">Characteristics:</span>
        <p className="property-value">{soil.characteristics}</p>
      </div>
      <div className="soil-property">
        <span className="property-label">Suitable Crops:</span>
        <div className="crop-tags">
          {suitableCrops.length > 0 ? (
            suitableCrops.map((crop, index) => (
              <span key={index} className="crop-tag">{crop}</span>
            ))
          ) : (
            <span>No suitable crops listed</span>
          )}
        </div> 
      </div>
    </div>
  );
};

const ViewSoilDetails = () => {
  const [soils, setSoils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSoils();
  }, []);

  const fetchSoils = async () => {
    try {
      setLoading(true);
      const soilCollection = collection(db, 'soils');
      const soilSnapshot = await getDocs(soilCollection);
      const soilList = soilSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSoils(soilList);
    } catch (error) {
      logError('Error fetching soils', { error });
      setError('Failed to load soil data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSoils = soils.filter(soil => {
    const matchesSearch = soil.soilType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          soil.characteristics.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCrop = cropFilter === '' || 
      (soil.suitableCrops && 
      soil.suitableCrops.some(crop => 
      crop.toLowerCase().includes(cropFilter.toLowerCase())
                           ));

    return matchesSearch && matchesCrop;
  });

  return (
    <div className="soil-details-container">
      <h2>Soil Types Information</h2>

      {error && <div className="error-alert">{error}</div>}

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="search">Search Soils:</label>
          <input
            type="text"
            id="search"
            placeholder="Search by soil type or characteristics"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search soils"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="cropFilter">Filter by Crop:</label>
          <input
            type="text"
            id="cropFilter"
            placeholder="Enter crop name"
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            aria-label="Filter by crop"
            required 
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading soil information...</div>
      ) : filteredSoils.length === 0 ? (
        <div className="no-results">
          No soil types found matching your criteria.
        </div>
      ) : (
        <div className="soil-grid">
          {filteredSoils.map(soil => (
            <SoilCard key={soil.id} soil={soil} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewSoilDetails;