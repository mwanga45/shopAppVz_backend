import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyProfitsummary } from 'src/sales/entities/profitsummary.entity';
import { ProfitDevService } from './profit_dev.service';
import { ProfitDevController } from './profit_dev.controller';
import { WholeSales } from 'src/sales/entities/wholesale.entity';
import { RetailSales } from 'src/sales/entities/retailsale.entity';
import { Debt_track } from 'src/debt/entities/debt.entity';
import { Debt } from 'src/debt/entities/debt.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Stock_transaction } from 'src/stock/entities/stock.entity';
import { CashFlow } from 'src/entities/cashFlow.entity';
import { Capital } from 'src/entities/capital.entity';
import { BusinessGrowthLogic } from 'src/common/helper/businessLogic.helper';
import { BusinessService } from 'src/entities/businessService.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      DailyProfitsummary,
      WholeSales,
      RetailSales,
      Debt_track,
      Debt,
      Stock,
      Stock_transaction,
      CashFlow,
      Capital,
      BusinessService

    ]),
  ],
  providers: [ProfitDevService, BusinessGrowthLogic],
  controllers: [ProfitDevController],
  exports: [BusinessGrowthLogic],
})
export class ProfitDevModule {}
