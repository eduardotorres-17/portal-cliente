import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from '../comment.entity';
import { Milestone } from '../milestone.entity';
import { User } from '../user.entity';

@Module({
  // Precisamos importar as 3 entidades que vamos manipular
  imports: [TypeOrmModule.forFeature([Comment, Milestone, User])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
