import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSaleDto, SalesResponseDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { WholeSales } from './entities/wholesale.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { RetailSales } from './entities/retailsale.entity';
import { Product_discount } from 'src/product/entities/discount.entity';
import { ChangeType, override, ResponseType } from 'src/type/type.interface';
import { StockStatus } from 'src/type/type.interface';
import { DeviationInput } from 'src/type/type.interface';
import { category } from 'src/type/type.interface';
import { StockService } from 'src/stock/stock.service';
import { Stock } from 'src/stock/entities/stock.entity';
import { Stock_transaction } from 'src/stock/entities/stock.entity';

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
    private readonly Stockserv: StockService,
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

  async SaleRecord(
    dto: CreateSaleDto,
    userId: any,
  ): Promise<ResponseType<any>> {
    const product_id = dto.ProductId;
    const findProduct_cat = await this.ProductRepository.createQueryBuilder('p')
      .select('p. product_category', 'product_category')
      .where('p.id = :product_id', { product_id })
      .getRawOne();
    if(!findProduct_cat){
      return{
        message:"Product is not exist",
        success:false
      }
    }
    if (findProduct_cat.product_category === category.wholesales) {
      if (
        dto.Stock_status === StockStatus.NotEnough
      ) {
        return {
          message: 'Stock is not Enough  please Add first',
          success: false,
        };
      }
      const saveSale = this.WholesalesRepository.create({
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
      await this.WholesalesRepository.save(saveSale);
      if (!saveSale) {
        return {
          message: 'failed  to create new sales',
          success: false,
        };
      }
      const fetchlastRec = await this.WholesalesRepository.createQueryBuilder(
        'w',
      )
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

      if (!fetchlastRec) {
        return {
          message: 'failed fetched last record',
          success: false,
        };
      }
      const UpdateStockDto: any = {
        product_id: dto.ProductId,
        total_stock: dto.Total_pc_pkg_litre,
        Method: ChangeType.REMOVE,
        Reasons: 'Sold',
        product_category: findProduct_cat.product_category,
      };
      const stockupdate = await this.Stockserv.updateStock(
        UpdateStockDto,
        userId,
      );

      if (!stockupdate.success) {
        return {
          message: stockupdate.message,
          success: false,
        };
      }
      return {
        message: 'Successfuly  return data',
        success: true,
        data: fetchlastRec,
      };
    }
  if(findProduct_cat.product_category === category.retailsales){
    if (
      dto.Stock_status === StockStatus.NotEnough &&
      dto.override === undefined
    ) {
      return {
        message: 'Stock is not Enough  please Add first',
        success: false,
      };
    }
    const saveSale = this.RetailsalesRepository.create({
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
    await this.RetailsalesRepository.save(saveSale);
    if (!saveSale) {
      return {
        message: 'failed  to create new sales',
        success: false,
      };
    }
    const fetchlastRec = await this.RetailsalesRepository.createQueryBuilder('w')
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

    if (!fetchlastRec) {
      return {
        message: 'failed fetched last record',
        success: false,
      };
    }
    const UpdateStockDto: any = {
      product_id: dto.ProductId,
      total_stock: dto.Total_pc_pkg_litre,
      Method: ChangeType.REMOVE,
      Reasons: 'Sold',
      product_category: findProduct_cat.product_category,
    };
    console.log(UpdateStockDto)
    const stockupdate = await this.Stockserv.updateStock(
      UpdateStockDto,
      userId,
    );

    if (!stockupdate.success) {
      return {
        message: stockupdate.message,
        success: false,
      };
    }
    return {
      message: 'Successfuly  return data',
      success: true,
      data: fetchlastRec,
    };
  }
  return{
      message:"Failed",
      success:false
  }
}

}
