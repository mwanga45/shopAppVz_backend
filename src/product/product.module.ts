import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product_discount } from './entities/discount.entity';
@Module({
  imports:[
    TypeOrmModule.forFeature([Product,Product_discount])
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [TypeOrmModule.forFeature([Product,Product_discount])],
})
export class ProductModule {}
