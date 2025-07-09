import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe);

  const config = new DocumentBuilder()
    .setTitle('Auther V1')
    .setDescription(`Auther is an enterprise-grade authentication as a service platform.

      This API allows developers to:

      - Register and manage users across multiple applications
      - Perform secure login and logout operations
      - Issue and refresh JWT tokens
      - Manage user profiles and permissions
      - Integrate authentication workflows easily into any system

      All endpoints are protected and require proper authentication and authorization headers.`)
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
