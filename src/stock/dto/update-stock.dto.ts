import { PartialType } from '@nestjs/mapped-types';
import { CreateStockDto } from './create-stock.dto';
import { ChangeType } from '../entities/stock.entity';
import { StockType } from '../entities/stock.entity';
import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';

export class UpdateStockDto{
    @IsNumber()
    product_id:number;
    @IsNumber()
    total_stock:number;
    @IsEnum(ChangeType)
    Method:ChangeType;
    @IsString()
    
    @IsOptional()
    Reasons:string;
    @IsString()
    product_category:string
}
