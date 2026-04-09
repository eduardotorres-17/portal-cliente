import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  // O @ApiProperty é o que faz o campo aparecer no Swagger!
  @ApiProperty({ example: 'Eduardo', description: 'Nome do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
  name: string;

  @ApiProperty({ example: 'eduardo@email.com', description: 'E-mail válido' })
  @IsEmail({}, { message: 'Forneça um endereço de e-mail válido' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha de acesso (mínimo 6 caracteres)' })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password_hash: string;
}
