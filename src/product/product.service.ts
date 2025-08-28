import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';



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
    return "Successfuly create  new product"
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
