import { IsString } from "class-validator";

export class CreateStockDto {
    @IsString()
    product_id:string

    @IsString()
    Addition_strock:string

}
