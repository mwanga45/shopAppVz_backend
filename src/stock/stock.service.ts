import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Stock_transaction } from './entities/stock.entity';
import { category, Product } from 'src/product/entities/product.entity';
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
        const findProductname = await  this.productRepo.find({
      where:{
        id:product_Id
      }
    })
    return findProductname
   }
   async createStockRec (Dto:CreateStockDto):Promise<any>{
    const checkProduct = await this.check_productname(Dto.product_id)
    const stockRec =  this.stockRepo.create({
      product_Id: Dto.product_id,
      Total_stock: Dto.total_stock,
      product_category:Dto.category
    })
    return this.stockRepo.save(stockRec)
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
