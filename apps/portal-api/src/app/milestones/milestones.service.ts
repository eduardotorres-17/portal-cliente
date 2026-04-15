import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
      throw new NotFoundException('Projeto não encontrado.');
    }

    const etapasExistentes = await this.milestonesRepository.find({
      where: { project: { id: createMilestoneDto.project_id } },
    });

    const pesoAtualTotal = etapasExistentes.reduce(
      (soma, etapa) => soma + Number(etapa.weight),
      0,
    );
    const pesoSolicitado = Number(createMilestoneDto.weight);
    const novoPesoTotal = pesoAtualTotal + pesoSolicitado;

    if (novoPesoTotal > 100) {
      throw new BadRequestException(`A soma não pode ultrapassar 100%.`);
    }

    const newMilestone = this.milestonesRepository.create({
      ...createMilestoneDto,
      project: project,
    });

    const savedMilestone = await this.milestonesRepository.save(newMilestone);

    // 👇 A MÁGICA ACONTECE AQUI: A API ATUALIZA O STATUS SOZINHA!
    if (novoPesoTotal === 100) {
      project.status = 'COMPLETED';
    } else {
      project.status = 'IN_PROGRESS'; // Garante que se estava concluído e algo mudou, ele volta.
    }
    await this.projectsRepository.save(project); // Salva o projeto modificado no banco

    return savedMilestone;
  }

  async findAllByProject(projectId: string): Promise<Milestone[]> {
    return this.milestonesRepository.find({
      where: { project: { id: projectId } },
      relations: ['project'],
    });
  }

  async findOne(id: string): Promise<Milestone> {
    // 👇 Precisamos carregar a relação com o Projeto para saber o ID na hora de deletar
    const milestone = await this.milestonesRepository.findOne({
      where: { id },
      relations: ['project'],
    });
    if (!milestone) throw new NotFoundException('Etapa não encontrada.');
    return milestone;
  }

  async remove(id: string): Promise<Milestone> {
    const milestone = await this.findOne(id);
    const projectId = milestone.project.id;

    const removedMilestone = await this.milestonesRepository.remove(milestone);

    // 👇 A MÁGICA REVERSA: Se o admin excluir uma etapa, o projeto "desconclui"
    const etapasRestantes = await this.milestonesRepository.find({
      where: { project: { id: projectId } },
    });
    const pesoRestante = etapasRestantes.reduce(
      (soma, etapa) => soma + Number(etapa.weight),
      0,
    );

    const project = await this.projectsRepository.findOneBy({ id: projectId });
    if (project) {
      project.status = pesoRestante === 100 ? 'COMPLETED' : 'IN_PROGRESS';
      await this.projectsRepository.save(project);
    }

    return removedMilestone;
  }
}
