import { Injectable } from '@nestjs/common';
import { ResponseType } from 'src/type/type.interface';

@Injectable()
export class BusinessGrowthLogic {
  RateCalculation(firstData: number, secondData: number): ResponseType<any> {
    let rate_status: string;
    let rate: number;

    if (firstData > secondData) {
      rate_status = 'up';
      rate = ((firstData - secondData) / (secondData || 1)) * 100; // avoid divide by zero
    } else if (firstData < secondData) {  // <-- FIXED CONDITION
      rate_status = 'down';
      rate = ((secondData - firstData) / (firstData || 1)) * 100;
    } else {
      rate_status = 'equal';
      rate = 0;
    }

    return {
      message: "successfully returned",
      success: true,
      data: { rate, rate_status }
    };
  }
}
