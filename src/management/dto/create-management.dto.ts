import { IsNumber,  IsOptional,  IsString, Length} from "class-validator";
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
    bankdebt:number

    
}
export class CreateServiceDto{
    @IsString()
    @Length(3, 30)
    service_name:string

    @IsString()
    icon_name:string
}

export class ServiceRequestDto{
    
    @IsNumber()
    service_id:number

    @IsNumber()
    payment_Amount:number

    @IsOptional()
    @IsString()
    withdrawFrom:string

    @IsOptional()
    @IsString()
    depositTo:string

}

export class TransactionRequestDto{
    @IsString()
    service_name:string
}