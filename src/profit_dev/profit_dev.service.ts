import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyProfitsummary } from 'src/sales/entities/profitsummary.entity';
import { ResponseType } from 'src/type/type.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ProfitDevService {
    constructor(
        @InjectRepository(DailyProfitsummary)
        private readonly ProfitsummaryRepo:Repository<DailyProfitsummary>
    ){}

    async Profit_trend():Promise<ResponseType<any>>{
        return{
            message:"successly returned",
            success:true
        }
    }
}
