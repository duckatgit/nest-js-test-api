// app.module.ts
import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [TodoModule],  // Add TodoModule to imports
})
export class AppModule {}
