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
    @InjectRepository(Milestone) private milestonesRepository: Repository<Milestone>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    // 1. Verifica se a etapa existe
    const milestone = await this.milestonesRepository.findOneBy({ id: createCommentDto.milestone_id });
    if (!milestone) {
      throw new NotFoundException('Etapa não encontrada.');
    }

    // 2. Verifica se o autor (usuário) existe
    const author = await this.usersRepository.findOneBy({ id: createCommentDto.author_id });
    if (!author) {
      throw new NotFoundException('Autor não encontrado.');
    }

    // 3. Cria o comentário atrelando as DUAS chaves estrangeiras
    const newComment = this.commentsRepository.create({
      content: createCommentDto.content,
      milestone: milestone,
      author: author,
    });

    return this.commentsRepository.save(newComment);
  }

  // Busca todo o histórico de conversa de uma etapa específica
  async findAllByMilestone(milestoneId: string): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { milestone: { id: milestoneId } },
      relations: ['author'], // Trazemos os dados do autor para o front-end saber quem postou
      order: { created_at: 'ASC' } // Ordena do mais antigo para o mais novo (estilo chat)
    });
  }
}
