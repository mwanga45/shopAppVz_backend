import { Injectable } from '@nestjs/common';
import { CreateSmDto } from './dto/create-sm.dto';
import { UpdateSmDto } from './dto/update-sm.dto';

@Injectable()
export class SmsService {
  SendSms(createSmDto: CreateSmDto) {
    return 'This action adds a new sm';
  }

  
}
