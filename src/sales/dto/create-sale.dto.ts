import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { StockType } from 'src/stock/entities/stock.entity';
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

  @IsString()
  type:'enum'
  product_status:StockType
}

