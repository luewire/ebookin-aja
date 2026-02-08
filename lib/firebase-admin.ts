import admin from 'firebase-admin';

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.replace(/^gs:\/\//, '');

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
    storageBucket: bucketName,
  });
}

// Ensure the app is correctly initialized even if it was started elsewhere
const app = admin.app();
if (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET && !app.options.storageBucket) {
    app.options.storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET.replace(/^gs:\/\//, '');
}

export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
export const adminStorage = admin.storage();

/**
 * Verify Firebase ID token from client
 * Returns decoded token or null if invalid
 */
export async function verifyIdToken(idToken: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    return null;
  }
}
