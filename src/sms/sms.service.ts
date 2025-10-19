import { Injectable } from '@nestjs/common';
import { CreateSmDto } from './dto/create-sm.dto';
import { UpdateSmDto } from './dto/update-sm.dto';
import { ResponseType , SmsPayload} from 'src/type/type.interface';

@Injectable()
export class SmsService {
  async SendSms(createSmDto: CreateSmDto):Promise<ResponseType<any>> {

   const Payload: SmsPayload ={
    sender_id:55,
    sms:createSmDto.sms,
    recipients:[{number:createSmDto.phone_number}],
    schedule:"none"

   }
    return{
      message:"successfuly sent",
      success:true
    }
  }

  
}
