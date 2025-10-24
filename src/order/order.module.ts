import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { dialValidate } from 'src/common/helper/phone.helper';
import { Customer } from 'src/entities/customer.entity';
import { Product } from 'src/product/entities/product.entity';
import { UnofficialProduct } from './entities/Unofficialproduct.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Order, Customer, Product, UnofficialProduct])
  ],
  controllers: [OrderController],
  providers: [OrderService,dialValidate],
  exports:[dialValidate]
})
export class OrderModule {}
