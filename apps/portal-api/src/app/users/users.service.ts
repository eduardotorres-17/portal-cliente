import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    // Injetamos o repositório do TypeORM para termos acesso ao banco
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Método para criar um usuário
  async create(userData: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  // Método para listar todos os usuários
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
