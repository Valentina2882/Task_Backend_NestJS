import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// user must signup with a username and a password
// the password must contain-
// 1. at least 1 upper case letter
// 2. at least 1 lower cas letter
// 3. at least 1 number or special character
export class AuthCredentialsDto {
  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'usuario123',
    minLength: 4,
    maxLength: 20
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;
  
  @ApiProperty({
    description: 'Contraseña que debe contener al menos 1 mayúscula, 1 minúscula y 1 número o carácter especial',
    example: 'Password123',
    minLength: 3,
    maxLength: 20
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: 'password too weak' }
  )
  password: string;
}