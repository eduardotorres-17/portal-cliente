import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../project.entity';
import { User } from '../user.entity';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,

    // Importamos o repositório de User para podermos validar o client_id
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    // 1. Verifica se o cliente existe
    const client = await this.usersRepository.findOneBy({ id: createProjectDto.client_id });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado com o ID fornecido.');
    }

    if (client.role !== 'CLIENT') {
      throw new BadRequestException('Apenas usuários com a role CLIENT podem ser donos de projetos.');
    }

    // 2. Cria o projeto atrelando a entidade do cliente
    const newProject = this.projectsRepository.create({
      ...createProjectDto,
      client: client, // Fazemos a ligação da chave estrangeira aqui!
    });

    // 3. Salva no banco
    return this.projectsRepository.save(newProject);
  }

  async findAll(): Promise<Project[]> {
    // Trazemos os projetos já com os dados do cliente embutidos (JOIN)
    return this.projectsRepository.find({ relations: ['client'] });
  }
}
