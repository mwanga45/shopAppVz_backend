import { IsString } from "class-validator";

export class CreateStockDto {
    @IsString()
    product_id: string

    @IsString()
    total_stock: string;

    @IsString()
    product_category: string;

 
}

