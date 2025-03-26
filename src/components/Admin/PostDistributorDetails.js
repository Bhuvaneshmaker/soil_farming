import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { logInfo, logError } from '../../utils/logger';

const PostDistributorDetails = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [cropTypes, setCropTypes] = useState('');
  const [seedsAvailable, setSeedsAvailable] = useState('');
  const [loading, setLoading] = useState(false);
  const [distributors, setDistributors] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

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
      setMessage({ text: 'Failed to load distributor data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setLocation('');
    setContactInfo('');
    setCropTypes('');
    setSeedsAvailable('');
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const distributorData = {
        name,
        location,
        contactInfo,
        cropTypes: cropTypes.split(',').map(crop => crop.trim()),
        seedsAvailable: seedsAvailable.split(',').map(seed => seed.trim()),
        updatedAt: new Date()
      };
      
      if (editId) {
        // Update existing distributor
        await updateDoc(doc(db, 'distributors', editId), distributorData);
        logInfo('Distributor updated successfully', { id: editId });
        setMessage({ text: 'Distributor updated successfully!', type: 'success' });
      } else {
        // Add new distributor
        const docRef = await addDoc(collection(db, 'distributors'), {
          ...distributorData,
          createdAt: new Date()
        });
        logInfo('Distributor added successfully', { id: docRef.id });
        setMessage({ text: 'Distributor added successfully!', type: 'success' });
      }
      
      resetForm();
      fetchDistributors();
    } catch (error) {
      logError('Error saving distributor', { error });
      setMessage({ text: 'Failed to save distributor data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (distributor) => {
    setEditId(distributor.id);
    setName(distributor.name);
    setLocation(distributor.location);
    setContactInfo(distributor.contactInfo);
    setCropTypes(distributor.cropTypes.join(', '));
    setSeedsAvailable(distributor.seedsAvailable.join(', '));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this distributor?')) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, 'distributors', id));
        logInfo('Distributor deleted successfully', { id });
        setMessage({ text: 'Distributor deleted successfully!', type: 'success' });
        fetchDistributors();
      } catch (error) {
        logError('Error deleting distributor', { error });
        setMessage({ text: 'Failed to delete distributor', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="distributor-management">
      <h2>{editId ? 'Edit Distributor' : 'Add New Distributor'}</h2>
      
      {message.text && (
        <div className={`alert ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Distributor Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="contactInfo">Contact Information</label>
          <textarea
            id="contactInfo"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="cropTypes">Crop Types (comma separated)</label>
          <textarea
            id="cropTypes"
            value={cropTypes}
            onChange={(e) => setCropTypes(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="seedsAvailable">Seeds Available (comma separated)</label>
          <textarea
            id="seedsAvailable"
            value={seedsAvailable}
            onChange={(e) => setSeedsAvailable(e.target.value)}
            required
          />
        </div>
        
        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (editId ? 'Update Distributor' : 'Add Distributor')}
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
      
      <h3>Existing Distributors</h3>
      {loading ? (
        <p>Loading distributor data...</p>
      ) : distributors.length === 0 ? (
        <p>No distributors added yet.</p>
      ) : (
        <div className="distributor-list">
          {distributors.map(distributor => (
            <div key={distributor.id} className="distributor-card">
              <h4>{distributor.name}</h4>
              <p><strong>Location:</strong> {distributor.location}</p>
              <p><strong>Crops:</strong> {distributor.cropTypes.join(', ')}</p>
              
              <div className="card-actions">
                <button 
                  className="edit-button" 
                  onClick={() => handleEdit(distributor)}
                >
                  Edit
                </button>
                <button 
                  className="delete-button" 
                  onClick={() => handleDelete(distributor.id)}
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

export default PostDistributorDetails;