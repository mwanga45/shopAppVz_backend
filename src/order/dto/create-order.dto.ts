import { isNotEmpty, IsNumber, IsString } from "class-validator";
export enum Orderstatus {
    Fullpaid ="fullpaid",
    Partialpaid = 'partialpaid',
    pending = 'pending',
    Partial = "Partial"
    
}
export class CreateOrderDto {


    @IsString()
    product_name:string

    @IsString()
    client_name:string

    @IsString()
    client_phone:string

    @IsString()
    OrderDate:string

    @IsNumber()
    paidMoney:number

    @IsNumber()
    payamount:number

    @IsString()
    Quantity:string

    @IsString()
    Phone_number:string

    @IsString()
    Orderstatus:Orderstatus

}
