import { Injectable } from "@nestjs/common";

@Injectable()
export class  SalesHelper {
  CalculateProfit_Wholesales(purchase_price:string,wholesales_price:string,total_litre?:string,total_pc?:string):number{
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
  calculateExpectedProfit_Wholesales(wholesales_price:string,purchase_price:string,total_litre?:string,total_pc?:string):number{
    const litre = Number(total_litre ?? 0)
    const Pc  = Number(total_pc ?? 0)
    const Wholesale = Number(wholesales_price)
    const PucPrice = Number(purchase_price)
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
  // ValidateCutoff ()
}