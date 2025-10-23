import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyProfitsummary } from 'src/sales/entities/profitsummary.entity';
import { ResponseType } from 'src/type/type.interface';
import { Repository } from 'typeorm';
import { WholeSales } from 'src/sales/entities/wholesale.entity';
import { RetailSales } from 'src/sales/entities/retailsale.entity';
import { Debt_track } from 'src/debt/entities/debt.entity';

@Injectable()
export class ProfitDevService {
  constructor(
    @InjectRepository(DailyProfitsummary)
    private readonly ProfitsummaryRepo: Repository<DailyProfitsummary>,
    @InjectRepository(WholeSales)
    private readonly WholesalesRepo: Repository<WholeSales>,
    @InjectRepository(RetailSales)
    private readonly Retailrepo: Repository<RetailSales>,
    @InjectRepository(Debt_track)
    private readonly DebtTrackRepo: Repository<Debt_track>,
  ) {}

  async AdminAnalysis(): Promise<ResponseType<any>> {
    const now = new Date();
    const dateOfToday = now.toISOString().split('T')[0];
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const dateofyesterday = yesterday.toISOString().split('T')[0];
    const profit = await this.ProfitsummaryRepo.createQueryBuilder('d')
      .select('d.total_profit', 'total_profit')
      .orderBy('d.id', 'DESC')
      .where('DATE(d.CreatedAt) <= :dateofyesterday', { dateofyesterday })
      .limit(2)
      .getRawMany();
    const yesterdayprofit = profit[0] ? Number(profit[0].total_profit) : null;
    const daybeforeyesterday_profit = profit[1]
      ? Number(profit[1].total_profit)
      : null;

    let findprofit_margin: number | null = null;
    if (daybeforeyesterday_profit !== null && yesterdayprofit !== null) {
      if (daybeforeyesterday_profit === 0) {
        findprofit_margin = null;
      } else {
        findprofit_margin =
          ((yesterdayprofit - daybeforeyesterday_profit) /
            daybeforeyesterday_profit) *
          100;
      }
    }
    return {
      message: 'successly returned',
      success: true,
      data: { profit, findprofit_margin },
    };
  }
  async DashboardResult(): Promise<ResponseType<any>> {
    const now = new Date();
    const dateOfToday = now.toISOString().split('T')[0];

    const Debt_payment = await this.DebtTrackRepo.createQueryBuilder('t')
      .select('SUM(t.paidmoney)', 'paidmoney')
      .where('DATE(t.CreatedAt) = :dateOfToday', { dateOfToday })
      .getRawMany();

    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const currentday = now.getDate();
    const currentdate = now.toISOString().split('T')[0];
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const dateofyesterday = yesterday.toISOString().split('T')[0];

    const mostSoldProduct = await this.WholesalesRepo.createQueryBuilder('w')
      .leftJoin('w.product', 'p')
      .select('p.product_name', 'product_name')
      .addSelect('SUM(w.Revenue)', 'total_revenue')
      .addSelect('SUM(w.Total_pc_pkg_litre)', 'total_quantity')
      .where('EXTRACT(MONTH FROM w.CreatedAt) = :month', {
        month: currentMonth,
      })
      .andWhere('EXTRACT(YEAR FROM w.CreatedAt) = :year', { year: currentYear })
      .groupBy('p.product_name')
      .orderBy('SUM(w.Revenue)', 'DESC')
      .limit(1)
      .getRawOne();

    const leastSoldProduct = await this.WholesalesRepo.createQueryBuilder('w')
      .leftJoin('w.product', 'p')
      .select('p.product_name', 'product_name')
      .addSelect('SUM(w.Total_pc_pkg_litre)', 'total_quantity')
      .addSelect('SUM(w.Revenue)', 'Revenue')
      .where('EXTRACT(MONTH FROM w.CreatedAt) = :month', {
        month: currentMonth,
      })
      .andWhere('EXTRACT(YEAR FROM w.CreatedAt) = :year', { year: currentYear })
      .groupBy('p,product_name')
      .orderBy('SUM(w.Revenue)', 'ASC')
      .limit(1)
      .getRawOne();

    const mostSoldProductRetail = await this.Retailrepo.createQueryBuilder('r')
      .leftJoin('r.product', 'p')
      .select('p.product_name', 'product_name')
      .addSelect('SUM(r.Total_pc_pkg_litre)', 'total_quantity')
      .addSelect('SUM(r.Revenue)', 'Revenue')
      .where('EXTRACT(YEAR FROM r.CreatedAt ) = :year', { year: currentYear })
      .andWhere('EXTRACT(MONTH FROM r.CreatedAt) = :month', {
        month: currentMonth,
      })
      .groupBy('p.product_name')
      .orderBy('SUM(r.Revenue)', 'DESC')
      .limit(1)
      .getRawOne();

    const leastSoldProductRetails = await this.Retailrepo.createQueryBuilder(
      'r',
    )
      .leftJoin('r.product', 'p')
      .select('p.product_name', 'product_name')
      .addSelect('SUM(r.Revenue)', 'Revenue')
      .addSelect('SUM(r.Total_pc_pkg_litre)', 'total_quantity')
      .where('EXTRACT(YEAR FROM r.CreatedAt) = :year', { year: currentYear })
      .andWhere('EXTRACT(MONTH FROM r.CreatedAt) = :month', {
        month: currentMonth,
      })
      .orderBy('SUM(r.Revenue)', 'ASC')
      .groupBy('p.product_name')
      .limit(1)
      .getRawOne();

    const wholesalesRev_DAY = this.WholesalesRepo.createQueryBuilder('w')
      .select('COALESCE(SUM(w.Revenue), 0)', 'wRevenue')
      .where('EXTRACT(YEAR FROM w.CreatedAt) = :year', { year: currentYear })
      .andWhere('EXTRACT(MONTH FROM w.CreatedAt) = :month', {
        month: currentMonth,
      })
      .andWhere('EXTRACT(DAY FROM w.CreatedAt) = :day', { day: currentday });

    const retailsaleRev_DAY = this.Retailrepo.createQueryBuilder('r')
      .select('COALESCE(SUM(r.Revenue), 0)', 'rRevenue')
      .where('EXTRACT(YEAR FROM r.CreatedAt) = :year', { year: currentYear })
      .andWhere('EXTRACT(MONTH FROM r.CreatedAt) = :month', {
        month: currentMonth,
      })
      .andWhere('EXTRACT(DAY FROM r.CreatedAt) = :day', { day: currentday });

    const Debtpaid_DAY = this.DebtTrackRepo.createQueryBuilder('d')
      .select('COALESCE(SUM(d.paidmoney) , 0)', 'dRevenue')
      .where('EXTRACT(YEAR FROM d.CreatedAt) = :year', { year: currentYear })
      .andWhere('EXTRACT (MONTH FROM d.CreatedAt) = :month', {
        month: currentMonth,
      })
      .andWhere('EXTRACT(DAY FROM d.CreatedAt) = :day', { day: currentday });

    const [wholesalesResult, retailsaleResult, DebtResult] = await Promise.all([
      wholesalesRev_DAY.getRawOne(),
      retailsaleRev_DAY.getRawOne(),
      Debtpaid_DAY.getRawOne(),
    ]);

    const Retailtotalsales = Number(retailsaleResult.rRevenue || 0);
    const Wholetotalsales = Number(wholesalesResult.wRevenue || 0);
    const Debttotalpaid = Number(DebtResult.dRevenue || 0);
    const combineResult = Retailtotalsales + Wholetotalsales + Debttotalpaid;

    const revenues = await this.ProfitsummaryRepo.createQueryBuilder('p')
      .select('p.total_revenue', 'total_revenue')
      .where('p.CreatedAt <= :yest', { yest: yesterday })
      .orderBy('p.CreatedAt', 'DESC')
      .limit(28)
      .getRawMany();

    const totalRevenue = revenues.reduce(
      (sum, r) => sum + Number(r.total_revenue || 0),
      0,
    );
    const averageRevenue =
      revenues.length > 0 ? totalRevenue / revenues.length : 0;
    const TodayRevenue = await this.ProfitsummaryRepo.createQueryBuilder('r')
    .select('r.total_revenue', 'generated_today')
    .where('DATE(r.CreatedAt) = :today', {today:currentdate})
    .getRawOne()

    return {
      message: 'successfuly returned',
      success: true,
      data: {
        totalRevenue,
        averageRevenue,
        Debt_payment,
        mostSoldProduct,
        mostSoldProductRetail,
        leastSoldProduct,
        leastSoldProductRetails,
        combineResult,
        Wholetotalsales,
        Retailtotalsales,
        Debttotalpaid,
        TodayRevenue
      },
    };
  }
}
