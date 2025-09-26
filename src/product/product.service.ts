import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateProductDto ,CreateProductDiscDto} from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { And, Repository } from 'typeorm';
import { ResponseType } from 'src/type/type.interface';
import { Product_discount } from './entities/discount.entity';



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
   @InjectRepository(Product) private readonly  Productrepository:Repository<Product>,
   @InjectRepository(Product_discount) private readonly DiscountRepo:Repository<Product_discount>
  ){}
  
  async create(createProductDto: CreateProductDto, userId:any):Promise<string> {
    // check incoming data
    if(createProductDto.product_category === "retailsales" && (!createProductDto.Rs_price || !createProductDto.rpurchase_price)){
       throw new BadRequestException("For retail sales, Retail Price and Retail Purchase Price are required.")
    }
    if(createProductDto.product_category === "wholesales" && (!createProductDto.Ws_price || !createProductDto.wpurchase_price)){
      throw new BadRequestException("For wholesale sales, Wholesale Price and Wholesale Purchase Price are required.")
    }
    const product = await this.Productrepository.findOne({where:{product_name:createProductDto.product_name , product_category:createProductDto.product_category}})
    if(product){
       throw new BadRequestException("Product name is already been exist")
    }
    if (createProductDto.Ws_price && createProductDto.wpurchase_price && Number(createProductDto.wpurchase_price) > Number(createProductDto.Ws_price)){
      throw new BadRequestException("Wholesale purchase price must be less than wholesale price.")
    }
      if (createProductDto.Rs_price && createProductDto.rpurchase_price && Number(createProductDto.rpurchase_price) > Number(createProductDto.Rs_price)){
      throw new BadRequestException("Retail purchase price must be less than retail price.")
    }
    const allowedCategories = [ "wholesales", "retailsales"]
    const allowedTypes = ["Liquid", "Solid"]
    const categoryValid = allowedCategories.includes(createProductDto.product_category)
    const typeValid = allowedTypes.includes(createProductDto.product_type)
    if (!categoryValid || !typeValid){
      throw new BadRequestException("Please check either produc_category or product_type make sure u send appropiate  info")
    }

    // Ensure product_name is not empty
    if (!createProductDto.product_name || createProductDto.product_name.trim().length === 0) {
      throw new BadRequestException("Product name cannot be empty.");
    }

    const createproduct = this.Productrepository.create({
      product_name:createProductDto.product_name,
      product_category:createProductDto.product_category,
      product_type:createProductDto.product_type,
      wholesales_price:createProductDto.Ws_price,
      retailsales_price:createProductDto.Rs_price,
      wpurchase_price:createProductDto.wpurchase_price,
      rpurchase_price:createProductDto.rpurchase_price,
      user:{id:userId}

    })
    await this.Productrepository.save(createproduct)
    return "Successfuly create  new product"
  }

  async findAll(filter?:{category?:string,type?:string}):Promise<any> {
    const query = this.Productrepository.createQueryBuilder("product")
      .leftJoinAndSelect("product.user", "user")
      .select([
        "product.id",
        "product.product_name",
        "product.product_category",
        "product.product_type",
        "product.wpurchase_price",
        "product.rpurchase_price",
        "product.retailsales_price",
        "product.wholesales_price",
        "product.userId",
        "product.UpdateAt",
        "user.fullname"
      ]);

    if (filter?.type) {
      query.andWhere("product.product_type = :type", { type: filter.type });
    }
    if (filter?.category) {
      query.andWhere("product.product_category = :category", { category: filter.category });
    }
    const response =  await query.orderBy("product.product_name", "ASC").getMany();
    if(response.length === 0){
      return "No such product category"
    }
    return response

  }
  async findby_category():Promise<any>{
    const products = await this.Productrepository.find({
      select:["id", "product_name","product_category","product_type", "wpurchase_price","rpurchase_price","retailsales_price","wholesales_price","UpdateAt" ],
      order:{ product_category: "ASC", product_name: "ASC" }
    });
    return products;
  } 

  async findOne(product_id: number):Promise<any> {
    const ProductbyId = await this.Productrepository.findOne({where:{id:product_id}, select:["id","product_name","product_type","product_category",'product_type',"wpurchase_price","rpurchase_price" ,"wholesales_price","retailsales_price"]})
    return ProductbyId;
  }
   StandadizeDiscont(wholesales_price:number, percentageDiscaunt:number){
        const CashDiscount = wholesales_price * percentageDiscaunt
  }
  async updateproduct(user_id:number,updateProductDto:UpdateProductDto):Promise<ResponseType<any>>{
    const id = Number(updateProductDto.product_id)
    console.log("product Id ", id)
    const updateprod = await this.Productrepository.update({id:id},{
      product_name:updateProductDto.product_name,
      product_category:updateProductDto.product_category,
      product_type:updateProductDto.product_type,
      wholesales_price:updateProductDto.Ws_price, 
      retailsales_price:updateProductDto.Rs_price,
      rpurchase_price:updateProductDto.rpurchase_price,
      wpurchase_price:updateProductDto.wpurchase_price,
      user:{id:user_id}})
    if(updateprod.affected === 0){
      return{
        message:"Product not found or no changes made.",
        success:false
      }
    }
    return{
      message:"Product updated successfully.",
      success:true
    }

  }

  async Removeproduct(id: number):Promise<any> {
    await this.Productrepository.delete({id})
  }


  async ProductAsignDisc (Dto:CreateProductDiscDto, user_id):Promise<ResponseType<any>>{
    const Product_existance = await this.Productrepository.findOne({
      where:{id:Dto.productId}
    })
    if(!Product_existance){
      return{
        message:"Product is not Exist",
        success:false
      }
    }
    const DiscountExist =  await this.DiscountRepo.findOne({
      where:{product:{id:Dto.productId},Product_start_from:Dto.productNumber}
    })
    if(Dto.UpdateFlag){
      const updateDisc = await this.DiscountRepo.update({product:{id:Dto.productId}}, {
        Product_start_from:Dto.productNumber,
        percentageDiscaunt:Dto.percebntage,
        CashDiscount:Dto.cashDisc,
        user:{id:user_id}
      })
      return{
        message:"Successfuly Update the Discount of this product",
        success:true
      }
    }
    const Create_Disc =  this.DiscountRepo.create({
      product:{id:Dto.productId},
      percentageDiscaunt:Dto.percebntage,
      Product_start_from:Dto.productNumber,
      CashDiscount:Dto.cashDisc,
      user:{id:user_id}
    })
    return{
      message:"Success",
      success:true
    }
  }
}
