-- Promote user to ADMIN role
-- Run this in your Neon/Supabase SQL editor

-- Option 1: Promote by email
UPDATE "User" 
SET role = 'ADMIN' 
WHERE email = 'your-email@gmail.com';  -- ⚠️ CHANGE THIS

-- Option 2: Promote by Firebase UID (check browser console: firebase.auth().currentUser.uid)
UPDATE "User" 
SET role = 'ADMIN' 
WHERE "firebaseUid" = 'your-firebase-uid';  -- ⚠️ CHANGE THIS

-- Option 3: Check all users
SELECT id, email, role, "firebaseUid" 
FROM "User" 
ORDER BY "createdAt" DESC;

-- Option 4: Promote first user (if you only have one user)
UPDATE "User" 
SET role = 'ADMIN' 
WHERE id = (SELECT id FROM "User" ORDER BY "createdAt" ASC LIMIT 1);
