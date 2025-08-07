// Firebase configuration
import {initializeApp, getApps} from 'firebase/app';
import {getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

// Your web app's Firebase configuration - using direct values to avoid env variable issues
const firebaseConfig = {
    apiKey: "AIzaSyBq1LXiNKFQ4vUYN_8F_6rxollSBMjTawM",
    authDomain: "speech-issues-analyzer.firebaseapp.com",
    projectId: "speech-issues-analyzer",
    storageBucket: "speech-issues-analyzer.firebasestorage.app",
    messagingSenderId: "1060002679548",
    appId: "1:1060002679548:web:232503794fe0ac655ca579",
    measurementId: "G-R9ZQWNBNW5"
};

// Initialize Firebase - prevent multiple initialization
let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider with additional settings
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Authentication functions
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error: any) {
        // Handle popup cancellation at the Firebase level
        if (
            error.code === 'auth/popup-closed-by-user' ||
            error.code === 'auth/cancelled-popup-request' ||
            error.code === 'auth/popup-blocked'
        ) {
            // Throw a custom error that our hook can handle more gracefully
            const cancellationError = new Error('User cancelled sign-in');
            cancellationError.name = 'UserCancellation';
            throw cancellationError;
        }

        console.error('Error signing in with Google:', error);
        throw error;
    }
};

export const registerWithEmailAndPassword = async (email: string, password: string) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        return result.user;
    } catch (error) {
        console.error('Error registering with email and password:', error);
        throw error;
    }
};

export const loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    } catch (error) {
        console.error('Error signing in with email and password:', error);
        throw error;
    }
};

export const resetPassword = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
};

export const logOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};

export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};

export { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail };
