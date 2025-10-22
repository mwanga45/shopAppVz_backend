import { Module } from '@nestjs/common';
import { DebtService } from './debt.service';
import { DebtController } from './debt.controller';
import { dialValidate } from 'src/common/helper/phone.helper'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debt, Debt_track } from './entities/debt.entity';
import { Product } from 'src/product/entities/product.entity';
import { Customer } from 'src/entities/customer.entity';
import { User } from 'src/entities/user.entity';
import { StockModule } from 'src/stock/stock.module';
import { WholeSales } from 'src/sales/entities/wholesale.entity';
import { RetailSales } from 'src/sales/entities/retailsale.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Debt, Debt_track, Product, Customer, User, WholeSales, RetailSales]),
    StockModule
  ],
  controllers: [DebtController],
  providers: [DebtService, dialValidate],
  exports:[dialValidate]
})
export class DebtModule {}
