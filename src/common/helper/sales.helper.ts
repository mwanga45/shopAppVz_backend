import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WholeSales } from "src/sales/entities/wholesale.entity";
import { Product_discount } from "src/product/entities/discount.entity";
import { Repository } from "typeorm";

@Injectable()
export class  SalesHelper {
  constructor( 
    @InjectRepository(Product_discount)
    private readonly dscountRepo:Repository<Product_discount>,
    @InjectRepository(WholeSales)
    private readonly wholeRepo:Repository<WholeSales>
  ){}
  CalculateProfit_Wholesales(purchase_price:string | null,wholesales_price:string | null,total_litre?:string,total_pc?:string):number{
    const PucPrice = Number(purchase_price?? 0)
    const Wholesales = Number(wholesales_price ?? 0)
    const litre = Number(total_litre ?? 0)
    const Pc = Number(total_pc ?? 0)
    if(litre === 0){
        const profictExpectedPerEachPc = Wholesales - PucPrice
        const Actual_Profit = profictExpectedPerEachPc * Pc
        return Actual_Profit
    }
    const profitPerEachlitre = Wholesales - PucPrice
    const Actual_Profit  = profitPerEachlitre * litre
    return Actual_Profit
  }
  calculateExpectedProfit_Wholesales(wholesales_price:string | null,purchase_price:string | null,total_litre?:string,total_pc?:string):number{
    const litre = Number(total_litre ?? 0)
    const Pc  = Number(total_pc ?? 0)
    const Wholesale = Number(wholesales_price ?? 0)
    const PucPrice = Number(purchase_price ?? 0)
     if (litre === 0){
        const ExpectProfitPerEach = Wholesale-PucPrice
        const Expected_profit = Pc * ExpectProfitPerEach
        return Expected_profit
     }
     const ExpectProfitPerEach = Wholesale-PucPrice
     const Expected_profit = litre * ExpectProfitPerEach
     return Expected_profit
  }
  calculeDevition (Expected_profit:number, Actual_Profit:number):{deviation_percentage:number,deviation_profit:number}{
    const  deviation_profit  = Expected_profit - Actual_Profit
    const deviation_percentage = (Actual_Profit/Expected_profit)*100
    return {deviation_percentage,deviation_profit}
    
  }
  async ValidateCutoff (Total_litre_kg:string,wholesales_price:string | null,product_Id:number, purchase_price:string | null):Promise<number[]>{
    const Amount = Number(Total_litre_kg ?? 0)
    const disc_Info = await this.dscountRepo.findOne({
      where:{product_id:product_Id},
    })
    if (!disc_Info){
      throw new NotFoundException("The product is not available")
    }
    if(Amount < disc_Info.Product_startfrom ){
      return [0]
    }
    const wholesale_price =  Number(wholesales_price ?? 0)
    const AfterCutoff =  wholesale_price *(disc_Info.percentageDiscaunt/100) 
    return[AfterCutoff, disc_Info.percentageDiscaunt]
  }
 
}