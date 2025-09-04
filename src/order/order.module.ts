import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { dialValidate } from 'src/common/helper/phone.helper';

@Module({
  imports:[
    TypeOrmModule.forFeature([Order])
  ],
  controllers: [OrderController],
  providers: [OrderService,dialValidate],
  exports:[dialValidate]
})
export class OrderModule {}
