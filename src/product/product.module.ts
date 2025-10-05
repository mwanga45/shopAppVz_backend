import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product_discount } from './entities/discount.entity';
import { WholeSales } from 'src/sales/entities/wholesale.entity';
import { RetailSales } from 'src/sales/entities/retailsale.entity';
@Module({
  imports:[
    TypeOrmModule.forFeature([Product,Product_discount,WholeSales,RetailSales])
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [TypeOrmModule.forFeature([Product,Product_discount])],
})
export class ProductModule {}
