// firebase.service.ts
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../service-account.json';

@Injectable()
export class FirebaseService {
  private firestore: FirebaseFirestore.Firestore;

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
    }
    this.firestore = admin.firestore();
  }

  // Expose Firestore through a public getter
  getFirestore() {
    return this.firestore;
  }
}
