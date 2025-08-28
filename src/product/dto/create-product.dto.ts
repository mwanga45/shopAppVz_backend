import { IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    product_name:string

    @IsString()
    product_category:"both" | "wholesales"|"retailsales"|"none"
    
    @IsString()
    product_type:"liquid"|"solid"
    
    @IsString()
    Rs_price:string
    
    @IsString()
    Ws_price:string

    @IsString()
    purchase_price:string
}
