import { Module } from '@nestjs/common';
import { ManagementService } from './management.service';
import { ManagementController } from './management.controller';
import { Capital } from 'src/entities/capital.entity';
import { CashFlow } from 'src/entities/cashFlow.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessService } from 'src/entities/businessService.entity';

@Module({
  imports:[
   TypeOrmModule.forFeature([Capital, CashFlow, BusinessService])
  ],
  controllers: [ManagementController],
  providers: [ManagementService],
})
export class ManagementModule {}
