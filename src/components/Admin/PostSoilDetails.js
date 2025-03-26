import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { logInfo, logError } from '../../utils/logger';

const PostSoilDetails = () => {
  const [soilType, setSoilType] = useState('');
  const [pH, setPH] = useState('');
  const [nutrients, setNutrients] = useState('');
  const [suitableCrops, setSuitableCrops] = useState('');
  const [characteristics, setCharacteristics] = useState('');
  const [loading, setLoading] = useState(false);
  const [soils, setSoils] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

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
      setMessage({ text: 'Failed to load soil data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSoilType('');
    setPH('');
    setNutrients('');
    setSuitableCrops('');
    setCharacteristics('');
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const soilData = {
        soilType,
        pH: parseFloat(pH),
        nutrients,
        suitableCrops: suitableCrops.split(',').map(crop => crop.trim()),
        characteristics,
        updatedAt: new Date()
      };
      
      if (editId) {
        // Update existing soil
        await updateDoc(doc(db, 'soils', editId), soilData);
        logInfo('Soil updated successfully', { id: editId });
        setMessage({ text: 'Soil updated successfully!', type: 'success' });
      } else {
        // Add new soil
        const docRef = await addDoc(collection(db, 'soils'), {
          ...soilData,
          createdAt: new Date()
        });
        logInfo('Soil added successfully', { id: docRef.id });
        setMessage({ text: 'Soil added successfully!', type: 'success' });
      }
      
      resetForm();
      fetchSoils();
    } catch (error) {
      logError('Error saving soil', { error });
      setMessage({ text: 'Failed to save soil data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (soil) => {
    setEditId(soil.id);
    setSoilType(soil.soilType);
    setPH(soil.pH.toString());
    setNutrients(soil.nutrients);
    setSuitableCrops(soil.suitableCrops.join(', '));
    setCharacteristics(soil.characteristics);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this soil type?')) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, 'soils', id));
        logInfo('Soil deleted successfully', { id });
        setMessage({ text: 'Soil deleted successfully!', type: 'success' });
        fetchSoils();
      } catch (error) {
        logError('Error deleting soil', { error });
        setMessage({ text: 'Failed to delete soil', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="soil-management">
      <h2>{editId ? 'Edit Soil Details' : 'Add New Soil Type'}</h2>
      
      {message.text && (
        <div className={`alert ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="soilType">Soil Type</label>
          <input
            type="text"
            id="soilType"
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="pH">pH Level</label>
          <input
            type="number"
            id="pH"
            step="0.1"
            min="0"
            max="14"
            value={pH}
            onChange={(e) => setPH(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="nutrients">Nutrients</label>
          <textarea
            id="nutrients"
            value={nutrients}
            onChange={(e) => setNutrients(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="suitableCrops">Suitable Crops (comma separated)</label>
          <textarea
            id="suitableCrops"
            value={suitableCrops}
            onChange={(e) => setSuitableCrops(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="characteristics">Characteristics</label>
          <textarea
            id="characteristics"
            value={characteristics}
            onChange={(e) => setCharacteristics(e.target.value)}
            required
          />
        </div>
        
        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (editId ? 'Update Soil' : 'Add Soil')}
          </button>
          
          {editId && (
            <button 
              type="button" 
              className="cancel-button" 
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
      
      <h3>Existing Soil Types</h3>
      {loading ? (
        <p>Loading soil data...</p>
      ) : soils.length === 0 ? (
        <p>No soil types added yet.</p>
      ) : (
        <div className="soil-list">
          {soils.map(soil => (
            <div key={soil.id} className="soil-card">
              <h4>{soil.soilType}</h4>
              <p><strong>pH:</strong> {soil.pH}</p>
              <p><strong>Suitable Crops:</strong> {soil.suitableCrops.join(', ')}</p>
              
              <div className="card-actions">
                <button 
                  className="edit-button" 
                  onClick={() => handleEdit(soil)}
                >
                  Edit
                </button>
                <button 
                  className="delete-button" 
                  onClick={() => handleDelete(soil.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostSoilDetails;