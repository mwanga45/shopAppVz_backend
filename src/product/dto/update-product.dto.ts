import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator"
import { category, product_type } from "../entities/product.entity"


export class UpdateProductDto{
        @IsString()
        @IsNotEmpty()
        product_name:string

        @IsNumber()
        @IsNotEmpty()
        id:number
    
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


