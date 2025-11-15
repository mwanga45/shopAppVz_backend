import { IsNumber,  IsOptional,  IsString } from "class-validator";
import { capitalTimes } from "src/type/type.interface";

export class CreateManagementDto {
    @IsNumber()
    total_capital:number

    @IsNumber()
    cash_capital:number

    @IsNumber()
    Bank_capital:number

    @IsString()
    code:string

    @IsString()
    registerTime:capitalTimes

    @IsNumber()
    @IsOptional()
    withdraw:number

    

}
