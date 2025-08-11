import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // creating the application instance
  const app = await NestFactory.create(AppModule);

  // Configurar CORS para permitir peticiones desde Flutter Web
  app.enableCors({
    origin: [
      'http://localhost:28263', // Flutter Web por defecto
      'http://localhost:3000',  // Backend
      'http://localhost:8080',  // Puerto alternativo de Flutter Web
      'http://localhost:8081',  // Puerto alternativo de Flutter Web
      'http://localhost:8082',  // Puerto alternativo de Flutter Web
      'http://127.0.0.1:28263', // IP local
      'http://127.0.0.1:3000',  // IP local backend
      'http://127.0.0.1:8080',  // IP local puerto alternativo
      'http://127.0.0.1:8081',  // IP local puerto alternativo
      'http://127.0.0.1:8082',  // IP local puerto alternativo
      // Permitir todos los orígenes en desarrollo (solo para debug)
      true,
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    credentials: true, // Permite cookies y headers de autorización
  });

  // adding swagger
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API for managing tasks')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // running the server and listening on a port
  const PORT = process.env.DEV_PORT || 3000;
  await app.listen(PORT);

  // adding logger
  const logger = new Logger('bootstrap');
  logger.log(`Server running on port ${PORT}`);
  logger.log(`CORS enabled for Flutter Web`);
}
bootstrap();
