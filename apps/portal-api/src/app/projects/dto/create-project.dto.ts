import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'E-commerce Loja XYZ', description: 'Título do projeto' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Desenvolvimento de uma loja virtual completa...', description: 'Descrição detalhada' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID (UUID) do Cliente dono do projeto' })
  @IsUUID('all', { message: 'O client_id deve ser um UUID válido' })
  @IsNotEmpty()
  client_id: string;

  @ApiProperty({ required: false, example: '2026-05-01' })
  @IsDateString({}, { message: 'A data de início deve ser uma data válida' })
  @IsOptional()
  start_date?: string;

  @ApiProperty({ required: false, example: '2026-08-01' })
  @IsDateString({}, { message: 'A data final deve ser uma data válida' })
  @IsOptional()
  due_date?: string;
}
