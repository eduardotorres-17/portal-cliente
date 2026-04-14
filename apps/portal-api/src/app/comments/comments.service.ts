import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../comment.entity';
import { Milestone } from '../milestone.entity';
import { User } from '../user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    @InjectRepository(Milestone)
    private milestonesRepository: Repository<Milestone>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const milestone = await this.milestonesRepository.findOneBy({
      id: createCommentDto.milestone_id,
    });
    if (!milestone) throw new NotFoundException('Etapa não encontrada.');

    const author = await this.usersRepository.findOneBy({
      id: createCommentDto.author_id,
    });
    if (!author) throw new NotFoundException('Autor não encontrado.');

    const newComment = this.commentsRepository.create({
      content: createCommentDto.content,
      milestone: milestone,
      author: author,
    });

    return this.commentsRepository.save(newComment);
  }

  async findAllByMilestone(milestoneId: string): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { milestone: { id: milestoneId } },
      relations: ['author'],
      order: { created_at: 'ASC' },
    });
  }

  // 👇 Novo: Busca comentário por ID
  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOneBy({ id });
    if (!comment) throw new NotFoundException('Comentário não encontrado.');
    return comment;
  }

  // 👇 Novo: Remove o comentário
  async remove(id: string): Promise<Comment> {
    const comment = await this.findOne(id);
    return this.commentsRepository.remove(comment);
  }
}
