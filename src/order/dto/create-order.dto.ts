import { isNotEmpty, IsString } from "class-validator";

export class CreateOrderDto {
    @IsString()
    user_id:string

    @IsString()
    product_name:string

    @IsString()
    client_name:string

    @IsString()
    client_phone:string

    @IsString()
    OrderDate:string

    @IsString()
    Quantity:string

}
