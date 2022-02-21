import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report])], // this will create the Report repository for us
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
