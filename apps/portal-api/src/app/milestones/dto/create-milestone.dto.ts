import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateMilestoneDto {
  @ApiProperty({ example: '1. Wireframe e Prototipagem', description: 'Título da etapa' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Criação das telas de baixa fidelidade para aprovação do cliente.', description: 'Descrição da etapa' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 30, description: 'Peso (porcentagem) dessa etapa no projeto total (1 a 100)' })
  @IsInt()
  @Min(1)
  @Max(100)
  weight: number;

  @ApiProperty({ example: 'uuid-do-projeto-aqui', description: 'ID (UUID) do Projeto dono desta etapa' })
  @IsUUID('all', { message: 'O project_id deve ser um UUID válido' })
  @IsNotEmpty()
  project_id: string;
}