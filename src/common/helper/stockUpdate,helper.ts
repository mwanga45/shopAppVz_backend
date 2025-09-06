import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Stock,Stock_transaction } from "src/stock/entities/stock.entity";
import { Repository } from "typeorm";
import { StockType } from "src/stock/entities/stock.entity";

@Injectable()
export class StockUpdateHelper{
constructor(
    @InjectRepository(Stock) private readonly  stockrepo:Repository<Stock>,
    @InjectRepository(Stock_transaction) private readonly stock_TransRepo:Repository<Stock_transaction>
){}

async UpdateStock_Info (productId:number, Total_pc_pkg_litre:string,reasons:string, type_Enum:StockType,product_category:string){
    //update the  stock table
    const checkproductId = await this.stockrepo.exists({
        where:{product_Id:productId}
    })
    if(!checkproductId){
        throw new  NotFoundException("No stock have been  register here")
    }
    const Amount =  await this.stockrepo.findOne({
        where:{product_Id:productId},
        select:(['Total_stock'])
    })
    const TotalProduct = parseInt(Total_pc_pkg_litre,10)
    const currentStock = Amount ? Number(Amount.Total_stock) : 0;
    const isEnough =  currentStock - TotalProduct
    if(isEnough < 0){
        throw new BadRequestException("Not enough stock")
    }
    const UpdateStock = await this.stockrepo.createQueryBuilder()
    .update()
    .set({Total_stock:() =>`Total_stock + ${TotalProduct}`})
    .where("product_id = :productId", {productId})
    .execute()

    // Add the record to  the stock transaction 
    const  stock_transaction =   this.stock_TransRepo.create({
        Product_Id:productId,
        product_category:product_category,
        type_Enum:type_Enum,
        Quantity:Total_pc_pkg_litre,
        Reasons:reasons
    })
    return this.stock_TransRepo.save(stock_transaction)


}

}