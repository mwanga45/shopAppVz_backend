import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Ordertype } from './utils/order.type';
import { dialValidate } from 'src/common/helper/phone.helper';
import { Customer } from 'src/entities/customer.entity';
import { category, ResponseType } from 'src/type/type.interface';
import { Product } from 'src/product/entities/product.entity';
import { UnofficialProduct } from './entities/Unofficialproduct.entity';
import { DataSource } from 'typeorm';



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
    private readonly Datasource:DataSource,
    private readonly validator:dialValidate
  ){}
  private ordertype:Ordertype[] = [] 
 
  async createOrder(dto:CreateOrderDto) :Promise<ResponseType<any>>{
 return await this.Datasource.transaction(async(manager)=> {
    try{

       return{
        message:"successfuly",
        success:true
      }

    }catch(error){
      return{
        message:"su",
        success:false
      }
    }
 })
  }
  // create an  function  that  will Automatic make sure is cancelled after ten days 
  // after status stays pending for that time and then send are message  as record of 
  // automatic  cancellation of order(Automatic invoke functu=ion) 

  
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

  async ReturnOffAndUnoff(): Promise<ResponseType<any>> {
  const products = await this.ProductRepo.find();
  const filteredProducts = products
    .filter((product) => {
      return (
        product.wholesales_price !== null ||
        product.retailsales_price !== null
      );
    })

    .map((product) => {
      let newName = product.product_name;
      let sellingPrice: string | null = null;

      if (product.product_category === category.wholesales) {
        newName = `w${product.product_name}`;
        sellingPrice = product.wholesales_price;
      } else if (product.product_category === category.retailsales) {
        newName = `r${product.product_name}`;
        sellingPrice = product.retailsales_price;
      }

      return {
        product_name: newName,
        selling_price: sellingPrice,
      };
    });

    const UnofficialProduct = await this.UproductRepo.createQueryBuilder('u')
    .select('u.Uproduct_name',"Uproduct_name")
    .addSelect('u.Uproduct_price', 'selling_price')
    .getRawMany()
    const finalResult = {UnofficialProduct,filteredProducts}
  return {
    message: "success",
    success: true,
    data: finalResult,
  };
}


}
