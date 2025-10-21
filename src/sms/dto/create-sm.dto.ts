import { IsNumber, IsString, isString } from "class-validator";

export class CreateSmDto {
    @IsNumber()
    phone_number: number
    @IsString()
    sms:string

}
