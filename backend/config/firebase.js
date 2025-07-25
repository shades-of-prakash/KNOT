// import admin from "firebase-admin";
// import dotenv from "dotenv";
// dotenv.config();

// // Parse service account JSON from env string
// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

// admin.initializeApp({
// 	credential: admin.credential.cert(serviceAccount),
// 	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
// });

// export const bucket = admin.storage().bucket();

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

export const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY
);

export const profileBucket = supabase.storage.from("profiles");
