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
import { DataSource, Repository } from 'typeorm';
import { WholeSales } from 'src/sales/entities/wholesale.entity';
import { RetailSales } from 'src/sales/entities/retailsale.entity';
import { Debt_track } from 'src/debt/entities/debt.entity';
import { Debt } from 'src/debt/entities/debt.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Stock_transaction } from 'src/stock/entities/stock.entity';
import { CashFlow } from 'src/entities/cashFlow.entity';

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
    private readonly Datasource:DataSource
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

    // Calculate THIS WEEK (Sunday to Saturday)
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay()); // Sunday
    thisWeekStart.setHours(0, 0, 0, 0);

    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 6); // Saturday
    thisWeekEnd.setHours(23, 59, 59, 999);

    const toLocalDateKey = (input: Date | string): string => {
      const base =
        input instanceof Date ? new Date(input) : new Date(String(input));
      if (Number.isNaN(base.valueOf())) {
        return '';
      }
      const local = new Date(base.getTime() - base.getTimezoneOffset() * 60000);
      return local.toISOString().split('T')[0];
    };

    const toWeekday = (dateKey: string): string => {
      if (!dateKey) return '';
      const formatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        timeZone: 'UTC',
      });
      return formatter.format(new Date(`${dateKey}T00:00:00Z`));
    };

    // Calculate LAST WEEK (previous Sunday to Saturday)
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7); // Previous Sunday
    lastWeekStart.setHours(0, 0, 0, 0);

    const lastWeekEnd = new Date(lastWeekStart);
    lastWeekEnd.setDate(lastWeekStart.getDate() + 6); // Previous Saturday
    lastWeekEnd.setHours(23, 59, 59, 999);
    const fetchDailySales = async (
      repo: Repository<WholeSales | RetailSales>,
      alias: string,
      start: Date,
      end: Date,
    ) => {
      return repo
        .createQueryBuilder(alias)
        .select(`DATE(${alias}."CreatedAt")`, 'date')
        .addSelect(`SUM(${alias}."Revenue")`, 'revenue')
        .addSelect(`SUM(${alias}."Total_pc_pkg_litre")`, 'quantity')
        .where(`${alias}."CreatedAt" BETWEEN :start AND :end`, { start, end })
        .groupBy(`DATE(${alias}."CreatedAt")`)
        .orderBy(`DATE(${alias}."CreatedAt")`, 'ASC')
        .getRawMany();
    };

    const mergeDailySales = (
      sources: Array<{ date: string; revenue: string; quantity: string }>,
    ): Record<string, LastweeksellInterface> => {
      return sources.reduce((acc, curr) => {
        const datekey = toLocalDateKey(curr.date);
        if (!datekey) return acc;
        if (!acc[datekey]) {
          acc[datekey] = {
            Revenue: 0,
            Quantity: 0,
            Date: datekey,
            day: toWeekday(datekey),
          };
        }
        acc[datekey].Revenue += Number(curr.revenue ?? 0);
        acc[datekey].Quantity += Number(curr.quantity ?? 0);
        return acc;
      }, {} as Record<string, LastweeksellInterface>);
    };

    const fetchProductSales = async (
      repo: Repository<WholeSales | RetailSales>,
      alias: string,
      start: Date,
      end: Date,
    ) => {
      return repo
        .createQueryBuilder(alias)
        .leftJoin(`${alias}.product`, 'p')
        .select('p.product_name', 'product_name')
        .addSelect('p.id', 'product_id')
        .addSelect(`SUM(${alias}."Total_pc_pkg_litre")`, 'quantity')
        .addSelect(`SUM(${alias}."Revenue")`, 'revenue')
        .where(`${alias}."CreatedAt" BETWEEN :start AND :end`, { start, end })
        .groupBy('p.product_name')
        .addGroupBy('p.id')
        .orderBy('p.product_name', 'ASC')
        .getRawMany();
    };

    const mergeProductSales = (
      sources: Array<{
        product_id: string | number;
        product_name: string;
        quantity: string;
        revenue: string;
      }>,
    ) => {
      const map = new Map<
        number,
        { product_id: number; product_name: string; Quantity: number; Revenue: number }
      >();
      for (const item of sources) {
        const product_id = Number(item.product_id);
        if (Number.isNaN(product_id)) continue;
        const product_name = item.product_name;
        const existing =
          map.get(product_id) ??
          {
            product_id,
            product_name,
            Quantity: 0,
            Revenue: 0,
          };
        existing.Quantity += Number(item.quantity ?? 0);
        existing.Revenue += Number(item.revenue ?? 0);
        map.set(product_id, existing);
      }
      return Array.from(map.values());
    };

    const lastWeekWholesale = await fetchDailySales(
      this.WholesalesRepo,
      'w',
      lastWeekStart,
      lastWeekEnd,
    );
    const lastWeekRetail = await fetchDailySales(
      this.Retailrepo,
      'r',
      lastWeekStart,
      lastWeekEnd,
    );

    const summarizedLastweek = mergeDailySales([
      ...lastWeekWholesale,
      ...lastWeekRetail,
    ]);

    const lastWeekWholesaleProducts = await fetchProductSales(
      this.WholesalesRepo,
      'w',
      lastWeekStart,
      lastWeekEnd,
    );
    const lastWeekRetailProducts = await fetchProductSales(
      this.Retailrepo,
      'r',
      lastWeekStart,
      lastWeekEnd,
    );

    const lastweekSellingProduct = mergeProductSales([
      ...lastWeekWholesaleProducts,
      ...lastWeekRetailProducts,
    ]);

    const allData: LastweeksellInterface[] = [];
    for (
      let d = new Date(lastWeekStart);
      d <= lastWeekEnd;
      d.setDate(d.getDate() + 1)
    ) {
      const datestr = toLocalDateKey(d);
      if (summarizedLastweek[datestr]) {
        allData.push(summarizedLastweek[datestr]);
      } else {
        allData.push({
          Revenue: 0,
          Quantity: 0,
          Date: datestr,
          day: toWeekday(datestr),
        });
      }
    }
    const Lastweek: LastweeksellInterface[] = allData;
    const thisWeekWholesale = await fetchDailySales(
      this.WholesalesRepo,
      'w',
      thisWeekStart,
      thisWeekEnd,
    );
    const thisWeekRetail = await fetchDailySales(
      this.Retailrepo,
      'r',
      thisWeekStart,
      thisWeekEnd,
    );

    const SummarizedThisweek = mergeDailySales([
      ...thisWeekWholesale,
      ...thisWeekRetail,
    ]);

    const thisWeekWholesaleProducts = await fetchProductSales(
      this.WholesalesRepo,
      'w',
      thisWeekStart,
      thisWeekEnd,
    );
    const thisWeekRetailProducts = await fetchProductSales(
      this.Retailrepo,
      'r',
      thisWeekStart,
      thisWeekEnd,
    );

    const ThisweekSellingProduct = mergeProductSales([
      ...thisWeekWholesaleProducts,
      ...thisWeekRetailProducts,
    ]);

    const alldataThisweek: LastweeksellInterface[] = [];
    for (
      let d = new Date(thisWeekStart);
      d <= thisWeekEnd;
      d.setDate(d.getDate() + 1)
    ) {
      const datestr = toLocalDateKey(d);
      if (SummarizedThisweek[datestr]) {
        alldataThisweek.push(SummarizedThisweek[datestr]);
      } else {
        alldataThisweek.push({
          Revenue: 0,
          Quantity: 0,
          Date: datestr,
          day: toWeekday(datestr),
        });
      }
    }

    const Thisweek: LastweeksellInterface[] = alldataThisweek;
    const combinewholesalesGraphData = { Thisweek, Lastweek };
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

    const totalRevenueTrend = await this.ProfitsummaryRepo.createQueryBuilder(
      'p',
    )
      .select('DATE(p.CreatedAt)', 'date')
      .addSelect('SUM(CAST(p.total_revenue AS DECIMAL(15,2)))', 'total_revenue')
      .groupBy('DATE(p.CreatedAt)')
      .orderBy('DATE(p.CreatedAt)', 'ASC')
      .getRawMany();

    // Convert each date string into a JS Date object
    const formattedResult = totalRevenueTrend.map((row, index, arr) => {
      const current = Number(row.total_revenue);
      const previous =
        index > 0 ? Number(arr[index - 1].total_revenue) : current;
      const Rate =
        previous === 0
          ? 0
          : Math.abs(
              (Number(current - Number(previous)) / Number(previous)) * 100,
            );
      return {
        date: new Date(row.date).toISOString().split('T')[0],
        rate: Number(Rate.toFixed(2)),
      };
    });

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
        ThisweekSellingProduct,
        combinewholesalesGraphData,
        Lastweek,
        Thisweek,
        formattedResult,
        totalRevenueTrend,
        thisWeekEnd,
        thisWeekStart,
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
      .where('d.paymentstatus != :status', { status: paymentstatus.Paid })
      .getRawMany();
    const CustomerDebt =
      DebtMoney.length > 0
        ? Number(DebtMoney[0].Revenue) - Number(DebtMoney[0].TotalPaid)
        : 0;
    let networth = 0;
    networth = StockWorth - CustomerDebt;
    const cashStored = { MoneyDistribution, onHandCash };

    return {
      message: 'successfuly',
      success: true,
      data: {
        StockWorth,
        Stockdata,
        MoneyDistribution,
        cashStored,
        DebtMoney,
        CustomerDebt,
        networth,
      },
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
