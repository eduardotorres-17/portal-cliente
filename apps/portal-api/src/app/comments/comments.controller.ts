import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CommentsService } from './comments.service';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Comments')
@Controller('comments')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Adiciona um comentário em uma etapa' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  create(
    @Body('content') content: string,
    @Body('milestone_id') milestone_id: string,
    @Body('author_id') author_id: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const file_url = file ? `/uploads/${file.filename}` : undefined;

    return this.commentsService.create({
      content,
      milestone_id,
      author_id,
      file_url,
    });
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
