import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { WholeSales } from './entities/wholesale.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { RetailSales } from './entities/retailsale.entity';
import { NotFoundException } from '@nestjs/common';
import { ResponseType } from 'src/type/type.interface';


@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Product) private readonly ProductRepository:Repository<Product>,
    @InjectRepository(WholeSales) private readonly WholesalesRepository:Repository<WholeSales>,
    @InjectRepository(RetailSales) private readonly RetailsalesRepository:Repository<RetailSales>,
    @InjectRepository(Stock) private readonly Stockrepo:Repository<Stock>
  ){}

   StockCheck = async(productId:string):Promise<ResponseType<any>>=>{
    const id = Number(productId)
    const FindStock = await this.Stockrepo.createQueryBuilder('s')
    .leftJoin('s.product', 'p')
    .select('s.Total_stock', 'totalstock')
    
    
     return{
      message:"sucessfuly  return",
      success:true,
      data:check_stock
     }
  }
  
}