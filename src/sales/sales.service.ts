import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { WholeSales } from './entities/wholesale.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { RetailSales } from './entities/retailsale.entity';
import { NotFoundException } from '@nestjs/common';
import { ProductWholesales } from './utils/whole.type';
import { isDate, isEmpty } from 'class-validator';
import { SalesHelper } from 'src/common/helper/sales.helper';
import { StockUpdateHelper } from 'src/common/helper/stockUpdate,helper';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Product) private readonly ProductRepository:Repository<Product>,
    @InjectRepository(WholeSales) private readonly WholesalesRepository:Repository<WholeSales>,
    @InjectRepository(RetailSales) private readonly RetailsalesRepository:Repository<RetailSales>,
    private readonly SalesHelper:SalesHelper,
    private readonly stockupdate:StockUpdateHelper ,
  ){}
  create(createSaleDto: CreateSaleDto) {
    return 'This action adds a new sale';
  }

  findAll() {
    return `This action returns all sales`;
  }
  async Wholesale():Promise<any>{
     const wholesalesquery =   await this.ProductRepository.createQueryBuilder("product")
     .select([
      "product.id",
      "product.product_name",
      "product.product_category",
      "product.product_type",
      "product.purchase_price",
      "product.wholesales_price",
     ])
     .where("product.product_category = :category",{category:"wholesales"})
     .getMany();
     if(WholeSales.length){
      return "No product avalaible yet"
     }
     
     return wholesalesquery
  }
  async RetailsSales():Promise<any>{
    const RetailSales = await this.ProductRepository.createQueryBuilder('product')
    .select([
      "product.id",
      "product.product_name",
      "product.product_category",
      "product.product_type",
      "product.purchase_price",
      "product.retailsales_price"
    ])
    .where("product.product_category =:category",{category:"retailsales"})
    .getMany();
    if (RetailSales.length === 0){
      return "No Product Available yet"
    }
    return RetailSales
  }

  async Whole_Sales_Record(Dto:CreateSaleDto,userId:number):Promise<any>{
   const check_product = await this.ProductRepository.exists({
    where:{id:Dto.productId}
   })
   if(!check_product){
    throw new  BadRequestException('There is no such product')
   }
   if(Dto.product_type === "solid"){
    const productType =  Dto.Total_pc_pkg_litre.concat('','L')
    const productDB_info= await this.ProductRepository.findOne({
      where:{id:Dto.productId},
      select:['purchase_price', 'wholesales_price']
    })

    if(!productDB_info){
     throw new NotFoundException('Product not found for profit calculation')
    }
    const ProfitGenerated = this.SalesHelper.CalculateProfit_Wholesales(productDB_info.purchase_price, productDB_info.wholesales_price,undefined, Dto.Total_pc_pkg_litre)
    const ExpectedProfit = this.SalesHelper.calculateExpectedProfit_Wholesales(productDB_info.wholesales_price,productDB_info.purchase_price,undefined,Dto.Total_pc_pkg_litre)
    const {deviation_profit,deviation_percentage} = this.SalesHelper.calculeDevition(ExpectedProfit,ProfitGenerated)

    const Addsales =  this.WholesalesRepository.create({
      productId:Dto.productId,
      profit_deviation: deviation_profit,
      percentage_deviation: deviation_percentage,
      TotalGenerated: ProfitGenerated,
      TotalProfit: ProfitGenerated, 
      Epected_Profit:ExpectedProfit,
      userId:{id:userId}
    })
    const sellingReason = "Sold" 
    const UpdateAndTrackestock = await this.stockupdate.UpdateStock_Info(Number(Dto.productId),Dto.Total_pc_pkg_litre,sellingReason,Dto.product_status,Dto.product_category) 
   }
   else if(Dto.product_type === "liquid"){
     const productType = Dto.Total_pc_pkg_litre.concat('','L')
     const productDB_info= await this.ProductRepository.findOne({
       where:{id:Dto.productId},
       select:['purchase_price', 'wholesales_price']
     })
 
     if(!productDB_info){
      throw new NotFoundException('Product not found for profit calculation')
     }
     const ProfitGenerated = this.SalesHelper.CalculateProfit_Wholesales(productDB_info.purchase_price, productDB_info.wholesales_price,Dto.Total_pc_pkg_litre, undefined)

   }
  }

  
  
  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
  async ProfitCalc(Total_litre_kg:string,product_id:string):Promise<any>{
    const AmountperEach = await this.ProductRepository.createQueryBuilder('p')
  }
  timetest():any{
    const date = new Date()
    const yy = String(date.getFullYear())
    const dd = String(date.getDay()).padStart(2 ,'0')
    const mm = String(date.getMonth()+1).padStart(2,'0')
    const fulldate = yy.concat(".",mm,".",dd)
    return fulldate
  }
}