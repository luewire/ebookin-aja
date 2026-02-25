import admin from 'firebase-admin';

let _initError: string | null = null;

if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.replace(/^gs:\/\//, '');

    if (!privateKey || !privateKey.includes('-----END PRIVATE KEY-----')) {
      _initError = 'FIREBASE_PRIVATE_KEY is missing or truncated. Check your .env.local file.';
      console.error('[firebase-admin]', _initError);
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      storageBucket: bucketName,
    });

    // Ensure storageBucket is set
    const app = admin.app();
    if (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET && !app.options.storageBucket) {
      app.options.storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET.replace(/^gs:\/\//, '');
    }
  } catch (err) {
    _initError = err instanceof Error ? err.message : String(err);
    console.error('[firebase-admin] Initialization failed:', _initError);
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : (null as unknown as admin.auth.Auth);
export const adminFirestore = admin.apps.length ? admin.firestore() : (null as unknown as admin.firestore.Firestore);
export const adminStorage = admin.apps.length ? admin.storage() : (null as unknown as admin.storage.Storage);

/**
 * Verify Firebase ID token from client
 * Returns decoded token or null if invalid
 */
export async function verifyIdToken(idToken: string) {
  if (!admin.apps.length || !adminAuth) {
    console.error('[firebase-admin] Cannot verify token — admin SDK not initialized.', _initError);
    return null;
  }
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    return null;
  }
}
