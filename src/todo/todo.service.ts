import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { Todo } from './todo.interface'; // Import the Todo interface

@Injectable()
export class TodoService {
  constructor(private readonly firebaseService: FirebaseService) { }

  async findOtherUsers(currentUid: string): Promise<any[]> {
    const firestore = this.firebaseService.getFirestore();
    const usersCollection = collection(firestore, 'users');

    // Query to get all users except the current user
    const usersQuery = query(usersCollection, where('uid', '!=', currentUid));
    const usersSnapshot = await getDocs(usersQuery);

    // Return user data except the current user's UID
    return usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }


  // Retrieve all todos for a user (creator or assignee)
  async findAll(uid: string): Promise<Todo[]> {
    const firestore = this.firebaseService.getFirestore();
    const todosCollection = collection(firestore, 'todos');
    const todosSnapshot = await getDocs(todosCollection);

    return todosSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Todo)) // Cast to Todo interface
      .filter(todo => todo.creatorId === uid || todo.assigneeId === uid); // Filter by creatorId or assigneeId
  }

  // Retrieve a single todo by ID
  async findOne(id: string, uid: string): Promise<Todo> {
    const firestore = this.firebaseService.getFirestore();
    const todoRef = doc(firestore, 'todos', id);
    const todoDoc = await getDoc(todoRef);

    if (!todoDoc.exists()) {
      throw new NotFoundException(`Todo with ID ${id} not found.`);
    }

    const todoData = { id: todoDoc.id, ...todoDoc.data() } as Todo; // Cast to Todo interface

    // Check if the user is the creator or the assignee
    if (todoData.creatorId !== uid && todoData.assigneeId !== uid) {
      throw new ForbiddenException(`You do not have permission to view this todo.`);
    }

    return todoData;
  }

  // Create a new todo
  async create(todoData: Todo): Promise<{ id: string; message: string }> {
    const firestore = this.firebaseService.getFirestore();
    const todoRef = await addDoc(collection(firestore, 'todos'), todoData);

    return {
      id: todoRef.id,
      message: 'Todo Created successfully',
    };
  }

  // Update an existing todo by ID
  async update(id: string, updateData: { title?: string; description?: string; completed?: boolean }, uid: string): Promise<Todo> {
    const firestore = this.firebaseService.getFirestore();
    const todoRef = doc(firestore, 'todos', id);
    const todoDoc = await getDoc(todoRef);

    if (!todoDoc.exists()) {
      throw new NotFoundException(`Todo with ID ${id} not found.`);
    }

    const todoData = { id: todoDoc.id, ...todoDoc.data() } as Todo; // Cast to Todo interface

    // Check if the user is the creator or the assignee
    if (todoData.creatorId !== uid && todoData.assigneeId !== uid) {
      throw new ForbiddenException(`You do not have permission to update this todo.`);
    }

    // If the user is not the creator, only allow updating the completed status
    if (todoData.creatorId !== uid) {
      const { completed } = updateData;
      if (completed === undefined) {
        throw new ForbiddenException(`You can only update the status of this todo.`);
      }
      updateData = { completed }; // Allow only status update
    }

    // Update the todo in Firestore
    await updateDoc(todoRef, updateData);

    // Return the updated todo
    const updatedTodoDoc = await getDoc(todoRef);
    return { id: updatedTodoDoc.id, ...updatedTodoDoc.data() } as Todo; // Cast to Todo interface
  }

  // Delete a todo by ID
  async remove(id: string, uid: string): Promise<{ id: string }> {
    const firestore = this.firebaseService.getFirestore();
    const todoRef = doc(firestore, 'todos', id);
    const todoDoc = await getDoc(todoRef);

    if (!todoDoc.exists()) {
      throw new NotFoundException(`Todo with ID ${id} not found.`);
    }

    const todoData = { id: todoDoc.id, ...todoDoc.data() } as Todo; // Cast to Todo interface

    // Check if the user is the creator
    if (todoData.creatorId !== uid) {
      throw new ForbiddenException(`You do not have permission to delete this todo.`);
    }

    await deleteDoc(todoRef);
    return { id };
  }
}
