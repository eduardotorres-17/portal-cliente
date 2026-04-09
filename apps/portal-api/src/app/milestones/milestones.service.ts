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
    
    // Injetamos o repositório de Projetos para validar a chave estrangeira
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createMilestoneDto: CreateMilestoneDto): Promise<Milestone> {
    // 1. Verifica se o projeto pai existe
    const project = await this.projectsRepository.findOneBy({ id: createMilestoneDto.project_id });
    
    if (!project) {
      throw new NotFoundException('Projeto não encontrado com o ID fornecido.');
    }

    // 2. Cria a etapa atrelando a entidade do projeto
    const newMilestone = this.milestonesRepository.create({
      ...createMilestoneDto,
      project: project, // Chave estrangeira!
    });

    // 3. Salva no banco
    return this.milestonesRepository.save(newMilestone);
  }

  // ⚠️ Nova Função Estratégica! 
  // No Front-end, o cliente só vai querer ver as etapas do projeto DELE, não de todos.
  async findAllByProject(projectId: string): Promise<Milestone[]> {
    return this.milestonesRepository.find({ 
        where: { project: { id: projectId } },
        relations: ['project'] 
    });
  }
}