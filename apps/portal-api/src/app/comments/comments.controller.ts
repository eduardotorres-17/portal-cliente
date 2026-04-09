import { Controller, Post, Body, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Adiciona um comentário em uma etapa' })
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get('milestone/:milestoneId')
  @ApiOperation({ summary: 'Lista toda a conversa de uma etapa' })
  @ApiParam({ name: 'milestoneId', description: 'UUID da etapa' })
  findAllByMilestone(@Param('milestoneId', ParseUUIDPipe) milestoneId: string) {
    return this.commentsService.findAllByMilestone(milestoneId);
  }
}
