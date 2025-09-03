import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock, Stock_record } from './entities/stock.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Stock,Stock_record]),
    ProductModule
  ],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
