import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Ordertype } from './utils/type';
import { dialValidate } from 'src/common/helper/phone.helper';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) 
    private readonly orderRepo:Repository<Order>,
    private readonly validator:dialValidate
  ){}
  async createOrder(order:Ordertype) :Promise<any>{
    const {user_id, productname, client_name,client_phone,OrderDate} = order
    const create =  this.orderRepo.create({
      product_name:productname,
      userId:user_id,
      client_name:client_name,
      client_phone:client_phone,
      OrderDate:OrderDate
    })
    return 
  }
  checkPhone(phone_number:string):string{
   const dial = this.validator.CheckDialformat(phone_number)
   console.log(dial)
   return dial
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
