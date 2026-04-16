import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'A cor deste botão poderia ser mais escura?',
    description: 'Conteúdo da mensagem',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 'uuid-da-etapa-aqui',
    description: 'ID (UUID) da Etapa onde o comentário foi feito',
  })
  @IsUUID('all', { message: 'O milestone_id deve ser um UUID válido' })
  @IsNotEmpty()
  milestone_id: string;

  @ApiProperty({
    example: 'uuid-do-autor-aqui',
    description: 'ID (UUID) de quem escreveu a mensagem',
  })
  @IsUUID('all', { message: 'O author_id deve ser um UUID válido' })
  @IsNotEmpty()
  author_id: string;

  @ApiPropertyOptional()
  file_url?: string;
}
