import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyProfitsummary } from 'src/sales/entities/profitsummary.entity';
import { ResponseType } from 'src/type/type.interface';
import { Repository } from 'typeorm';
import { WholeSales } from 'src/sales/entities/wholesale.entity';

@Injectable()
export class ProfitDevService {
  constructor(
    @InjectRepository(DailyProfitsummary)
    private readonly ProfitsummaryRepo: Repository<DailyProfitsummary>,
    @InjectRepository(WholeSales)
    private readonly WholesalesRepo:Repository<WholeSales>
  ) {}

  async AdminAnalysis(): Promise<ResponseType<any>> {
    const now = new Date();
    const dateOfToday = now.toISOString().split('T')[0];
    const yesterday  = new Date(now)
    yesterday.setDate(now.getDate()-1)
    const dateofyesterday = yesterday.toISOString().split('T')[0]
    const profit = await this.ProfitsummaryRepo.createQueryBuilder('d')
      .select('d.total_profit')
      .orderBy('d.total_profit', 'DESC')
      .where('DATE(d.CreatedAt) = :dateofyesterday', {dateofyesterday})
      .limit(2)
      .getRawMany();

    return {
      message: 'successly returned',
      success: true,
      data: profit
    };
  }
}
