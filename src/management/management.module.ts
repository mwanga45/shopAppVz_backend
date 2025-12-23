import { Module } from '@nestjs/common';
import { ManagementService } from './management.service';
import { ManagementController } from './management.controller';
import { Capital } from 'src/entities/capital.entity';
import { CashFlow } from 'src/entities/cashFlow.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessService } from 'src/entities/businessService.entity';
import { serviceRecord } from 'src/entities/servicer_record.entity';
import { ServiceSeeder } from './services.seeder';
import { Customer } from 'src/entities/customer.entity';
import { dialValidate } from 'src/common/helper/phone.helper';

@Module({
  imports:[
   TypeOrmModule.forFeature([Capital, CashFlow, BusinessService, serviceRecord, Customer])
  ],
  controllers: [ManagementController],
  providers: [ManagementService, ServiceSeeder, dialValidate],
})
export class ManagementModule {}
