import { Controller, Get, Post, Param, Body, Patch, Delete, Query, Req } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.interface'; // Import the Todo interface
import { CustomRequest } from './custom-request.interface'; // Import the custom request interface

@Controller('todos')  // The base route for this controller
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Get()
  getAllTodos(@Query('uid') uid: string) {
    return this.todoService.findAll(uid);  // Call the service method to get all todos for a user
  }

  @Get(':id')
  getTodoById(@Param('id') id: string, @Query('uid') uid: string) {
    return this.todoService.findOne(id, uid);  // Call the service method to get a specific todo by ID
  }

  @Post()
  createTodo(@Body() todoData: Todo) { // Use Todo interface
    return this.todoService.create(todoData);  // Call the service method to create a new todo
  }

  @Patch(':id')
  async updateTodo(
    @Param('id') id: string,
    @Body() updateData: { title?: string; description?: string; completed?: boolean },
    @Query('uid') uid: string,
  ) {
    return this.todoService.update(id, updateData, uid); // Pass the uid for permission checking
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: string, @Query('uid') uid: string) {
    return this.todoService.remove(id, uid);  // Call the service method to delete a specific todo
  }

  @Get('others') // Ensure this route is clearly defined
  async getOtherUsers(@Query('uid') currentUid: string) { // Accept uid as a query parameter
    return this.todoService.findOtherUsers(currentUid); // Call the service method with the provided uid
  }
}
