import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSaleDto, SalesResponseDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { WholeSales } from './entities/wholesale.entity';
import { EntityManager, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { RetailSales } from './entities/retailsale.entity';
import { Product_discount } from 'src/product/entities/discount.entity';
import { ChangeType, override, paymentstatus, ResponseType } from 'src/type/type.interface';
import { StockStatus } from 'src/type/type.interface';
import { DeviationInput } from 'src/type/type.interface';
import { category } from 'src/type/type.interface';
import { StockService } from 'src/stock/stock.service';
import { Stock } from 'src/stock/entities/stock.entity';
import { DataSource } from 'typeorm';
import { SaleSummary, MostProfit } from 'src/type/type.interface';
import { DailyProfitsummary } from './entities/profitsummary.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Product)
    private readonly ProductRepository: Repository<Product>,
    @InjectRepository(WholeSales)
    private readonly WholesalesRepository: Repository<WholeSales>,
    @InjectRepository(RetailSales)
    private readonly RetailsalesRepository: Repository<RetailSales>,
    @InjectRepository(Stock) private readonly Stockrepo: Repository<Stock>,
    @InjectRepository(Product_discount)
    private readonly ProductDiscrepo: Repository<Product_discount>,
    @InjectRepository(DailyProfitsummary)
    private readonly ProfitsummaryRepo: Repository<DailyProfitsummary>,
    private readonly Stockserv: StockService,
    private readonly Datasource: DataSource,
    
  ) {}

  StockCheck = async (
    id: number,
    productAmount: number,
  ): Promise<ResponseType<any>> => {
    const FindStock = await this.Stockrepo.createQueryBuilder('s')
      .leftJoin('s.product', 'p')
      .select('s.Total_stock', 'totalstock')
      .where('p.id = :id', { id })
      .getRawOne();
    if (!FindStock) {
      return {
        message: 'No such product',
        success: false,
      };
    }
    if (FindStock.totalstock < productAmount) {
      const product_status = StockStatus.NotEnough;
      return {
        message: 'Not enough product',
        success: true,
        data: { ...FindStock, product_status },
      };
    }

    const product_status = StockStatus.Enough;
    return {
      message: 'sucessfuly  return',
      success: true,
      data: { ...FindStock, product_status },
    };
  };
  CheckDiscountCalculate = async (
    productId: number,
    productAmount: number,
  ): Promise<ResponseType<any>> => {
    const checkDisc = await this.ProductDiscrepo.createQueryBuilder('d')
      .leftJoin('d.product', 'p')
      .select('d.percentageDiscaunt', 'percentageDiscaunt')
      .addSelect('d.CashDiscount', 'CashDiscount')
      .addSelect('d.Product_start_from', 'start_from')
      .where('p.id = :productId', { productId })
      .groupBy('p.id')
      .addGroupBy('d.percentageDiscaunt')
      .addGroupBy('d.Product_start_from')
      .addGroupBy('d.CashDiscount')
      .addGroupBy('d.id')
      .getRawMany();

    if (!checkDisc) {
      return {
        message: 'Failed to check  check discount info',
        success: true,
      };
    }
    let matchDiscount = null;
    if (checkDisc.length === 0) {
      return {
        message: 'Product has no  discount',
        success: true,
        data: matchDiscount,
      };
    }

    let discountAmount: any;
    const SortDisc = checkDisc.sort((a, b) => a.start_from - b.start_from);
    for (let i = 0; i < SortDisc.length; i++) {
      let currentDisc = SortDisc[i].start_from;

      let nextDIsc = SortDisc[i + 1] ? SortDisc[i + 1].start_from : null;

      if (
        productAmount >= currentDisc &&
        (!nextDIsc || productAmount < nextDIsc)
      ) {
        matchDiscount = currentDisc;
        const filter_discont = SortDisc.filter(
          (item) => item.start_from === matchDiscount,
        );
        return {
          message: 'Successfuly find discount ',
          success: true,
          data: { filter_discont },
        };
      }
    }

    return {
      message: 'Successfuly',
      success: true,
      data: SortDisc,
    };
  };

  CalculateDeviation = async (
    input: DeviationInput,
  ): Promise<ResponseType<any>> => {
    const id = input.id;
    const findSale_price = await this.ProductRepository.createQueryBuilder('p')
      .select('p.wholesales_price', 'wholesales_price')
      .addSelect('p.retailsales_price', 'retailsales_price')
      .addSelect('p.rpurchase_price', 'rpurchase_price')
      .addSelect('p.wpurchase_price', 'wpurchase_price')
      .where('p.id = :id', { id })
      .getRawOne();

    if (!findSale_price) {
      return {
        message: 'No such product',
        success: false,
      };
    }

    const actualseling_price = Number(
      findSale_price.retailsales_price != null &&
        findSale_price.retailsales_price !== ''
        ? findSale_price.retailsales_price
        : findSale_price.wholesales_price,
    );
    const bought_price = Number(
      findSale_price.wpurchase_price != null &&
        findSale_price.wpurchase_price !== ''
        ? findSale_price.wpurchase_price
        : findSale_price.rpurchase_price,
    );
    if (input.percentageDisc == null) {
      const Exp_profit_pereach = actualseling_price - bought_price;
      const Exp_Net_profit = Exp_profit_pereach * input.pnum;
      const Net_profit = (input.sales - bought_price) * input.pnum;
      const Profit_deviation = Exp_Net_profit - Net_profit;
      const Expect_revenue = actualseling_price * input.pnum;
      const Revenue = input.sales * input.pnum;
      const deviationFromMeanPercent =
        ((actualseling_price - input.sales) / Exp_profit_pereach) * 100;
      return {
        message: 'no',
        success: true,
        data: {
          Revenue,
          deviationFromMeanPercent,
          Expect_revenue,
          Exp_profit_pereach,
          Exp_Net_profit,
          Net_profit,
          Profit_deviation,
        },
      };
    } else {
      if (input.CashDiscount !== null) {
        const Act_sales = actualseling_price - input.CashDiscount;
        const RequestSales_price = input.sales - input.CashDiscount;
        const Exp_profit_pereach =
          actualseling_price - bought_price - input.CashDiscount;
        const Exp_Net_profit = Exp_profit_pereach * input.pnum;
        const Net_profit =
          (input.sales - bought_price - input.CashDiscount) * input.pnum;
        const Profit_deviation = Exp_Net_profit - Net_profit;
        const Expect_revenue =
          (actualseling_price - input.CashDiscount) * input.pnum;
        const Revenue = (input.sales - input.CashDiscount) * input.pnum;
        const deviationFromMeanPercent =
          ((Act_sales - RequestSales_price) / Exp_profit_pereach) * 100;
        return {
          message: 'yes',
          success: true,
          data: {
            Revenue,
            deviationFromMeanPercent,
            Expect_revenue,
            Exp_profit_pereach,
            Exp_Net_profit,
            Net_profit,
            Profit_deviation,
          },
        };
      }
      const Exp_profit_pereach = actualseling_price - bought_price;
      const Exp_Net_profit = Exp_profit_pereach * input.pnum;
      const Net_profit = (input.sales - bought_price) * input.pnum;
      const Profit_deviation = Exp_Net_profit - Net_profit;
      const Expect_revenue = actualseling_price * input.pnum;
      const Revenue = input.sales * input.pnum;
      const deviationFromMeanPercent =
        ((actualseling_price - input.sales) / Exp_profit_pereach) * 100;
      return {
        message: 'yes',
        success: true,
        data: {
          Revenue,
          deviationFromMeanPercent,
          Expect_revenue,
          Exp_profit_pereach,
          Exp_Net_profit,
          Net_profit,
          Profit_deviation,
        },
      };
    }
  };

  async SaleResponse(dto: SalesResponseDto): Promise<ResponseType<any>> {
    const stock_check = await this.StockCheck(dto.ProductId, dto.Total_product);

    const DiscontResult = await this.CheckDiscountCalculate(
      dto.ProductId,
      dto.Total_product,
    );

    const CalculateDeviation = await this.CalculateDeviation({
      percentageDisc:
        DiscontResult?.data?.filter_discont?.[0]?.percentageDiscaunt ?? null,
      CashDiscount:
        DiscontResult?.data?.filter_discont?.[0]?.CashDiscount ?? null,
      id: dto.ProductId,
      sales: dto.Selling_price,
      pnum: dto.Total_product,
    });

    return {
      message: 'successfuly',
      success: true,
      data: { stock_check, DiscontResult, CalculateDeviation },
    };
  }

  async Profitupdatesummary (manager:EntityManager, total_profit:number):Promise<ResponseType<any>>{
    const now = new Date()
    const  dateoftoday = now.toISOString().split('T')[0]
    const profit = String(total_profit)

  const DailyProfitsummaryRepo = manager.getRepository(this.ProfitsummaryRepo.target)
  try{
    const checkdate = await DailyProfitsummaryRepo.findOne({
      where:{ CreatedAt:Raw((alias) => `DATE(${alias}) = '${dateoftoday}'`)}
    })
    if(!checkdate){
      const createProfit  =   DailyProfitsummaryRepo.create({
        total_profit:profit
      })
      await manager.save(createProfit)
      return{
        message:"successfuly create profit column",
        success:true
      }
    }
    const profit_sum = Number(checkdate.total_profit ) + total_profit 
     await DailyProfitsummaryRepo.update({id:checkdate.id }, {total_profit:String(profit_sum)})

     return{
      message:"successfuly update profit table",
      success:true
     }

  }catch(error){
    return{
      message:`failed to make changes profit ${error}`,
      success:false
    }
  }
    return{
      message:"successfuly",
      success:true
    }

  }
  async SaleRecord(
    dto: CreateSaleDto,
    userId: any,
  ): Promise<ResponseType<any>> {
    return await this.Datasource.transaction(async (manager) => {
      try {
        if(dto.paymentstatus !== paymentstatus.Paid && dto.paymentstatus !== paymentstatus.Pending){
          return{
            message:`sales failed since the paid status is ${dto.paymentstatus} `,
            success:false
          }
        }
        const product_id = dto.ProductId;
        const findProduct_cat = await manager
          .createQueryBuilder(Product, 'p')
          .select('p. product_category', 'product_category')
          .where('p.id = :product_id', { product_id })
          .getRawOne();
        if (!findProduct_cat) throw new Error(findProduct_cat.message);

        if (findProduct_cat.product_category === category.wholesales) {
          if (dto.Stock_status === StockStatus.NotEnough)
            throw new Error('Stock is not Enough for  sale');
          const saveSale = manager.create(WholeSales, {
            product: { id: product_id },
            Revenue: dto.Revenue,
            Total_pc_pkg_litre: dto.Total_pc_pkg_litre,
            Net_profit: dto.Net_profit,
            paymentstatus: dto.paymentstatus,
            Expected_Profit: dto.Expecte_profit,
            profit_deviation: dto.profit_deviation,
            percentage_deviation: dto.Percentage_deviation,
            percentage_discount: dto.Discount_percentage,
            user: { id: userId },
          });
          await manager.save(saveSale);
          if (!saveSale) throw new Error('failed to save wholesales data');
          const fetchlastRec = await manager
            .createQueryBuilder(WholeSales, 'w')
            .leftJoin('w.product', 'p')
            .select([
              'w.Revenue',
              'w.Total_pc_pkg_litre',
              'w.Net_profit',
              'w.paymentstatus',
              'w.Expected_Profit',
              'w.profit_deviation',
              'w.percentage_deviation',
              'w.percentage_discount',
              'p.product_name',
            ])
            .orderBy('w.id', 'DESC')
            .limit(1)
            .getOne();

          if (!fetchlastRec) throw new Error('failed to return data');
          const UpdateStockDto: any = {
            product_id: dto.ProductId,
            total_stock: dto.Total_pc_pkg_litre,
            Method: ChangeType.REMOVE,
            Reasons: 'Sold',
            product_category: findProduct_cat.product_category,
          };

          const stockupdate = await this.Stockserv.updateStockTransactional(
            manager,
            UpdateStockDto,
            userId,
          );
          if (!stockupdate.success)
            throw new Error(String(stockupdate.message) || 'Unknown Error');

          return {
            message: 'Successfuly  return data',
            success: true,
            data: fetchlastRec,
          };
        }
        if (findProduct_cat.product_category === category.retailsales) {
          if (dto.Stock_status === StockStatus.NotEnough)
            throw new Error('Stock is not Enough for  sale');

          const saveSale = manager.create(RetailSales, {
            product: { id: product_id },
            Revenue: dto.Revenue,
            Total_pc_pkg_litre: dto.Total_pc_pkg_litre,
            Net_profit: dto.Net_profit,
            paymentstatus: dto.paymentstatus,
            Expected_Profit: dto.Expecte_profit,
            profit_deviation: dto.profit_deviation,
            percentage_deviation: dto.Percentage_deviation,
            percentage_discount: dto.Discount_percentage,
            user: { id: userId },
          });
          await manager.save(saveSale);
          if (!saveSale)
            throw new Error('failed to add sales please try again');
          const fetchlastRec = await manager
            .createQueryBuilder(RetailSales, 'w')
            .leftJoin('w.product', 'p')
            .select([
              'w.Revenue',
              'w.Total_pc_pkg_litre',
              'w.Net_profit',
              'w.paymentstatus',
              'w.Expected_Profit',
              'w.profit_deviation',
              'w.percentage_deviation',
              'w.percentage_discount',
              'p.product_name',
            ])
            .orderBy('w.id', 'DESC')
            .limit(1)
            .getOne();

          if (!fetchlastRec) throw new Error('failed to return  sales');

          const UpdateStockDto: any = {
            product_id: dto.ProductId,
            total_stock: dto.Total_pc_pkg_litre,
            Method: ChangeType.REMOVE,
            Reasons: 'Sold',
            product_category: findProduct_cat.product_category,
          };

          const stockupdate = await this.Stockserv.updateStockTransactional(
            manager,
            UpdateStockDto,
            userId,
          );

          if (!stockupdate.success)
            throw new Error(String(stockupdate.message));
          return {
            message: 'Successfuly  return data',
            success: true,
            data: fetchlastRec,
          };
        }

        return {
          message: 'Failed',
          success: false,
        };
      } catch (error) {
        return {
          message: `transaction failed ${error.message}`,
          success: false,
        };
      }
    });
  }
  async TodaySaleAnalysis(): Promise<ResponseType<any>> {
    return await this.Datasource.transaction(async (manager) => {
      try {
        const date = new Date();
        const Eachsales = await manager
          .createQueryBuilder(WholeSales, 'w')
          .leftJoin('w.product', 'p')
          .leftJoin('w.user', 'u')
          .select([
            'p.product_name',
            'p.id',
            'p.product_category',
            'w.Total_pc_pkg_litre',
            'u.fullname',
            'w.Net_profit',
            'w.Revenue',
          ])
          .where('DATE(w.CreatedAt) = CURRENT_DATE')
          .getRawMany();

        const Salessummary: SaleSummary[] = Object.values(
          Eachsales.reduce((acc, curr) => {
            if (!acc[curr.p_id]) {
              acc[curr.p_id] = {
                p_id: curr.p_id,
                w_Revenue: 0,
                w_Net_profit: 0,
                w_Total_pc_pkg_litre: 0,
                p_product_name: curr.p_product_name,
                product_category: curr.p_product_category,
              };
            }
            acc[curr.p_id].w_Revenue += curr.w_Revenue;
            acc[curr.p_id].w_Net_profit += curr.w_Net_profit;
            acc[curr.p_id].w_Total_pc_pkg_litre += curr.w_Total_pc_pkg_litre;
            return acc;
          }, {}),
        );
        const totalProfit = Salessummary.reduce(
          (acc, curr) => acc + curr.w_Net_profit,
          0,
        );
        const totalRevenue = Salessummary.reduce(
          (acc, curr) => acc + curr.w_Revenue,
          0,
        );
        let ProductMostProfit: MostProfit = {
          product_name: '',
          Profit: 0,
        };
        for (let i = 0; i < Salessummary.length; i++) {
          let curr = Salessummary[i].w_Net_profit;
          if (curr > ProductMostProfit.Profit) {
            ProductMostProfit = {
              product_name: Salessummary[i].p_product_name,
              Profit: Salessummary[i].w_Net_profit,
            };
          }
        }
        const fetchlastRec = await manager
          .createQueryBuilder(RetailSales, 'w')
          .leftJoin('w.product', 'p')
          .select([
            'w.Revenue',
            'w.Total_pc_pkg_litre',
            'w.Net_profit',
            'w.paymentstatus',
            'w.Expected_Profit',
            'w.profit_deviation',
            'w.percentage_deviation',
            'w.percentage_discount',
            'p.product_name',
          ])
          .orderBy('w.id', 'DESC')
          .limit(1)
          .getOne();
        return {
          message: 'successfuly returned',
          success: true,
          data: Eachsales,
          Salessummary,
          totalProfit,
          totalRevenue,
          ProductMostProfit,
          fetchlastRec,
        };
      } catch (error) {
        return {
          message: `Transcation failed: ${error.message}`,
          success: false,
        };
      }
    });
  }

  async SalesRecordToday(): Promise<ResponseType<any>> {
    const Normalsalesretailreturn =
      await this.RetailsalesRepository.createQueryBuilder('r')
        .leftJoin('r.product', 'p')
        .leftJoin('r.user', 'u')
        .select([
          'p.id AS product_id',
          'p.product_name AS product_name',
          'p.product_category AS product_category',
          'u.fullname AS seller',
          'SUM(r.Total_pc_pkg_litre) AS total_quantity',
          'SUM(r.Revenue) AS total_revenue',
          'SUM(r.Net_profit) AS total_profit',
        ])
        .where('DATE(r."CreatedAt") = CURRENT_DATE')
        .groupBy('p.id, p.product_name, p.product_category, u.fullname')
        .getRawMany();

    const Normalsaleswholereturn =
      await this.WholesalesRepository.createQueryBuilder('w')
        .leftJoin('w.product', 'p')
        .leftJoin('w.user', 'u')
        .select([
          'p.id AS product_id',
          'p.product_name AS product_name',
          'p.product_category AS product_category',
          'u.fullname AS seller',
          'SUM(w.Total_pc_pkg_litre) AS total_quantity',
          'SUM(w.Revenue) AS total_revenue',
          'SUM(w.Net_profit) AS total_profit',
        ])
        .where('DATE(w."CreatedAt") = CURRENT_DATE')
        .groupBy('p.id, p.product_name, p.product_category, u.fullname')
        .getRawMany();
    const Retailpending = await this.RetailsalesRepository.createQueryBuilder('r')
        .leftJoin('r.product', 'p')
        .leftJoin('r.user', 'u')
        .select([
          'p.id AS product_id',
          'p.product_name AS product_name',
          'p.product_category AS product_category',
          'u.fullname AS seller',
          'r.paymentstatus AS status',
          'r.Total_pc_pkg_litre AS total_quantity',
          'r.Revenue AS total_revenue',
          'r.Net_profit AS total_profit',
        ])
        .where('DATE(r."CreatedAt") = CURRENT_DATE AND  r.paymentstatus =:status', {status:'pending'})
        // .groupBy('p.id, p.product_name, p.product_category, u.fullname, r.paymentstatus')
        .getRawMany();

        const Wholepending = await this.WholesalesRepository.createQueryBuilder('w')
        .leftJoin('w.product', 'p')
        .leftJoin('w.user', 'u')
        .select([
          'p.id AS product_id',
          'p.product_name AS product_name',
          'p.product_category AS product_category',
          'u.fullname AS seller',
          'w.Total_pc_pkg_litre AS total_quantity',
          'w.paymentstatus AS status',
          'w.Revenue AS total_revenue',
          'w.Net_profit AS total_profit',
        ])
        .where('DATE(w."CreatedAt") = CURRENT_DATE AND w.paymentstatus =:status ', {status:'pending'})
        // .groupBy('p.id, p.product_name, p.product_category, u.fullname, w.paymentstatus')
        .getRawMany();
     const AllcombinedPending = [...Retailpending, ... Wholepending]
     const Allcombined = [...Normalsalesretailreturn,...Normalsaleswholereturn]
     const totalRevenue = Allcombined.reduce((acc, curr)=> acc + Number(curr.total_revenue), 0)
     const totolRetailRevenue  = Normalsalesretailreturn.reduce((acc, curr)=> acc + Number(curr.total_revenue), 0)
     const totalWholeRevenue  = Normalsaleswholereturn.reduce((acc, curr)=> acc + Number(curr.total_revenue),0)
    return {
      message: 'successfully ',
      success: true,
      data: {Normalsaleswholereturn,Normalsalesretailreturn, Allcombined, totalRevenue, totalWholeRevenue, totolRetailRevenue, AllcombinedPending, Retailpending}

    };
  }
}
