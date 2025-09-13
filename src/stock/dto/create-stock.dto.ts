import { IsString } from "class-validator";

export class CreateStockDto {
    @IsString()
    product_id: number

    @IsString()
    total_stock: number;

    @IsString()
    product_category: string;

    @IsString()
    product_type: string
}

