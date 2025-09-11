import { IsString } from "class-validator";
import { product_type } from "../entities/product.entity";
import { category } from "../entities/product.entity";

export class CreateProductDto {
    @IsString()
    product_name:string

    @IsString()
    product_category:category
    
    @IsString()
    product_type:product_type
    
    @IsString()
    Rs_price:string
    
    @IsString()
    Ws_price:string

    @IsString()
    wpurchase_price:string

    @IsString()
    rpurchase_price:string
}
