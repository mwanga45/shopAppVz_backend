import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WholeSales} from './entities/wholesale.entity';
import { RetailSales} from './entities/retailsale.entity'
import { ProductModule } from 'src/product/product.module';
import { StockModule } from 'src/stock/stock.module';
import { SalesHelper } from 'src/common/helper/sales.helper';
import { StockUpdateHelper } from 'src/common/helper/stockUpdate,helper';

@Module({
  imports: [
    TypeOrmModule.forFeature([WholeSales, RetailSales,StockUpdateHelper]),
    ProductModule,
    StockModule,
  ],
  controllers: [SalesController],
  providers: [SalesService,SalesHelper,StockUpdateHelper],
})
export class SalesModule {}
