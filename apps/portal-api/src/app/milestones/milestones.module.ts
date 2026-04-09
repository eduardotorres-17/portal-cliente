import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MilestonesController } from './milestones.controller';
import { MilestonesService } from './milestones.service';
import { Milestone } from '../milestone.entity';
import { Project } from '../project.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Milestone, Project])],
  controllers: [MilestonesController],
  providers: [MilestonesService],
})
export class MilestonesModule {}