import { PartialType } from '@nestjs/mapped-types';
import { CreateStockDto } from './create-stock.dto';
import { ChangeType } from '../entities/stock.entity';
import { StockType } from '../entities/stock.entity';

export class UpdateStockDto{
    product_id:number;
    total_stock:number;
    Method:ChangeType;
    Reasons:string;
    product_category:StockType
}
