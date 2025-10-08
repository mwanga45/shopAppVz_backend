import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { StockStatus } from 'src/type/type.interface';
export class CreateSaleDto {
  @IsString()
  @IsNotEmpty()
  Total_pc_pkg_litre: number; 

  @IsNumber()
  @IsNotEmpty()
  ProductId: number;

  @IsNumber()
  @IsNotEmpty()
  Expecte_profit:number;

  @IsNumber()
  @IsNotEmpty()
  Net_profit:number;

  @IsNumber()
  @IsOptional()
  Discount_percentage:number

  @IsNumber()
  @IsOptional()
  Percentage_deviation:number

  @IsNumber()
  @IsNotEmpty()
  Revenue:number

  @IsNotEmpty()
  @IsString()
  Stock_status:StockStatus
}

export class SalesResponseDto{
 @IsNotEmpty()
 @IsNumber()
 ProductId:number

 @IsNotEmpty()
 @IsNumber()
 Selling_price:number

 @IsNotEmpty()
 @IsNumber()
 Total_product:number
}



