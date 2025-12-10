# Firebase + Firestore Setup

This project is ready to talk to a brand new Firebase project with Cloud Firestore. The app writes/reads from a `notes` collection so you can verify connectivity before wiring it into the voxel game data.

## 1) Create a fresh Firebase project (user action)
1. Go to https://console.firebase.google.com/ → **Add project**.
2. Skip Google Analytics unless you want it.
3. In the new project, click **</> Web** to register a web app (no hosting required) and keep the config object handy.

## 2) Enable Firestore (user action)
1. In the Firebase console, open **Build → Firestore Database**.
2. Click **Create database**, pick a region close to your users.
3. Start in **Production** mode (recommended). You can temporarily loosen rules during development; see the rules snippet below.

## 3) Add config locally
1. Copy `env.example` to `.env.local`.
2. Paste your Firebase web app config values:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
   `.env.local` is git-ignored.

## 4) Install deps & run
```bash
npm install         # already done once, re-run if needed
npm run dev
```
Visit the printed localhost URL. Use the form to add a note; it will create/read docs in the `notes` collection so you know Firestore is connected.

## 5) Optional: Firestore rules for development
For authenticated access (recommended):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
For quick local testing without auth, you can temporarily allow public access:
```
allow read, write: if true;
```
Revert this before shipping.

## Project files added
- `src/lib/firebase.js` – initializes the Firebase app and Firestore using Vite env vars.
- `src/App.jsx` – demo UI that writes/reads `notes` to confirm Firestore connectivity.
- `env.example` – copy to `.env.local` and fill with your Firebase web config.
