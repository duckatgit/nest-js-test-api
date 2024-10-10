import { Injectable } from '@nestjs/common';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseService {
  private firestore: Firestore;
  private auth: Auth;
  private adminAuth: admin.auth.Auth;

  constructor() {
    // Existing Firebase client initialization
    const firebaseConfig = {
      apiKey: "AIzaSyDXi8h_N5jeDj2KPp-FoSodsH-xRSgnCAY",
      authDomain: "todo-ad000.firebaseapp.com",
      projectId: "todo-ad000",
      storageBucket: "todo-ad000.appspot.com",
      messagingSenderId: "1094263040095",
      appId: "1:1094263040095:web:7d5c88a7ce378a6fadd3ea",
      measurementId: "G-G921M5T52C"
    };

    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }

    // Initialize Firebase Admin SDK with service account
    if (!admin.apps.length) {
      try {
        // Update the path to look for the file in the project root
        const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
        console.log('Looking for service account at:', serviceAccountPath);

        if (!fs.existsSync(serviceAccountPath)) {
          throw new Error(`Service account file not found at ${serviceAccountPath}`);
        }

        const serviceAccountContent = fs.readFileSync(serviceAccountPath, 'utf8');
        const serviceAccount = JSON.parse(serviceAccountContent);

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin initialized successfully');
      } catch (error) {
        console.error('Error initializing Firebase Admin:', error);
        throw error;
      }
    }

    this.firestore = getFirestore();
    this.auth = getAuth();
    this.adminAuth = admin.auth();
  }


  // Existing Firestore method
  getFirestore() {
    return this.firestore;
  }

  // Sign in method using email/password
  async signIn(email: string, password: string): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      return {
        message: 'User signed in successfully',
        user: user.email,
        uid: user.uid,
      };
    } catch (error) {
      console.error('Error signing in:', error.message);
      throw error;
    }
  }

  // New sign-up method using email/password
  async signUp(email: string, password: string): Promise<any> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      return {
        message: 'User signed up successfully',
        user: user.email,
        uid: user.uid,
      };
    } catch (error) {
      console.error('Error signing up:', error.message);
      throw error;
    }
  }

  async listAllUsers(maxResults = 1000): Promise<admin.auth.UserRecord[]> {
    try {
      console.log('Attempting to list users...');
      const listUsersResult = await this.adminAuth.listUsers(maxResults);
      console.log(`Successfully retrieved ${listUsersResult.users.length} users`);
      return listUsersResult.users;
    } catch (error) {
      console.error('Error listing users:', error);
      throw error;
    }
  }

}
