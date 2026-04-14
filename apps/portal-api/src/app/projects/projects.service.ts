import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../project.entity';
import { User } from '../user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectsRepository: Repository<Project>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createProjectDto: any) {
    const client = await this.usersRepository.findOne({
      where: { id: createProjectDto.clientId },
    });
    if (!client) throw new NotFoundException('Cliente não encontrado');

    const project = this.projectsRepository.create({
      title: createProjectDto.title,
      description: createProjectDto.description,
      client: client,
    });
    return this.projectsRepository.save(project);
  }

  async findAll(userLogged: any) {
    // 👇 O DETECTOR DE MENTIRAS NO TERMINAL DO NESTJS 👇
    console.log('\n--- NOVA REQUISIÇÃO DO ANGULAR ---');
    console.log('Quem está pedindo?', userLogged);

    // Adicionamos o .toUpperCase() para ignorar diferenças de maiúsculas/minúsculas no banco!
    if (userLogged.role.toUpperCase() === 'ADMIN') {
      console.log('👉 Resultado: É um ADMIN! Retornando o banco inteiro...');
      return this.projectsRepository.find({ relations: ['client'] });
    }

    console.log('👉 Resultado: É um CLIENT! Buscando apenas projetos do ID:', userLogged.sub);
    return this.projectsRepository.find({
      where: { client: { id: userLogged.sub } },
      relations: ['client']
    });
  }

  async findOne(id: string, userLogged: any) {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!project) throw new NotFoundException('Projeto não encontrado');

    if (userLogged.role === 'CLIENT' && project.client.id !== userLogged.sub) {
      throw new UnauthorizedException('Acesso negado a este projeto');
    }

    return project;
  }

  async remove(id: string) {
    const project = await this.projectsRepository.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Projeto não encontrado');
    return this.projectsRepository.remove(project);
  }
}
