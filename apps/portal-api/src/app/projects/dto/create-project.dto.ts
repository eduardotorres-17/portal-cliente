import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'App de Entregas' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Desenvolvimento do app mobile' })
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @IsString()
  description: string;

  // 👇 O SEGREDO ESTÁ AQUI! O Admin precisa mandar o ID do Cliente
  @ApiProperty({
    example: 'uuid-do-cliente-aqui',
    description: 'ID do usuário (CLIENT) dono do projeto',
  })
  @IsNotEmpty({ message: 'O ID do cliente é obrigatório' })
  @IsString()
  clientId: string;
}
