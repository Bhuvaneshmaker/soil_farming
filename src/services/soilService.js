import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { logInfo, logError } from '../utils/logger';

/**
 * Fetches all soil types from Firestore.
 * @returns {Promise<Array>} - A promise that resolves with an array of soil types.
 */
export const fetchSoils = async () => {
    try {
        const soilCollection = collection(db, 'soils');
        const soilSnapshot = await getDocs(soilCollection);
        const soilList = soilSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        logInfo('Soil data fetched successfully', { soilList });
        return soilList;
    } catch (error) {
        logError('Error fetching soils', { error });
        throw error; // Rethrow the error for handling in the calling function
    }
};

/**
 * Adds a new soil type to Firestore.
 * @param {Object} soilData - The data of the soil type to add.
 * @returns {Promise<Object>} - A promise that resolves with the added soil document.
 */
export const addSoil = async (soilData) => {
    try {
        const docRef = await addDoc(collection(db, 'soils'), {
            ...soilData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        logInfo('Soil added successfully', { id: docRef.id });
        return { id: docRef.id, ...soilData };
    } catch (error) {
        logError('Error adding soil', { error });
        throw error; // Rethrow the error for handling in the calling function
    }
};

/**
 * Updates an existing soil type in Firestore.
 * @param {string} id - The ID of the soil type to update.
 * @param {Object} soilData - The updated data of the soil type.
 * @returns {Promise<void>} - A promise that resolves when the soil type is updated.
 */
export const updateSoil = async (id, soilData) => {
    try {
        await updateDoc(doc(db, 'soils', id), {
            ...soilData,
            updatedAt: new Date()
        });
        logInfo('Soil updated successfully', { id });
    } catch (error) {
        logError('Error updating soil', { error });
        throw error; // Rethrow the error for handling in the calling function
    }
};

/**
 * Deletes a soil type from Firestore.
 * @param {string} id - The ID of the soil type to delete.
 * @returns {Promise<void>} - A promise that resolves when the soil type is deleted.
 */
export const deleteSoil = async (id) => {
    try {
        await deleteDoc(doc(db, 'soils', id));
        logInfo('Soil deleted successfully', { id });
    } catch (error) {
        logError('Error deleting soil', { error });
        throw error; // Rethrow the error for handling in the calling function
    }
};