import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Comments')
@Controller('comments')
@UseGuards(AuthGuard)
@ApiBearerAuth()
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

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um comentário' })
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}
