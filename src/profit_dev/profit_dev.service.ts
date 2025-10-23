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
      .select('d.total_profit', 'total_profit')
      .orderBy('d.id', 'DESC')
      .where('DATE(d.CreatedAt) <= :dateofyesterday', {dateofyesterday})
      .limit(2)
      .getRawMany();
const yesterdayprofit = profit[0] ? Number(profit[0].total_profit) : null;
const daybeforeyesterday_profit = profit[1] ? Number(profit[1].total_profit) : null;

let findprofit_margin: number | null = null;
if (daybeforeyesterday_profit !== null && yesterdayprofit !== null) {
  if (daybeforeyesterday_profit === 0) {
    findprofit_margin = null;
  } else {
    findprofit_margin = ((yesterdayprofit - daybeforeyesterday_profit) / daybeforeyesterday_profit) * 100;
  }
}

return {
  message: 'successly returned',
  success: true,
  data: {profit, findprofit_margin}
};
}
  
}
