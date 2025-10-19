import { Injectable } from '@nestjs/common';
import { CreateSmDto } from './dto/create-sm.dto';
import { UpdateSmDto } from './dto/update-sm.dto';
import { ResponseType , SmsPayload} from 'src/type/type.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  constructor(
    private configservice:ConfigService
  ){}
  async SendSms(createSmDto: CreateSmDto):Promise<ResponseType<any>> {

   const Payload: SmsPayload ={
    sender_id:55,
    sms:createSmDto.sms,
    recipients:[{number:createSmDto.phone_number}],
    schedule:"none"
   }
  const  url  = this.configservice.get<string>('BASE_URL') || ''
  const token = this.configservice.get<string>('SMS_TOKEN')

const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(Payload),
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    },
})
    return{
      message:"successfuly sent",
      success:true
    }
  }

  
}
