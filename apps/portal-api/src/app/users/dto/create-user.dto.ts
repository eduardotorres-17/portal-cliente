import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Eduardo Developer' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'eduardo@empresa.com' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @IsEmail({}, { message: 'Formato de e-mail inválido' })
  email: string;

  @ApiProperty({ example: 'CLIENT', required: false })
  @IsOptional()
  @IsString()
  role?: string;

  // 👇 Agora a API de criação exige a senha!
  @ApiProperty({
    example: 'senha123',
    description: 'Senha de acesso do usuário',
  })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;
}
