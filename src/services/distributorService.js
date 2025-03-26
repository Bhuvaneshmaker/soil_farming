import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { logInfo, logError } from '../utils/logger';

/**
 * Fetches all distributors from Firestore.
 * @returns {Promise<Array>} - A promise that resolves with an array of distributors.
 */
export const fetchDistributors = async () => {
    try {
        const distributorCollection = collection(db, 'distributors');
        const distributorSnapshot = await getDocs(distributorCollection);
        const distributorList = distributorSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        logInfo('Distributor data fetched successfully', { distributorList });
        return distributorList;
    } catch (error) {
        logError('Error fetching distributors', { error });
        throw error; // Rethrow the error for handling in the calling function
    }
};

/**
 * Adds a new distributor to Firestore.
 * @param {Object} distributorData - The data of the distributor to add.
 * @returns {Promise<Object>} - A promise that resolves with the added distributor document.
 */
export const addDistributor = async (distributorData) => {
    try {
        const docRef = await addDoc(collection(db, 'distributors'), {
            ...distributorData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        logInfo('Distributor added successfully', { id: docRef.id });
        return { id: docRef.id, ...distributorData };
    } catch (error) {
        logError('Error adding distributor', { error });
        throw error; // Rethrow the error for handling in the calling function
    }
};

/**
 * Updates an existing distributor in Firestore.
 * @param {string} id - The ID of the distributor to update.
 * @param {Object} distributorData - The updated data of the distributor.
 * @returns {Promise<void>} - A promise that resolves when the distributor is updated.
 */
export const updateDistributor = async (id, distributorData) => {
    try {
        await updateDoc(doc(db, 'distributors', id), {
            ...distributorData,
            updatedAt: new Date()
        });
        logInfo('Distributor updated successfully', { id });
    } catch (error) {
        logError('Error updating distributor', { error });
        throw error; // Rethrow the error for handling in the calling function
    }
};

/**
 * Deletes a distributor from Firestore.
 * @param {string} id - The ID of the distributor to delete.
 * @returns {Promise<void>} - A promise that resolves when the distributor is deleted.
 */
export const deleteDistributor = async (id) => {
    try {
        await deleteDoc(doc(db, 'distributors', id));
        logInfo('Distributor deleted successfully', { id });
    } catch (error) {
        logError('Error deleting distributor', { error });
        throw error; // Rethrow the error for handling in the calling function
    }
};