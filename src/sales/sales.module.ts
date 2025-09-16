import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WholeSales} from './entities/wholesale.entity';
import { RetailSales} from './entities/retailsale.entity'
import { ProductModule } from 'src/product/product.module';
import { StockModule } from 'src/stock/stock.module';
import { SalesHelper } from 'src/common/helper/sales.helper';
import { Stock,Stock_transaction } from 'src/stock/entities/stock.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WholeSales, RetailSales,Stock,Stock_transaction]),
    ProductModule,
    StockModule,
  ],
  controllers: [SalesController],
  providers: [SalesService,SalesHelper],
})
export class SalesModule {}
