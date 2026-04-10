import { Logger, ValidationPipe } from '@nestjs/common'; // Adicionei o ValidationPipe aqui
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // 👇 LIGANDO O ESCUDO DE VALIDAÇÃO 👇
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove qualquer campo extra que o hacker tente enviar e não esteja no DTO
      forbidNonWhitelisted: true, // Bloqueia a requisição se tiver campos intrusos
      transform: true, // Transforma os dados da web para os tipos corretos do TypeScript
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Portal do Cliente API')
    .setDescription('API para gestão de projetos e milestones para freelancers.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
