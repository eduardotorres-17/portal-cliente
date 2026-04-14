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
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { Roles } from '../auth/roles.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Milestones')
@Controller('milestones')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Cria uma nova etapa para um projeto (Apenas Admins)',
  })
  create(@Body() createMilestoneDto: CreateMilestoneDto) {
    return this.milestonesService.create(createMilestoneDto);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Lista todas as etapas de um projeto específico' })
  @ApiParam({ name: 'projectId', description: 'UUID do projeto' })
  findAllByProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.milestonesService.findAllByProject(projectId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Remove uma etapa e seus comentários (Apenas Admins)',
  })
  remove(@Param('id') id: string) {
    return this.milestonesService.remove(id);
  }
}
