import { Injectable } from '@nestjs/common';
import { CreateSmDto } from './dto/create-sm.dto';
import { ResponseType, SmsPayload } from 'src/type/type.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  constructor(private configService: ConfigService) {}

  async SendSms(createSmDto: CreateSmDto): Promise<ResponseType<any>> {
    const payload: SmsPayload = {
      sender_id: 55,
      sms: createSmDto.sms,
      recipients: [{ number: createSmDto.phone_number }],
      schedule: 'none',
    };

    const baseUrl = this.configService.get<string>('BASE_URL') || '';
    const token = this.configService.get<string>('SMS_TOKEN') || '';
    const url = `${baseUrl}/send-sms`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Parse response body
      const result = await response.json();

      if (!response.ok) {
        return {
          message: result.message || 'Failed to send SMS',
          success: false,
          data: result,
        };
      }

      return {
        message: 'Successfully sent SMS',
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        message: 'Error sending SMS',
        success: false,
        data: error,
      };
    }
  }
}
