import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock, Stock_transaction } from './entities/stock.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Stock,Stock_transaction]),
    ProductModule,
    
  ],
  controllers: [StockController],
  providers: [StockService],
  exports:[StockService]
})
export class StockModule {}
