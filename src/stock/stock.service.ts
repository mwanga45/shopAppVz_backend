import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Stock_transaction } from './entities/stock.entity';
import { category, Product } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { ResponseType } from 'src/type/type.interface';
// import { StockUpdateHelper } from 'src/common/helper/stockUpdate,helper';
import { WebSocketSubjectConfig } from 'rxjs/webSocket';
@Injectable()

export class StockService {
  constructor(
    @InjectRepository(Stock) private readonly stockRepo:Repository<Stock>,
    @InjectRepository(Stock_transaction) private readonly recstockRepo:Repository<Stock_transaction>,
    // private readonly stockhelper:StockUpdateHelper,
    @InjectRepository(Product) private readonly productRepo:Repository<Product>
  ){}

   async createStockRec (Dto:CreateStockDto, userId:any):Promise<ResponseType<any>>{
    // check if the product is Already registered
    const checkExistence = await this.stockRepo.exists({
      where:{product:{id:Number(Dto.product_id)}, product_category:Dto.product_category}
    })
    if(checkExistence){
      return {
        message:"Please you have already register the  product go to stock to update it",
        success:false 
      }
    }
    const stockRec =  this.stockRepo.create({
      product:{id: Number(Dto.product_id)},
      Total_stock: Number(Dto.total_stock),
      product_category:Dto.product_category,
      user:{id:userId}
    })
    const reason = "Register New product"
    this.stockRepo.save(stockRec)
     const QueryStockTrans =    this.recstockRepo.create({
      product:{id:Number(Dto.product_id)},
      product_category:Dto.product_category,
      new_stock:Number(Dto.total_stock),
      Quantity:Number(Dto.total_stock),
      user:{id:userId},
      Reasons:reason
     })
     this.recstockRepo.save(QueryStockTrans)
     return {
      success:true,
      message:"Successfuly register the product and make follow up"
     }
   } 
  async findProductInfo ():Promise<any>{
    const getWholesalesquery = this.productRepo.createQueryBuilder('p')
    .select([
      "p.id",
      "p.product_name",
      "p.product_category"
    ])
    .where('p.product_category = :category',{category:category.wholesales})
    const ForWholesales = await getWholesalesquery.orderBy('p.product_name', 'ASC').getMany()

    const getRetailsalesquery = this.productRepo.createQueryBuilder('p')
    .select([
      'p.id',
      'p.product_name',
      'p.product_category',
    ])
    .where('p.product_category = :category',{category:category.retailsales})
    const ForRetailsales = await getRetailsalesquery.orderBy('p.product_name',"ASC").getMany()

    return {
      ForRetailsales,ForWholesales
    }

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
