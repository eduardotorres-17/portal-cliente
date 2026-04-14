import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Milestone } from '../milestone.entity';
import { Project } from '../project.entity';
import { CreateMilestoneDto } from './dto/create-milestone.dto';

@Injectable()
export class MilestonesService {
  constructor(
    @InjectRepository(Milestone)
    private milestonesRepository: Repository<Milestone>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createMilestoneDto: CreateMilestoneDto): Promise<Milestone> {
    const project = await this.projectsRepository.findOneBy({
      id: createMilestoneDto.project_id,
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado com o ID fornecido.');
    }

    const newMilestone = this.milestonesRepository.create({
      ...createMilestoneDto,
      project: project,
    });

    return this.milestonesRepository.save(newMilestone);
  }

  async findAllByProject(projectId: string): Promise<Milestone[]> {
    return this.milestonesRepository.find({
      where: { project: { id: projectId } },
      relations: ['project'],
    });
  }

  // 👇 Novo: Busca etapa por ID
  async findOne(id: string): Promise<Milestone> {
    const milestone = await this.milestonesRepository.findOneBy({ id });
    if (!milestone) throw new NotFoundException('Etapa não encontrada.');
    return milestone;
  }

  // 👇 Novo: Remove a etapa (O banco apagará os comentários dela em cascata!)
  async remove(id: string): Promise<Milestone> {
    const milestone = await this.findOne(id);
    return this.milestonesRepository.remove(milestone);
  }
}
