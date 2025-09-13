import { PartialType } from '@nestjs/mapped-types';
import { CreateStockDto } from './create-stock.dto';
import { ChangeType } from '../entities/stock.entity';


export class UpdateStockDto{
    product_id:number;
    product_name:string;
    total_stock:number;
    Methode:ChangeType;
    Reasons:String
    
}
