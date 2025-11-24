import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WholeSales} from './entities/wholesale.entity';
import { RetailSales} from './entities/retailsale.entity'
import { ProductModule } from 'src/product/product.module';
import { StockModule } from 'src/stock/stock.module';
import { Stock,Stock_transaction } from 'src/stock/entities/stock.entity';
import { DailyProfitsummary } from './entities/profitsummary.entity';
import { Capital } from 'src/entities/capital.entity';
import { BusinessGrowthLogic } from 'src/common/helper/businessLogic.helper';
import { CashFlow } from 'src/entities/cashFlow.entity';
import { Debt } from 'src/debt/entities/debt.entity';
import { Debt_track } from 'src/debt/entities/debt.entity';
import { dialValidate } from 'src/common/helper/phone.helper';

@Module({
  imports: [
    TypeOrmModule.forFeature([WholeSales, RetailSales,Stock,Stock_transaction, DailyProfitsummary, Capital, CashFlow, Debt, Debt_track]),
    ProductModule,
    StockModule,
  ],
  controllers: [SalesController],
  providers: [SalesService,BusinessGrowthLogic,dialValidate],
  exports:[SalesService, BusinessGrowthLogic, dialValidate]
})
export class SalesModule {}
