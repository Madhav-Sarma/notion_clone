import { initializeApp, getApps, App, getApp, cert } from "firebase-admin/app";

import { getFirestore } from "firebase-admin/firestore";

{/*const servicekey = require("./service_key.json");*/}
const servicekey = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64!, "base64").toString("utf-8")
);
let app: App;

if (getApps().length === 0) {
    app = initializeApp({
        credential: cert(servicekey),
    });
} else {
    app = getApps()[0];
}

const adminDb = getFirestore(app);

export { app as adminApp, adminDb };