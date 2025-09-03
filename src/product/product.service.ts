import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';



type Productpayload = {
  id: number,
  product_name: string,
  product_category: string,
  product_type: string,
  purchase_price: string,
  retailsales_price: string,
  wholesales_price: string,
  UpdateAt: Date,
}

@Injectable()

export class ProductService {
  constructor(
   @InjectRepository(Product) private readonly  Productrepository:Repository<Product>
  ){}
  
  async create(createProductDto: CreateProductDto):Promise<string> {
    // const {product_name,product_category,product_type,wholesales_price,retailsales_price,purchase_price} = Product
    const product = await this.Productrepository.findOne({where:{product_name:createProductDto.product_name}})
    if(product){
       throw new UnauthorizedException("Product name is already been exist")
    }
    if (createProductDto.purchase_price >= createProductDto.Ws_price){
      throw new UnauthorizedException("Please check the purchase prise and the whole sales  of this product the  pruschase sales must be small than  whole")
    }
    const allowedCategories = ["both", "wholesales", "retailsales", "none"]
    const allowedTypes = ["liquid", "solid"]
    const categoryValid = allowedCategories.includes(createProductDto.product_category)
    const typeValid = allowedTypes.includes(createProductDto.product_type)
    if (!categoryValid || !typeValid){
      throw new UnauthorizedException("Please check either produc_category or product_type make sure u send appropiate  info")
    }
    const createproduct = this.Productrepository.create({
      product_name:createProductDto.product_name,
      product_category:createProductDto.product_category,
      product_type:createProductDto.product_type,
      wholesales_price:createProductDto.Ws_price,
      retailsales_price:createProductDto.Rs_price,
      purchase_price:createProductDto.purchase_price
    })
    await this.Productrepository.save(createproduct)
    return "Successfuly create  new product"
  }

  async findAll(filter?:{category?:string,type?:string}):Promise<Productpayload[] | string> {
    const query = this.Productrepository.createQueryBuilder("product")
      .select([
        "product.id",
        "product.product_name",
        "product.product_category",
        "product.product_type",
        "product.purchase_price",
        "product.retailsales_price",
        "product.wholesales_price",
        "product.UpdateAt",
      ]);

    if (filter?.type) {
      query.andWhere("product.product_type = :type", { type: filter.type });
    }
    if (filter?.category) {
      query.andWhere("product.product_category = :category", { category: filter.category });
    }
    const response =  await query.orderBy("product.product_name", "ASC").getMany();
    if(response.length === 0){
      return "No such product"
    }
    return response

  }
  async findby_category():Promise<Productpayload[]>{
    const products = await this.Productrepository.find({
      select:["id", "product_name","product_category","product_type", "purchase_price","retailsales_price","wholesales_price","UpdateAt" ],
      order:{ product_category: "ASC", product_name: "ASC" }
    });
    return products;
  }

  async findOne(product_id: number):Promise<any> {
    const ProductbyId = await this.Productrepository.findOne({where:{id:product_id}, select:["id","product_name","product_type","product_category",'product_type',"purchase_price","wholesales_price","retailsales_price"]})
    return ProductbyId;
  }
  async updateproduct(id:number,updateProductDto:UpdateProductDto):Promise<any>{
    return await this.Productrepository.update({id},{...updateProductDto})

  }

  async Removeproduct(id: number):Promise<any> {
    await this.Productrepository.delete({id})
  }
}
