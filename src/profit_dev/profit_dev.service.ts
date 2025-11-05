import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyProfitsummary } from 'src/sales/entities/profitsummary.entity';
import {
  ChangeType,
  LastweeksellInterface,
  paymentstatus,
  RateResult,
  ResponseType,
  TodayRevenue,
} from 'src/type/type.interface';
import { Repository } from 'typeorm';
import { WholeSales } from 'src/sales/entities/wholesale.entity';
import { RetailSales } from 'src/sales/entities/retailsale.entity';
import { Debt_track } from 'src/debt/entities/debt.entity';
import { Debt } from 'src/debt/entities/debt.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Stock_transaction } from 'src/stock/entities/stock.entity';
import { CashFlow } from 'src/entities/cashFlow.entity';
import { AsyncLocalStorage } from 'async_hooks';

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
    @InjectRepository(Debt)
    private readonly DebtRepo: Repository<Debt>,
    @InjectRepository(Stock)
    private readonly Stockrepo: Repository<Stock>,
    @InjectRepository(Stock_transaction)
    private readonly StockTrnasrepo: Repository<Stock_transaction>,
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
  async GraphDataAndPeformanceRate(): Promise<ResponseType<any>> {
    const now = new Date();
    const lastWeekEnd = new Date(now);
    lastWeekEnd.setDate(now.getDate() - now.getDay());
    lastWeekEnd.setHours(0, 0, 0, 0);

    const lastWeekStart = new Date(lastWeekEnd);
    lastWeekStart.setDate(lastWeekEnd.getDate() - 6);
    lastWeekStart.setHours(0, 0, 0, 0);
    const thisWeekEnd = new Date(lastWeekEnd);
    thisWeekEnd.setDate(lastWeekEnd.getDate() + 7);
    thisWeekEnd.setHours(0, 0, 0, 0);
    const lastweekSellingProduct = await this.WholesalesRepo.createQueryBuilder(
      'w',
    )
      .leftJoin('w.product', 'p')
      .select('p.product_name', 'product_name')
      .addSelect('p.id', 'product_id')
      .addSelect('SUM(w.Total_pc_pkg_litre)', 'Quantity')
      .addSelect('DATE(w.CreatedAt)', 'Date')
      .addSelect('SUM(w.Revenue)', 'Revenue')
      .where('w.CreatedAt BETWEEN :start AND :end', {
        start: lastWeekStart.toISOString(),
        end: lastWeekEnd.toISOString(),
      })
      .groupBy('p.product_name')
      .addGroupBy('p.id')
      .addGroupBy('w.CreatedAt')
      .addGroupBy('w.Total_pc_pkg_litre')
      .orderBy('w.CreatedAt', 'ASC')
      .getRawMany();
    const summarized = lastweekSellingProduct.reduce((acc, curr)=>{
      const datekey = new Date(curr.Date).toISOString().split('T')[0]
      if(!acc[datekey]){
        acc[datekey] = {
          Revenue:0,
          Quantity:0,
          Date:datekey,
          day:new Date(datekey).toDateString().slice(0,3)
        }
      }
      acc[datekey].Revenue += Number(curr.Revenue)
      acc[datekey].Quantity += Number(curr.Quantity)
      return acc
    }, {} as Record<string,LastweeksellInterface>)
    const allData:LastweeksellInterface[] = []
    for(let d =new Date(lastWeekStart); d <= lastWeekEnd; d.setDate(d.getDate() +1) ){
      const datestr = d.toISOString().split('T')[0]
      if(summarized[datestr]){
        allData.push(summarized[datestr])
      }else{
        allData.push({
          Revenue:0,
          Quantity:0,
          Date:datestr,
          day:d.toDateString().slice(0,3)
        })
      }
    }
    const Lastweek:LastweeksellInterface[] = allData
    
    const ThisweekSellingProduct = await this.WholesalesRepo.createQueryBuilder(
      'w',
    )
      .leftJoin('w.product', 'p')
      .select('p.product_name', 'product_name')
      .addSelect('p.id', 'product_id')
      .addSelect('SUM(w.Revenue)', 'Revenue')
      .addSelect('SUM(w.Total_pc_pkg_litre)', 'Quantity')
      .addSelect('DATE(w.CreatedAt)', 'Date')
      .where('w.CreatedAt BETWEEN :start AND :end', {
        start: lastWeekEnd.toISOString(),
        end: thisWeekEnd.toISOString(),
      })
      .groupBy('p.product_name')
      .addGroupBy('p.id')
      .addGroupBy('w.CreatedAt')
      .addGroupBy('w.Total_pc_pkg_litre')
      .orderBy('w.CreatedAt', 'ASC')
      .getRawMany();

      const  Thisweek:LastweeksellInterface[] = Object.values(
        ThisweekSellingProduct.reduce((acc, curr)=>{
          if(!acc[curr.Date]){
            acc[curr.Date] ={
              Revenue:0,
              Quantity:0,
              Date:curr.Date,
              day:curr.Date.toDateString().slice(0, 3)
            }
          }
          acc[curr.Date].Revenue += Number(curr.Revenue)
          acc[curr.Date].Quantity += Number(curr.Quantity)
          return acc
        }, {})
      )
    const combinewholesalesGraphData = {Thisweek, Lastweek}
    const StocklastAdd = await this.StockTrnasrepo.createQueryBuilder('s')
      .leftJoin('s.product', 'p')
      .select('s.product_id', 'product_id')
      .addSelect('p.product_name')
      .addSelect('s.new_stock', 'new_stock')
      .where('s.Change_type = :changeType', { changeType: ChangeType.ADD })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('MAX(sub.id)')
          .from('stock_transaction', 'sub')
          .where('sub.product_id = s.product_id')
          .andWhere('sub.CreatedAt < :lastWeekStart', {
            lastWeekStart: lastWeekStart,
          })
          .andWhere('sub.Change_type = :changeType')
          .getQuery();
        return `s.id = ${subQuery}`;
      })
      .setParameter('changeType', ChangeType.ADD)
      .getRawMany();

    const StockRate = lastweekSellingProduct.map((sp) => {
      const stock = StocklastAdd.find((st) => st.product_id === sp.product_id);
      if (!stock) return null;
      const stockBefore = Number(stock.new_stock);
      const total_quantitysold = Number(sp.Quantity);
      const sale_rate = ((total_quantitysold / stockBefore) * 100).toFixed(2);
      return {
        saleRate: sale_rate,
        product_name: sp.product_name,
      };
    });
    const RevenuePrevweek = await this.ProfitsummaryRepo.createQueryBuilder('s')
      .select('s.total_revenue', 'total_revenue')
      .addSelect('s.CreatedAt', 'date')
      .where('s.CreatedAt BETWEEN :start AND :end', {
        start: lastWeekStart,
        end: lastWeekEnd,
      })
      .getRawMany();
    const RevenuethisWeek = await this.ProfitsummaryRepo.createQueryBuilder('s')
      .select('s.total_revenue', 'total_revenue')
      .addSelect('s.CreatedAt', 'date')
      .where('s.CreatedAt > :end', { end: lastWeekEnd })
      .getRawMany();

    const compareRevenue = [RevenuePrevweek, RevenuethisWeek];
    const ProfitvsRevenueEachMonth =
      await this.ProfitsummaryRepo.createQueryBuilder('s')
        .select('EXTRACT(MONTH FROM s.CreatedAt)', 'month')
        .addSelect('EXTRACT(YEAR FROM s.CreatedAt)', 'year')
        .addSelect('SUM(s.total_revenue:: numeric)', 'total_revenue')
        .addSelect('SUM(s.total_profit:: numeric)', 'total_profit')
        .groupBy('EXTRACT(YEAR FROM s.CreatedAt)')
        .addGroupBy('EXTRACT(MONTH FROM s.CreatedAt)')
        .orderBy('EXTRACT(YEAR FROM s.CreatedAt)', 'ASC')
        .addOrderBy('EXTRACT(MONTH FROM s.CreatedAt)', 'ASC')
        .getRawMany();
    return {
      message: 'successfuly returned',
      success: true,
      data: {
        StocklastAdd,
        lastWeekEnd,
        lastWeekStart,
        lastweekSellingProduct,
        StockRate,
        compareRevenue,
        ProfitvsRevenueEachMonth,
        thisWeekEnd,
        ThisweekSellingProduct,
        combinewholesalesGraphData,
        Lastweek,
        Thisweek,
      },
    };
  }
  async Networthcalculate(): Promise<ResponseType<any>> {
    const Stockdata = await this.Stockrepo.createQueryBuilder('cal')
      .leftJoin('cal.product', 'p')
      .select('p.id', 'pid')
      .addSelect('p.rpurchase_price', 'rpurchase_price')
      .addSelect('p.wpurchase_price', 'wpurchase_price')
      .addSelect('cal.Total_stock', 'Total_stock')
      .groupBy('p.id')
      .addGroupBy('cal.Total_stock')
      .getRawMany();

    const StockWorth = Stockdata.reduce((acc, curr) => {
      const price =
        curr.rpurchase_price !== null
          ? Number(curr.rpurchase_price)
          : Number(curr.wpurchase_price ?? 0);
      const Totalstock = Number(curr.Total_stock);
      const stocknetworth = acc + price * Totalstock;
      return stocknetworth;
    }, 0);
    const MoneyDistribution = await this.ProfitsummaryRepo.createQueryBuilder(
      'c',
    )
      .select('c.total_revenue', 'total_revenue')
      .addSelect('c.bankTotal_Revenue', 'bank_revenue')
      .orderBy('c.id', 'DESC')
      .limit(1)
      .getRawOne();
    const onHandCash =
      Number(MoneyDistribution.total_revenue) -
      Number(MoneyDistribution.bank_revenue);
      const DebtMoney = await this.DebtRepo.createQueryBuilder('d')
      .select('SUM(d.Revenue)', 'Revenue')
      .addSelect('SUM(d. paidmoney)', 'TotalPaid')
      .where('d.paymentstatus != :status', {status:paymentstatus.Paid } )
      .getRawMany()
    const CustomerDebt =  DebtMoney.length > 0 ? Number(DebtMoney[0].Revenue)- Number(DebtMoney[0].TotalPaid):0
    let networth = 0
    networth = StockWorth - CustomerDebt
    const cashStored = { MoneyDistribution, onHandCash };

    return {
      message: 'successfuly',
      success: true,
      data: { StockWorth, Stockdata, MoneyDistribution, cashStored, DebtMoney, CustomerDebt, networth },
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
      .limit(1)
      .groupBy('p.product_name')
      .orderBy('SUM(w.Revenue)', 'DESC')
      .getRawMany();

    const leastSoldProduct = await this.WholesalesRepo.createQueryBuilder('w')
      .leftJoin('w.product', 'p')
      .select('p.product_name', 'product_name')
      .addSelect('SUM(w.Total_pc_pkg_litre)', 'total_quantity')
      .addSelect('SUM(w.Revenue)', 'Revenue')
      .where('EXTRACT(MONTH FROM w.CreatedAt) = :month', {
        month: currentMonth,
      })
      .limit(1)
      .andWhere('EXTRACT(YEAR FROM w.CreatedAt) = :year', { year: currentYear })
      .groupBy('p,product_name')
      .orderBy('SUM(w.Revenue)', 'ASC')
      .getRawMany();

    const mostSoldProductRetail = await this.Retailrepo.createQueryBuilder('r')
      .leftJoin('r.product', 'p')
      .select('p.product_name', 'product_name')
      .addSelect('SUM(r.Total_pc_pkg_litre)', 'total_quantity')
      .addSelect('SUM(r.Revenue)', 'Revenue')
      .where('EXTRACT(YEAR FROM r.CreatedAt ) = :year', { year: currentYear })
      .andWhere('EXTRACT(MONTH FROM r.CreatedAt) = :month', {
        month: currentMonth,
      })
      .limit(1)
      .groupBy('p.product_name')
      .addGroupBy('r.CreatedAt')
      .orderBy('SUM(r.Revenue)', 'DESC')
      .getRawMany();

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
      .limit(1)
      .orderBy('SUM(r.Revenue)', 'ASC')
      .groupBy('p.product_name')
      .getRawMany();

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
      .addSelect('r.bankTotal_Revenue', 'bankRevenue')
      .where('DATE(r.CreatedAt) = :today', { today: currentdate })
      .getRawMany();
    const Revenue: TodayRevenue[] = TodayRevenue;

    const Deviation = Revenue.map((item) => {
      return averageRevenue - Number(item.generated_today ?? 0);
    });

    let Percentage_deviation = 0;
    Percentage_deviation =
      averageRevenue === 0
        ? 0
        : (Number(Deviation ?? 0) / averageRevenue) * 100;

    const upcomingDebts = await this.DebtRepo.createQueryBuilder('d')
      .select(['d.Debtor_name AS Debtor_name', 'd.PaymentDateAt AS ReturnDate'])
      .where('d.paymentstatus != :status', { status: 'Paid' })
      .andWhere('d.PaymentDateAt >= :today', { today: currentdate })
      .orderBy('d.PaymentDateAt', 'ASC')
      .limit(7)
      .getRawMany();

    const totalUnpaid = await this.DebtRepo.createQueryBuilder('d')
      .select('SUM(d.Revenue - d.paidmoney)', 'total_unpaid')
      .where('d.paymentstatus != :status', { status: 'Paid' })
      .getRawOne();

    const CombineSold = [mostSoldProduct, mostSoldProductRetail];
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
        Deviation,
        Percentage_deviation,
        totalUnpaid,
        upcomingDebts,
        TodayRevenue,
        CombineSold,
      },
    };
  }
}
