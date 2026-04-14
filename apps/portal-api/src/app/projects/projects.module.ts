import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from '../project.entity';
import { User } from '../user.entity'; // 👈 Importante!

@Module({
  imports: [
    // 👇 Precisamos carregar os dois repositórios aqui!
    TypeOrmModule.forFeature([Project, User])
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
