import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Task } from 'src/tasks/task.entity';

// defining the User entity with the id (auto-generated Primary Key), username and password
@Entity()
@Unique(['username']) // unique column must be defined at the database level
export class User extends BaseEntity {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'usuario123'
  })
  @Column()
  username: string;

  @ApiProperty({
    description: 'Contraseña encriptada del usuario',
    example: 'hashedPassword123'
  })
  @Column()
  password: string;

  @ApiProperty({
    description: 'Salt utilizado para encriptar la contraseña',
    example: 'randomSalt123'
  })
  @Column()
  salt: string;

  @ApiProperty({
    description: 'Lista de tareas del usuario',
    type: () => [Task]
  })
  @OneToMany(type => Task, task => task.user, { eager: true })
  tasks: Task[];

  /**
   * @description
   * takes the user's plaintext password of the user and compares it to the saved password
   * @param {string} password plaintext password provided by the user during sign in
   * @returns a boolean based on the comparison
   */
  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
