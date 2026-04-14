import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateProjectDto } from './dto/create-project.dto';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(AuthGuard) // 👈 Tranca todas as rotas de projetos exigindo login
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN') // 👈 SÓ ADMIN PODE CRIAR!
  @ApiOperation({ summary: 'Cria um novo projeto (Apenas Admins)' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lista projetos (Admins veem todos, Clientes veem os seus)',
  })
  findAll(@Request() req: any) {
    // Passa o usuário do Token para o Service decidir o que mostrar
    return this.projectsService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um projeto pelo ID' })
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.findOne(id, req.user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN') // 👈 SÓ ADMIN PODE DELETAR!
  @ApiOperation({ summary: 'Remove um projeto (Apenas Admins)' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
