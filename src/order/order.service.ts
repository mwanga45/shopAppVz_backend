import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Ordertype } from './utils/order.type';
import { dialValidate } from 'src/common/helper/phone.helper';
import { Customer } from 'src/entities/customer.entity';
import { ResponseType } from 'src/type/type.interface';
import { Product } from 'src/product/entities/product.entity';
import { UnofficialProduct } from './entities/Unofficialproduct.entity';



@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) 
    private readonly orderRepo:Repository<Order>,
    @InjectRepository(Customer) private readonly CustomerRepo: Repository<Customer>,
    @InjectRepository(Product)
    private readonly  ProductRepo:Repository<Product>,
    @InjectRepository(UnofficialProduct)
    private readonly  UproductRepo:Repository<UnofficialProduct>,
    private readonly validator:dialValidate
  ){}
  private ordertype:Ordertype[] = [] 
  async createOrder(dto:CreateOrderDto) :Promise<ResponseType<any>>{
  //    const dial_number = this.validator.CheckDialformat(dto.client_phone)
     
  //   const create =  this.orderRepo.create({
  //     product_name:dto.product_name,
  //     userId:dto.user_id,
  //     client_name:dto.client_name,
  //     client_phone:dial_number.data,
  //     OrderDate:dto.OrderDate
  //   })
  //   return this.orderRepo.save(create)
  // }

  // async ProductSummary():Promise<{
  //   ActiveOrder:{
  //     data:any[];
  //     count:number;
  //     message?:any;
  //   },
  //   NearlyOrder:{
  //     data:any[];
  //     count:number;
  //     message?:string;
  //   },
  //   OrdersHistory:{
  //     data:any[];
  //     count:number;
  //     message?: string;
  //   }
  // }>{
  //   const now = new Date();
  //   const dateOfToday = [
  //     String(now.getDate()).padStart(2,'0'),
  //     String(now.getMonth()+1).padStart(2,'0'),
  //     String(now.getFullYear()),
  //   ].join('/')

  //   const FeatureDay = [
  //     String(now.getDate()+2).padStart(2,'0'),
  //     String(now.getMonth()+1).padStart(2,'0'),
  //     String(now.getFullYear())
  //   ].join("/")
  //  console.log("feature ",FeatureDay)
  //  console.log("dateof to day",dateOfToday)
  //  const [OrderHistory,ActiveOrders,NearlyOrders]=  await Promise.all([
  //   this.orderRepo.find(),
  //   this.orderRepo.find({where:{OrderDate:LessThanOrEqual(dateOfToday)}}),
  //   this.orderRepo.find({where:{OrderDate:MoreThanOrEqual(FeatureDay)}})
  //  ])
  //  return {
  //    ActiveOrder:{
  //     data:ActiveOrders,
  //     count:ActiveOrders.length,
  //     ...(ActiveOrders.length === 0 &&{message:"No Active Order Available"})
      
  //   },
  //   OrdersHistory:{
  //     data:OrderHistory,
  //     count:OrderHistory.length,
  //      ...(OrderHistory.length === 0 && {message:"No Order History found at all"})  
  //   },
  //   NearlyOrder:{
  //     data:NearlyOrders,
  //     count:NearlyOrders.length,
  //     ...(NearlyOrders.length === 0 && {message:"No Order in near feature"})
  //   }

  // }
  // create an  function  that  will Automatic make sure is cancelled after ten days 
  // after status stays pending for that time and then send are message  as record of 
  // automatic  cancellation of order(Automatic invoke functu=ion) 
  return{
    message:"su",
    success:true

  }
  }

  async ReturnOffAndUnoff ():Promise<ResponseType<any>>{
    const findofficalproduct = await this.ProductRepo.createQueryBuilder('p')
    .select([
      'p.product_name AS Product_name',
      ''
    ])
    return{
      message:"succ",
      success:true
    }
  }
  async findAllcustomer():Promise<ResponseType<any>>{
  const customerdetails = await this.CustomerRepo.createQueryBuilder('c')
  .select([
       "c.id As Cid",
      "c.customer_name AS customer_name",
      "c.phone_number AS phone_number",
      "c.Location AS Location"
  ])
  .getRawMany()
  
    return{
      message:"successfuly",
      success:true,
      data:customerdetails
    }

  }

}
