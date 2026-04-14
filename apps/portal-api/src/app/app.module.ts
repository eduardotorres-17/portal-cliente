import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user.entity';
import { Project } from './project.entity';
import { Milestone } from './milestone.entity';
import { Comment } from './comment.entity';
import { AuthModule } from './auth/auth.module';

// Importe o módulo recém-criado
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { MilestonesModule } from './milestones/milestones.module'
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'admin',
      password: 'adminpassword',
      database: 'portal_db',
      entities: [User, Project, Milestone, Comment],
      synchronize: false,
    }),
    // Avise o NestJS que o módulo de usuários existe!
    UsersModule,
    ProjectsModule,
    MilestonesModule,
    CommentsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
