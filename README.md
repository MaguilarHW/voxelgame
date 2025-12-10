# Firebase + Firestore Setup

✅ **Firebase project created!** Project ID: `voxelgame-1765330443`

The Firebase project and web app are set up. You just need to enable Firestore to complete the setup.

## Enable Firestore (one-time action required)

**Click this link to enable Firestore:**
👉 https://console.firebase.google.com/project/voxelgame-1765330443/firestore

Or manually:

1. Go to https://console.firebase.google.com/project/voxelgame-1765330443/firestore
2. Click **Create database**
3. Choose **Production mode** (recommended) or **Test mode** for quick testing
4. Select a region (e.g., `us-central1`) and click **Enable**

The Firestore rules file (`firestore.rules`) is already configured with open access for development. You can deploy it later with:

```bash
firebase deploy --only firestore:rules
```

## Configuration

✅ **Already configured!** The `.env.local` file has been created with your Firebase config:

- Project ID: `voxelgame-1765330443`
- Web App ID: `1:592181234962:web:3744746c3ff0f809f0f7cb`

The config is ready to use. Just enable Firestore above and you're good to go!

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
