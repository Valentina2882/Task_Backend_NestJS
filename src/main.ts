import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // creating the application instance
  const app = await NestFactory.create(AppModule);

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
}
bootstrap();
