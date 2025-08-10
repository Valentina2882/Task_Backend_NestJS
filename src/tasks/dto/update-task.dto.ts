import { IsOptional, IsEnum, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../helpers/task-status.enum';
import { Transform } from 'class-transformer';

export class UpdateTaskDto {
  @ApiProperty({
    description: 'El título actualizado de la tarea',
    example: 'Proyecto NestJS actualizado',
    minLength: 3,
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @ApiProperty({
    description: 'La descripción actualizada de la tarea',
    example: 'Implementación completa con autenticación y documentación',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'El estado actualizado de la tarea',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
