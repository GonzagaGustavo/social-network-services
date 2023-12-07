import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../../secret/social-network-firebase-adminsdk.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  storageBucket: process.env.BUCKET,
});

export const storage = admin.storage();
