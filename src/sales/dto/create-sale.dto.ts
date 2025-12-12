import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
  IsEnum,
} from 'class-validator';
import { paymentstatus, StockStatus, override, paymentvia, updatetype, UpdatePendingType } from 'src/type/type.interface';

export class CreateSaleDto {
  @IsNumber()
  @IsNotEmpty()
  Total_pc_pkg_litre: number;

  @IsNumber()
  @IsNotEmpty()
  ProductId: number;

  @IsNumber()
  @IsNotEmpty()
  Expecte_profit: number;

  @IsNumber()
  @IsNotEmpty()
  Net_profit: number;

  @IsString()
  @IsOptional()
  Discount_percentage: string;

  @IsOptional()
  @IsNumber({}, { message: 'Percentage_deviation must be a number' })
  @Min(0, { message: 'Percentage_deviation cannot be less than 0%' })
  @Max(100, { message: 'Percentage_deviation cannot be more than 100%' })
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

  @IsString()
  @IsOptional()
  override: override;

  @IsEnum(paymentvia)
  @IsNotEmpty()
  payment_via: paymentvia;
}

export class SalesResponseDto {
  @IsNotEmpty()
  @IsNumber()
  ProductId: number;

  @IsNotEmpty()
  @IsNumber()
  Selling_price: number;

  @IsNotEmpty()
  @IsNumber()
  Total_product: number;

}

export class Updatesales_Dto {
  @IsNumber()
  sales_id:number

  @IsNumber()
  product_id:number

  @IsString()
  updatetype:updatetype
  
  @IsOptional()
  @IsEnum(paymentvia)
  PaymentVia:paymentvia

  @IsOptional()
  @IsString()
  debtorname:string

  @IsOptional()
  @IsString()
  paidAmount:number

  @IsOptional()
  @IsString()
  phone_number:string

  @IsOptional()
  @IsString()
  dateofReturn:string

  @IsString()
  @IsOptional()
  location:string
}
export class updatePendingDto{
  @IsOptional()
  @IsEnum(paymentvia)
  paymentVia:paymentvia

  @IsOptional()
  @IsString()
  debtorName:string
 
  @IsOptional()
  @IsString()
  debtorPhone:string

  @IsOptional()
  @IsNumber()
  PaidAmount:number

  @IsOptional()
  @IsString()
  PaymentDateAt:string
 
  @IsOptional()
  @IsString()
  location:string

  @IsString()
  @IsEnum(UpdatePendingType)
  UpdateType:UpdatePendingType

  @IsNumber()
  Product_id:number

  @IsNumber()
  Sales_id:number

}
