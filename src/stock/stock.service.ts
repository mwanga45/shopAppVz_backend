import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Stock_transaction } from './entities/stock.entity';
import { Product } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { StockUpdateHelper } from 'src/common/helper/stockUpdate,helper';

@Injectable()

export class StockService {
  constructor(
    @InjectRepository(Stock) private readonly stockRepo:Repository<Stock>,
    @InjectRepository(Stock_transaction) private readonly recstockRepo:Repository<Stock_transaction>,
    private readonly stockhelper:StockUpdateHelper,
    @InjectRepository(Product) private readonly productRepo:Repository<Product>
  ){}
 async check_productname(product_Id:any):Promise<any>{
        const findProductname = await  this.productRepo.findOne({
      where:{
        id:product_Id
      }
    })
    
    return findProductname
   }
   async createStockRec (stock:{product_id:string; total_stock:string,category:string;product_type:string}):Promise<any>{
    const checkProduct = await this.check_productname(stock.product_id)
    const stockRec =  this.stockRepo.create({
      product_Id: stock.product_id,
      Total_stock: Number(stock.total_stock),
      product_category:stock.category
    })
    return this.stockRepo.save(stockRec)
   } 

  findAll() {
    return `This action returns all stock`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stock`;
  }

  update(id: number, updateStockDto: UpdateStockDto) {
    return `This action updates a #${id} stock`;
  }

  remove(id: number) {
    return `This action removes a #${id} stock`;
  }
}
