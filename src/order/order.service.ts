import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Ordertype } from './utils/order.type';
import { dialValidate } from 'src/common/helper/phone.helper';


@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) 
    private readonly orderRepo:Repository<Order>,
    private readonly validator:dialValidate
    
  ){}
  private ordertype:Ordertype[] = [] 
  async createOrder(dto:CreateOrderDto) :Promise<Ordertype>{
     const dial_number = this.validator.CheckDialformat(dto.client_phone)
    const create =  this.orderRepo.create({
      product_name:dto.product_name,
      userId:dto.user_id,
      client_name:dto.client_name,
      client_phone:dial_number,
      OrderDate:dto.OrderDate
      
    })
    return this.orderRepo.save(create)
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
