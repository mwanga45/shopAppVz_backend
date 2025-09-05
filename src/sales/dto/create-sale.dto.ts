import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSaleDto {
  @IsString()
  @IsNotEmpty()
  Total_pc_pkg_litre: string;

  @IsString()
  product_type:string

  @IsString()
  product_category:string

  @IsString()
  @IsNotEmpty()
  productId: string;
}

