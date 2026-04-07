import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user.entity';
import { Project } from './project.entity';
import { Milestone } from './milestone.entity';
import { Comment } from './comment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // ⚠️ Atenção Tech: Usamos localhost porque o NestJS está rodando na sua máquina, fora do Docker!
      port: 5433,
      username: 'admin',
      password: 'adminpassword',
      database: 'portal_db',
      entities: [User, Project, Milestone, Comment],
      synchronize: true, // Magia pura: cria e atualiza as tabelas automaticamente (usar apenas em dev!)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
