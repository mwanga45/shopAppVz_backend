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
    
     return{
      message:"sucessfuly  return",
      success:true,
      data:FindStock
     }
  }
  CheckDiscountCalculate = async (productId:number):Promise<ResponseType<any>> =>{
    const checkDisc =  await this.ProductDiscrepo.createQueryBuilder('d')
    .leftJoin('d.product', 'p')
    .select('d.percentageDiscaunt', 'percentageDiscaunt')
    .addSelect('d.Product_start_from', 'start_from')
    .where('p.id = :productId', {productId})
    .getRawMany()
    
    return{
      message:"Successfuly",
      success:true,
      data:checkDisc[0].start_from
      
    }
  }
  
}