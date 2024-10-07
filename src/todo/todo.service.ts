// todo.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class TodoService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async findAll() {
    const todosSnapshot = await this.firebaseService.getFirestore().collection('todos').get();
    return todosSnapshot.docs.map(doc => ({
      id: doc.id,        
      ...doc.data(),     
    }));
  }

  async findOne(id: string) {
    const todo = await this.firebaseService.getFirestore().collection('todos').doc(id).get();
    return todo.exists ? todo.data() : null;
  }

  async create(todoData: any) {
    const todoRef = await this.firebaseService.getFirestore().collection('todos').add(todoData);
    return {
      "message": "Todo Created successfully"
    };
  }

  async update(id: string, updateData: { title?: string; description?: string; completed?: boolean }) {
    const todoRef = this.firebaseService.getFirestore().collection('todos').doc(id);
    const todoDoc = await todoRef.get();

    // Check if the todo exists
    if (!todoDoc.exists) {
      throw new NotFoundException(`Todo with ID ${id} not found.`);
    }

    // Prepare the update object
    const updateFields: { title?: string; description?: string; completed?: boolean } = {};

    if (updateData.title !== undefined) {
      updateFields.title = updateData.title; // Update title if provided
    }

    if (updateData.description !== undefined) {
      updateFields.description = updateData.description; // Update description if provided
    }

    if (updateData.completed !== undefined) {
      updateFields.completed = updateData.completed; // Update completed status if provided
    }

    // Update the todo document in Firestore
    await todoRef.update(updateFields);

    // Return the updated todo item
    const updatedTodo = await todoRef.get();
    return { id: updatedTodo.id, ...updatedTodo.data() };
  }

  async remove(id: string) {
    await this.firebaseService.getFirestore().collection('todos').doc(id).delete();
    return { id };
  }
}
