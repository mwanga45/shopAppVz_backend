import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WholeSales, RetailSales } from './entities/sale.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WholeSales, RetailSales]),
    ProductModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
