import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSaleDto {
  @IsString()
  @IsNotEmpty()
  Total_pc_pkg_litre: string;

  @IsString()
  @IsNotEmpty()
  TotalGenerated: string;

  @IsString()
  @IsNotEmpty()
  TotalProfit: string;

  @IsString()
  @IsNotEmpty()
  productId: string;
}

