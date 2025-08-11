import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery, 
  ApiBearerAuth,
  ApiBody 
} from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './helpers/task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { User } from 'src/auth/user.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('Tareas')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  // adding logger
  private logger = new Logger('TaskController');

  // TaskService is a provider in the TaskModule
  // which has been injected in the TaskController via the @Injectable() decorator
  constructor(private tasksService: TasksService) {}

  /**
   * @description
   * the controller method to fetch either all tasks or tasks based on query params
   * @param {GetTasksFilterDto} filterDto the request query params
   * @returns tasks fetched from database
   */
  @ApiOperation({ 
    summary: 'Obtener tareas',
    description: 'Obtiene todas las tareas del usuario autenticado, con opción de filtrado por estado y búsqueda por texto'
  })
  @ApiQuery({ name: 'status', enum: TaskStatus, required: false, description: 'Filtrar por estado de la tarea' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar en título y descripción' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de tareas obtenida exitosamente',
    type: [Task]
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User
  ): Promise<Task[]> {
    this.logger.verbose(`${user.username} retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);

    return this.tasksService.getTasks(filterDto, user);
  }

  /**
   * @description
   * the controller method to fetch task by its corresponding id
   * @param {number} id the id of the task to be fetched from database
   * @returns the task corresponding to the id
   */
  @ApiOperation({ 
    summary: 'Obtener tarea por ID',
    description: 'Obtiene una tarea específica por su ID'
  })
  @ApiParam({ name: 'id', description: 'ID de la tarea', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Tarea encontrada exitosamente',
    type: Task
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(`${user.username} retrieving a task with the id ${id}`);

    return this.tasksService.getTaskById(id, user);
  }

  /**
   * @description
   * the controller method to create a new task and save it in the database
   * @param {CreateTaskDto} createTaskDto the request body params
   * @returns the newly created task
   */
  @ApiOperation({ 
    summary: 'Crear nueva tarea',
    description: 'Crea una nueva tarea para el usuario autenticado'
  })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Tarea creada exitosamente',
    type: Task
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(`${user.username} creating a new task. Data: ${JSON.stringify(createTaskDto)}`);

    return this.tasksService.createTask(createTaskDto, user);
  }

  /**
   * @description
   * the controller method to update the status of an existing task
   * @param {number} id the id of the task to be updated
   * @param {UpdateTaskDto} updateTaskDto the new status of the task
   * @returns the updated task
   */
  @ApiOperation({ 
    summary: 'Actualizar estado de tarea',
    description: 'Actualiza el estado de una tarea existente'
  })
  @ApiParam({ name: 'id', description: 'ID de la tarea', type: 'number' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Tarea actualizada exitosamente',
    type: Task
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  @Patch('/:id/status')
  @UsePipes(ValidationPipe)
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    this.logger.verbose(`${user.username} updating task ${id} with status ${updateTaskDto.status}`);

    return this.tasksService.updateTaskStatus(id, updateTaskDto.status, user);
  }

  /**
   * @description
   * the controller method to delete an existing task from the database
   * @param {number} id the id of the task to be deleted
   * @returns void
   */
  @ApiOperation({ 
    summary: 'Eliminar tarea',
    description: 'Elimina una tarea existente'
  })
  @ApiParam({ name: 'id', description: 'ID de la tarea', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Tarea eliminada exitosamente'
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  @Delete('/:id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User
  ): Promise<void> {
    this.logger.verbose(`${user.username} deleting task ${id}`);

    return this.tasksService.deleteTask(id, user);
  }
}
