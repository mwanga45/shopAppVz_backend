import { Injectable } from "@nestjs/common";

@Injectable()
export class  SalesHelper {
  CalculateProfit_Wholesales(purchase_price:string,wholesales_price:string,total_litre?:string,total_pc?:string):any{
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
  calculateExpectedProfit_Wholesales(wholesales_price:string,)
}