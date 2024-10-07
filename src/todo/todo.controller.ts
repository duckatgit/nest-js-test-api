// todo.controller.ts
import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller('todos')  // The base route for this controller
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getAllTodos() {
    return this.todoService.findAll();  // Call the service method to get all todos
  }

  @Get(':id')
  getTodoById(@Param('id') id: string) {
    return this.todoService.findOne(id);  // Call the service method to get a specific todo by ID
  }

  @Post()
  createTodo(@Body() todoData) {
    return this.todoService.create(todoData);  // Call the service method to create a new todo
  }

  @Patch(':id')
  async updateTodo(
    @Param('id') id: string,
    @Body() updateData: { title?: string; description?: string; completed?: boolean },
  ) {
    return this.todoService.update(id, updateData);
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: string) {
    return this.todoService.remove(id);  // Call the service method to delete a specific todo
  }
}
