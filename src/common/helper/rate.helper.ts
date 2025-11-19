import { Injectable, Res } from "@nestjs/common";
import { ResponseType } from "src/type/type.interface";

@Injectable()
export class BusinessGrowthLogic {
  RateCalculation (firstdata:number, secondData:number):ResponseType<any>{
   let rate_status:string
   let rate:number
   let Result:any

   if(firstdata > secondData){
    rate_status = 'up'
    rate = (firstdata - secondData)/(firstdata + secondData) * 100
    Result = {rate, rate_status}
    return Result
   }else if(secondData - firstdata){
    rate_status = 'down'
    rate = (secondData - firstdata)/(secondData + firstdata) * 100
    Result
    return Result 
   }else{
    rate = 0
    rate_status ='equal'
    Result ={rate, rate_status}
    return Result
   }
  
  }
}