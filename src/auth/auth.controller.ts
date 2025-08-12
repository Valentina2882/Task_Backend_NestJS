import { Body, Controller, Logger, Post, ValidationPipe, Get, UseGuards, Request } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  // adding logger
  private logger = new Logger();

  constructor(
    private authService: AuthService,
  ) {}

  /**
   * @description
   * the controller method to sign up a new user
   * @param {AuthCredentialsDto} authCredentialsDto user's signup credentials
   * @returns
   */
  @ApiOperation({ 
    summary: 'Registrar nuevo usuario',
    description: 'Crea una nueva cuenta de usuario'
  })
  @ApiBody({ type: AuthCredentialsDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario registrado exitosamente' 
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El nombre de usuario ya existe' })
  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
  ): Promise<void> {
    this.logger.verbose(`A new user is signing up`);

    return this.authService.signUp(authCredentialsDto);
  }

  /**
   * @description
   * the controller method to sign in an existing user
   * @param {AuthCredentialsDto} authCredentialsDto user's signin credentials
   * @returns the access token generated
   */
  @ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve un token de acceso'
  })
  @ApiBody({ type: AuthCredentialsDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Inicio de sesión exitoso',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
  @Post('/signin')
  async singIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    this.logger.verbose(`A user is trying to sign in`);

    return this.authService.signIn(authCredentialsDto);
  }

  /**
   * @description
   * the controller method to verify JWT token
   * @returns user information if token is valid
   */
  @ApiOperation({ 
    summary: 'Verificar token',
    description: 'Verifica la validez del token JWT y devuelve información del usuario'
  })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: 200, 
    description: 'Token válido',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        username: { type: 'string', example: 'usuario123' },
        message: { type: 'string', example: 'Token válido' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  @UseGuards(JwtAuthGuard)
  @Get('/verify')
  async verifyToken(@Request() req): Promise<{ id: number; username: string; message: string }> {
    this.logger.verbose(`Token verification requested`);
    
    return {
      id: req.user.id,
      username: req.user.username,
      message: 'Token válido'
    };
  }
}
