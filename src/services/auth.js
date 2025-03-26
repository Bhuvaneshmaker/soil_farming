import { signInWithEmailAndPassword, createUser WithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { logInfo, logError } from '../utils/logger';

/**
 * Signs up a new user with email and password.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @param {string} name - The name of the user.
 * @returns {Promise} - A promise that resolves with the user credential.
 */
export const signup = async (email, password, name) => {
    try {
        logInfo('Attempting to sign up user', { email });
        const userCredential = await createUser WithEmailAndPassword(auth, email, password);
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            name,
            email,
            role: 'user', // Default role for new users
            createdAt: new Date()
        });
        
        logInfo('User  signed up successfully', { uid: userCredential.user.uid });
        return userCredential.user;
    } catch (error) {
        logError('Error signing up user', { error });
        throw error; // Rethrow the error for handling in the calling function
    }
};

/**
 * Logs in a user with email and password.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise} - A promise that resolves with the user credential.
 */
export const login = async (email, password) => {
    try {
        logInfo('Attempting to login user', { email });
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        logInfo('User  logged in successfully', { uid: userCredential.user.uid });
        return userCredential.user;
    } catch (error) {
        logError('Error logging in user', { error });
        throw error; // Rethrow the error for handling in the calling function
    }
};

/**
 * Logs out the current user.
 * @returns {Promise} - A promise that resolves when the user is logged out.
 */
export const logout = async () => {
    try {
        logInfo('User  logging out');
        await signOut(auth);
        logInfo('User  logged out successfully');
    } catch (error) {
        logError('Error logging out user', { error });
        throw error; // Rethrow the error for handling in the calling function
    }
};