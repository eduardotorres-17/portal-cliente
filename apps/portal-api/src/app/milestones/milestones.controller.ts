import { Controller, Post, Body, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';

@ApiTags('Milestones')
@Controller('milestones')
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova etapa para um projeto' })
  create(@Body() createMilestoneDto: CreateMilestoneDto) {
    return this.milestonesService.create(createMilestoneDto);
  }

  // Rota com parâmetro na URL: /api/milestones/project/{id_do_projeto}
  @Get('project/:projectId')
  @ApiOperation({ summary: 'Lista todas as etapas de um projeto específico' })
  @ApiParam({ name: 'projectId', description: 'UUID do projeto' })
  // O ParseUUIDPipe garante que a URL tenha um UUID válido, senão já bloqueia com erro 400!
  findAllByProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.milestonesService.findAllByProject(projectId);
  }
}