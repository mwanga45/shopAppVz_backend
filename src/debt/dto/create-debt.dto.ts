import { Type } from 'class-transformer';
import { IsNumber, IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';
import { StockStatus, paymentstatus, override } from 'src/type/type.interface';

export class CreateDebtDto {
  @IsNumber()
  @IsNotEmpty()
  Total_pc_pkg_litre: number;

  @IsNumber()
  @IsNotEmpty()
  ProductId: number;

  @IsNumber()
  @IsNotEmpty()
  Expected_profit: number;

  @IsNumber()
  @IsNotEmpty()
  Net_profit: number;

  @IsString()
  @IsOptional()
  Discount_percentage: string;

  @IsNumber()
  @IsOptional()
  Percentage_deviation: number;

  @IsNumber()
  @IsNotEmpty()
  Revenue: number;

  @IsNumber()
  @IsNotEmpty()
  profit_deviation: number;

  @IsNotEmpty()
  @IsString()
  Stock_status: StockStatus;

  @IsNotEmpty()
  @IsString()
  paymentstatus: paymentstatus;

  @IsNotEmpty()
  @IsString()
  Phone_number: string;

  @IsNotEmpty()
  @IsString()
  Debtor_name: string;

  @IsOptional()
  @IsNumber()

  paidmoney: number;

  @IsString()
  @IsOptional()
  location:string

  @IsOptional()
  @Type(() => Date) 
  @IsDate()
  PaymentDateAt: Date;

}


