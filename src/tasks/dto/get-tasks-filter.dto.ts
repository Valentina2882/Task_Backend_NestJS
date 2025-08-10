import { TaskStatus } from '../helpers/task-status.enum';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// defining the properties that may be used while fetching the tasks
export class GetTasksFilterDto {
  @ApiProperty({
    description: 'Filtrar tareas por estado',
    enum: TaskStatus,
    example: TaskStatus.OPEN,
    required: false
  })
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus;
  
  @ApiProperty({
    description: 'Buscar tareas por título o descripción',
    example: 'proyecto',
    required: false
  })
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
