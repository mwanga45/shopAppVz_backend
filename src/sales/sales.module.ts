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

@Module({
  imports: [
    TypeOrmModule.forFeature([WholeSales, RetailSales,Stock,Stock_transaction]),
    ProductModule,
    StockModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
