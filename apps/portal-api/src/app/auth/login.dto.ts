import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'eduardo@empresa.com',
    description: 'O e-mail cadastrado do usuário',
  })
  @IsNotEmpty({ message: 'O e-mail não pode ficar vazio' })
  @IsEmail({}, { message: 'O formato do e-mail é inválido' })
  email: string;

  @ApiProperty({
    example: 'senha123',
    description: 'A senha em texto puro',
  })
  @IsNotEmpty({ message: 'A senha não pode ficar vazia' })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;
}
