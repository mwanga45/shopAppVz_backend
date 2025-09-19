import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class dialValidate{
  CheckDialformat(phone_number:string):string{
      const dial_number = phone_number.trim()
      const regex = /^255\d{9}$/;

    if(phone_number.length < 10){
      throw new UnauthorizedException("Phone number is to short")
    }
    if (dial_number.startsWith('0')){
       const number =  phone_number.replace(/^0/,"255")
       return number
    }
   
    if(!regex.test(dial_number)){
        throw new UnauthorizedException("Invalid Phone nuber format")
    }
    
    return dial_number
  }
}
