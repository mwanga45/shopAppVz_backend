import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangeType, Stock } from './entities/stock.entity';
import { Stock_transaction } from './entities/stock.entity';
import { category, Product } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { ResponseType } from 'src/type/type.interface';
import { StockType } from './entities/stock.entity';
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

   async updateStock(id: number, updateStockDto: UpdateStockDto,userId:any):Promise<ResponseType<any>> {
    if(updateStockDto.Method === ChangeType.ADD){
    const findTotal = await this.stockRepo.createQueryBuilder('s')
    .select('s.Total_stock', 'total') 
    .where('s.product_id = :product_id',{product_id:updateStockDto.product_id})
    .getRawOne<{total:number}>()
    if(!findTotal){
      return{
        success:false,
        message:'Failed  to find  the targeted product '
      }
    }
    const FindSum = findTotal.total + updateStockDto.total_stock
    const Updatestk = await this.stockRepo.update(id, {
      Total_stock:FindSum,
      user:{id:userId},
    });
    const stock_details = await this.recstockRepo.createQueryBuilder('S')
    .select(['S.prev_stock','S.Quantity','S.new_stock' ])
    .where('S.product_id = :product_id',{product_id:updateStockDto.product_id})
    .orderBy('S.CreatedAt', 'ASC')
    .getOne()

    if(!stock_details){
      return{
        message:"Failed  to get prev total",
        success:false
      }
    }
    const findNewstock = stock_details.new_stock + updateStockDto.total_stock
    const updatestocktrans =   this.recstockRepo.create({
      product:{id:updateStockDto.product_id},
      product_category:updateStockDto.product_category,
      type_Enum:StockType.IN,
      new_stock:findNewstock,
      prev_stock:stock_details.new_stock,
      Quantity:updateStockDto.total_stock,
      Change_type:updateStockDto.Method,
      user:{id:userId},
      Reasons:updateStockDto.Reasons
    })
    this.recstockRepo.save(updateStockDto)
      return{
      message:"Succefuly Update Stock",
      success:true
    }

    }else if(updateStockDto.Method === ChangeType.REMOVE){
      const findTotal = await this.stockRepo.createQueryBuilder('s')
      .select('s.Total_stock', 'total')
      .where('s.product_id = :product_id',{product_id:updateStockDto.product_id})
      .getRawOne<{total:number}>()

      if(!findTotal){
        return{
          message:"Failed to return total stock",
          success:false
        }
      }
      const updateTotalstock = findTotal.total - updateStockDto.total_stock;
      const updatestock  = await this.stockRepo.update(id,{
      Total_stock:updateTotalstock,
      user:{id:userId}
      })
      const QueryStockTrans = await this.recstockRepo.createQueryBuilder('S')
      .select(['S.new_stock', 'S.prev_stock'])
      .where('S.product_id = :product_id', {product_id:updateStockDto.product_id})
      .orderBy('S.CreateAt','DESC')
      .getOne();
      if(!QueryStockTrans){
        return{
          message:"No record  of the product in Stock_trans table",
          success:false
        }
      }
      const findNewstock =  QueryStockTrans.new_stock - updateStockDto.total_stock
      const newstocktrancrec =  this.recstockRepo.create({
        user:{id:userId},
        Quantity:updateStockDto.total_stock,
        prev_stock:QueryStockTrans.new_stock,
        new_stock:findNewstock,
        product:{id:updateStockDto.product_id},
        type_Enum:StockType.OUT,
        product_category:updateStockDto.product_category,
        Change_type:ChangeType.REMOVE
      })
      this.recstockRepo.save(newstocktrancrec)
      return{
        message:"Succesfuly Updatw Stock (reduce number stock)",
        success:false
      }
    }
    return{
      message:"Fail to update Stock please try again",
      success:false
    }
  }

  async returnStockInfo ():Promise<ResponseType<any>> {
    // select  the  productname , productname , new_stock  of last Add COLUMN  and new_stock of the    coloumn  for each product in stock trans
    const  getStockInfo = await this.recstockRepo.createQueryBuilder('s')
    .leftJoin('s.product', 'p')
    .leftJoin('A', 'user_id')
    .select('p.id','product_id' )
    .addSelect('p.product_name', 'product_name')
    .addSelect(
      `(SELECT st new_stock From Stock_transaction  st
      where product_id = product_id  AND st Change_type = 'Add'
      ORDER BY CreatedAt DESC
      LIMIT 1), last_add_stock`
    )
    .addSelect(
      `(SELECT  st new_stock   FROM Stock_transaction  st
        where  product_id = product_id 
        ORDER BY CreateAt  DESC
        LIMIT 1 ), last_stock`
    )
    
    
    return{
      message:"Succefuly Obtain data",
      success:true
    }

    
  }
}
