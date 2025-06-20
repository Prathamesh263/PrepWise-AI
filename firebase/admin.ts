import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
function initFirebaseAdmin() {
    const apps = getApps();

    if (!apps.length) {
        if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PROJECT_ID) {
            throw new Error('Firebase Admin credentials are missing. Please check your environment variables.');
        }

        try {
            initializeApp({
                credential: cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    // Replace newlines in the private key and ensure proper formatting
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                }),
            });
        } catch (error) {
            console.error('Failed to initialize Firebase Admin:', error);
            throw error;
        }
    }

    return {
        auth: getAuth(),
        db: getFirestore(),
    };
}

export const { auth, db } = initFirebaseAdmin();
