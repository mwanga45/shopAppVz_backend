import { Module } from '@nestjs/common';
import { DebtService } from './debt.service';
import { DebtController } from './debt.controller';
import { dialValidate } from 'src/common/helper/phone.helper'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debt, Debt_track } from './entities/debt.entity';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Debt, Debt_track, Product])
  ],
  controllers: [DebtController],
  providers: [DebtService, dialValidate],
  exports:[dialValidate]
})
export class DebtModule {}
