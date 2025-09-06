import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Stock,Stock_transaction } from "src/stock/entities/stock.entity";
import { Repository } from "typeorm";

@Injectable()
export class StockUpdateHelper{
constructor(
    @InjectRepository(Stock) private readonly  stockrepo:Repository<Stock>,
    @InjectRepository(Stock_transaction) private readonly stock_TransRepo:Repository<Stock_transaction>
){}

async UpdateStock_Info (productId:number, Total_pc_pkg_litre:string,reasons:string, type_Enum:string){
    //update the  stock table
     
}

}