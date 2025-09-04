import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Ordertype } from './utils/order.type';
import { dialValidate } from 'src/common/helper/phone.helper';
import { MoreThan } from 'typeorm/browser';


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
  async GetActiveOrder():Promise<any>{
    // get Active 
    const now = new Date()
    const yyyy = String(now.getFullYear())
    const mm = String(now.getMonth()+1).padStart(2,"0")
    const dd = String(now.getDate()).padStart(2,'0')
    const dateofToday = dd.concat("/",mm,"/",yyyy)
    const Active = await this.orderRepo.find({
      where:{OrderDate:LessThanOrEqual(dateofToday)}
    })
    if(Active.length === 0){
      console.log(dateofToday)
      return "No Any Order places"
    }
    return Active
  }
  async ChecknearlyOrder():Promise<any>{
    const now  = new Date()
    const yyyy = String(now.getFullYear)
    const dd = String(now.getDate()+2).padStart(2,'0')
    const mm = String(now.getMonth()+1).padStart(2,'0')
    const dateofToday = dd.concat('/',mm,'/',dd)
    console.log(dateofToday)
    const GetNearOrder = await this.orderRepo.find({
      where:{
        OrderDate:MoreThan(dateofToday)
      }
    })
    if (GetNearOrder.length===0){
      return "There is No Nearly Order"
    }
    return GetNearOrder
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
