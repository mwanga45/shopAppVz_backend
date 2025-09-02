import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Stock_record } from './entities/stock.entity';
import { Product } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()

export class StockService {
  constructor(
    @InjectRepository(Stock) private readonly stockRepo:Repository<Stock>,
    @InjectRepository(Stock_record) private readonly recstockRepo:Repository<Stock_record>,
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
    const {product_id, total_stock, category,product_type} = stock
    const stock_exist = await this.stockRepo.findOne({
      where:{product_id} as any
    });
    if(stock_exist){
      // logic update the  table and also make sure  add that info of details to stockrecode table
      const productname = this.check_productname(product_id)
      return "Successfully update the stock product name"
    }
    const stockRec =  this.stockRepo.create({
      product_Id:product_id,
      Total_stock:total_stock
    })
    await this.stockRepo.save(stockRec)
    const StockTrack = this.recstockRepo.create({
      Product_Id:product_id,
      Addition_kg_litre_Pc:total_stock
    })
    await this.recstockRepo.save(StockTrack)

    return "succesfully update stock record"
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
