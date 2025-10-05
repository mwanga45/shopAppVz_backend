import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
export class CreateSaleDto {
  @IsString()
  @IsNotEmpty()
  Total_pc_pkg_litre: number; 

  @IsString()
  @IsOptional()
  Product_type:string;

  @IsString()
  Product_category:string;

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
  Stock_status:string

}

export class SalesResponseDto{
  
}



