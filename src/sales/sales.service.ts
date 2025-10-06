import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { WholeSales } from './entities/wholesale.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { RetailSales } from './entities/retailsale.entity';
import { Product_discount } from 'src/product/entities/discount.entity';
import { ResponseType } from 'src/type/type.interface';
import { StockStatus } from 'src/type/type.interface';


@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Product) private readonly ProductRepository:Repository<Product>,
    @InjectRepository(WholeSales) private readonly WholesalesRepository:Repository<WholeSales>,
    @InjectRepository(RetailSales) private readonly RetailsalesRepository:Repository<RetailSales>,
    @InjectRepository(Stock) private readonly Stockrepo:Repository<Stock>,
    @InjectRepository(Product_discount) private  readonly ProductDiscrepo:Repository<Product_discount>

  ){}

   StockCheck = async(id:number,productAmount:number):Promise<ResponseType<any>>=>{
    const FindStock = await this.Stockrepo.createQueryBuilder('s')
    .leftJoin('s.product', 'p')
    .select('s.Total_stock', 'totalstock')
    .where('p.id = :id', {id})
    .getRawOne()
      if(!FindStock){
        return{
          message:"No such product",
          success:false
        }
      }
      if(FindStock.totalstock >productAmount){
       const product_status  = StockStatus.NotEnough
        return{
          message:"Not enough product",
          success:true,
          data:{...FindStock, product_status}
          
        }
      }
    const product_status = StockStatus.Enough
     return{
      message:"sucessfuly  return",
      success:true,
      data:{...FindStock, product_status }
     }
  }
  CheckDiscountCalculate = async (productId:number,productAmount:number):Promise<ResponseType<any>> =>{
    const checkDisc =  await this.ProductDiscrepo.createQueryBuilder('d')
    .leftJoin('d.product', 'p')
    .select('d.percentageDiscaunt', 'percentageDiscaunt')
    .addSelect('d.Product_start_from', 'start_from') 
    .where('p.id = :productId', {productId})
    .groupBy('p.id')
    .addGroupBy('d.percentageDiscaunt')
    .addGroupBy('d.Product_start_from') 
    .addGroupBy('d.id')
    .getRawMany()
    
    if(checkDisc.length === 0){
      const Inforeport = null
      return{
        message:"Product has no  discount",
        success:false,
        data:Inforeport
      }
    }
    let matchDiscount = null
    let discountAmount:any
    const SortDisc = checkDisc.sort((a,b)=> a.start_from - b.start_from)
    for(let i = 0; i < SortDisc.length; i++){
      let currentDisc = SortDisc[i].start_from
      
      let nextDIsc = SortDisc[i +1]?SortDisc[i + 1].start_from: null
      
      if(productAmount >= currentDisc  && (!nextDIsc ||productAmount < nextDIsc )){
        matchDiscount = currentDisc;
        const filter_discont  = SortDisc.filter((item)=> item.start_from === matchDiscount)
     return{
        message:"Successfuly find discount ",
        success:true,
        data:filter_discont
      }
      }
    }
    
    return{
      message:"Successfuly",
      success:true,
      data:SortDisc
      
    }
  }

   CalculateDeviation = async():Promise<ResponseType<any>> =>{

    return{
      message:"",
      success:true
    }
  }
  
}