import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
export class CreateSaleDto {
  @IsString()
  @IsNotEmpty()
  Total_pc_pkg_litre: string;

  @IsString()
  product_type:string

  @IsString()
  product_category:string

  @IsNumber()
  @IsNotEmpty()
  productId: number;

}

export class CreateRetailsalesDto {
  @IsString()
  @IsNotEmpty()
  Total_pc_pkg_litre: string;

  @IsString()
  product_type:string

  @IsString()
  product_category:string

  @IsNumber()
  @IsNotEmpty()
  productId: number;

}

