import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// a task must have the following properties during the time of creation
export class CreateTaskDto {
  @ApiProperty({
    description: 'El título de la tarea',
    example: 'Completar proyecto de NestJS',
    minLength: 1
  })
  @IsNotEmpty()
  title: string;
  
  @ApiProperty({
    description: 'La descripción detallada de la tarea',
    example: 'Implementar autenticación JWT y documentación Swagger',
    minLength: 1
  })
  @IsNotEmpty()
  description: string;
}
