import { UnauthorizedException } from "@nestjs/common";
import { threadId } from "worker_threads";

export class dialValidate{
  CheckDialformat(phone_number:string):any|Error{
      const regex = /^255\d{9}$/;
      if (regex.test(phone_number)){
        throw new UnauthorizedException("Invalid phone number")
      }
    if(phone_number.length < 10){
      throw new UnauthorizedException("Invalid Phone number format")
    }else if(phone_number.startsWith("255")){
        return phone_number
    }   
  }
}
