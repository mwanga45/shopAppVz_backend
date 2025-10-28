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
  
  @UseGuards(AuthGuard('jwt'))
  @Get('orders')
  getOrders(@Request() req) {
    try {
      console.log('Request user:', req.user);
      
      if (!req.user) {
        return {
          message: 'User not authenticated',
          success: false,
          data: []
        };
      }

      const userId = req.user.userId || req.user.id;
      
      if (!userId) {
        return {
          message: 'User ID not found in token',
          success: false,
          data: []
        };
      }

      return this.orderService.findAllOrders(userId);
    } catch (error) {
      console.error('Error in getOrders:', error);
      return {
        message: 'Internal server error',
        success: false,
        data: []
      };
    }
  }

  @Post('orders/date-range')
  getOrdersByDateRange(@Request() req, @Body() body: { startDate: string; endDate: string }) {
    try {
      console.log('Request user:', req.user);
      
      if (!req.user) {
        return {
          message: 'User not authenticated',
          success: false,
          data: []
        };
      }

      const userId = req.user.userId || req.user.id;
      
      if (!userId) {
        return {
          message: 'User ID not found in token',
          success: false,
          data: []
        };
      }

      if (!body.startDate || !body.endDate) {
        return {
          message: 'Start date and end date are required',
          success: false,
          data: []
        };
      }

      return this.orderService.findOrdersByDateRange(userId, body.startDate, body.endDate);
    } catch (error) {
      console.error('Error in getOrdersByDateRange:', error);
      return {
        message: 'Internal server error',
        success: false,
        data: []
      };
    }
  }

}
