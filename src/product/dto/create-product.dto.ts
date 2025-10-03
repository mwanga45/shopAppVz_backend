import { IsBoolean, IsNumber, IsString } from "class-validator";
import { product_type } from "../entities/product.entity";
import { category } from "../entities/product.entity";
import { IsOptional, IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    product_name:string

    @IsString()
    @IsNotEmpty()
    product_category:category
    
    @IsString()
    @IsNotEmpty()
    product_type:product_type
    
    @IsOptional()
    @IsNumberString()
    Rs_price?:string
    
    @IsOptional()
    @IsNumberString()
    Ws_price?:string

    @IsOptional()
    @IsNumberString()
    wpurchase_price?:string

    @IsOptional()
    @IsNumberString()
    rpurchase_price?:string
}
export class CreateProductDiscDto{
    @IsNumber()
    @IsNotEmpty()
    productId:number

    @IsNumber()
    @IsNotEmpty()
    percebntage:number

    @IsNotEmpty()
    @IsNumber()
    cashDisc:number

    @IsNotEmpty()
    @IsNumber()
    productNumber:number
    
    @IsOptional()
    @IsBoolean()
    UpdateFlag:boolean = false

    @IsOptional()
    @IsString()
    product_name:string
}