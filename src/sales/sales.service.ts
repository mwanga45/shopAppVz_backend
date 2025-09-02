import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { WholeSales } from './entities/sale.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { RetailSales } from './entities/sale.entity';
import { NotFoundException } from '@nestjs/common';
import { ProductInfo } from './type/type';
import { isDate, isEmpty } from 'class-validator';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Product) private readonly ProductRepository:Repository<Product>,
    @InjectRepository(WholeSales) private readonly WholesalesRepository:Repository<WholeSales>,
    @InjectRepository(RetailSales) private readonly RetailsalesRepository:Repository<RetailSales>
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

  async Sales_Record(sales:{product_id:string;product_type:string;product_category:string;totals_pc_kg_ltre:string}):Promise<any>{
   const {product_id,product_type,product_category,totals_pc_kg_ltre} =  sales;

  //  check product category
  if(product_category === "wholesales"){
    // update the  wholesales table base on date of today
    // also check  the  type of product  make sure the row  created with specific measure in column of the type
    // ckeck if the  today it have already have an record  by check product id id if is already exist in table
    // if not  create
    // if exist update the table
    // make sure ur update also the  stock

  }
  // do the same to retail_category product


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
}