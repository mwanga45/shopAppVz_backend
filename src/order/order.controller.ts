import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards , Request} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Ordertype } from './utils/order.type';
import { AuthGuard } from '@nestjs/passport';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
@UseGuards(AuthGuard('jwt'))
  @Post('create')
  createOrder(@Request() req ,@Body() createOrderDto:CreateOrderDto) {
      const userId  = req.user.userId
    return this.orderService.createOrder(createOrderDto, userId);
  }

  @Get('customerInfo')
  Getstatus(){
    return this.orderService.findAllcustomer()
  }
  @Get('bothproduct')
  GetBothproduct(){
    return this.orderService.ReturnOffAndUnoff()
  }



}
