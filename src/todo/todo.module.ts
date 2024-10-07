// todo.module.ts
import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { FirebaseModule } from '../firebase/firebase.module';  // Make sure FirebaseModule is imported

@Module({
  imports: [FirebaseModule],  // Import the FirebaseModule
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
