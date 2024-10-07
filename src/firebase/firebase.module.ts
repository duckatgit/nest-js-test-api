// firebase.module.ts
import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],  // This is important for exporting FirebaseService
})
export class FirebaseModule {}
