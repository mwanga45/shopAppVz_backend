import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ResponseType } from "src/type/type.interface";

@Injectable()
export class dialValidate{
  CheckDialformat(phone_number:string):ResponseType<any>{
      const dial_number = phone_number.trim()
      const regex = /^255\d{9}$/;

    if(phone_number.length < 10){
      return{
        message:"Phone number is to short",
        success:false
      }
    }
    if(phone_number.startsWith('255')){
      if(phone_number.length > 12){
        return{
          message:"Phone number is to long",
          success:false
        }
      }
    }
    if (dial_number.startsWith('0')){
      if(phone_number.length > 10){
        return{
          message:"phone number is to long",
          success:false
        }
      }
       const number =  phone_number.replace(/^0/,"255")
       return {
        message:"valid phone number",
        success:true,
        data:number
       }
    }
   
    if(!regex.test(dial_number)){
        return{
          message:"Invalid Phone nuber format",
          success:false
        }
    }
    
    return{
      message:"Valid phone number",
      success:true
    } 
  }
}
