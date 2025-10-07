import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSaleDto, SalesResponseDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { WholeSales } from './entities/wholesale.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { RetailSales } from './entities/retailsale.entity';
import { Product_discount } from 'src/product/entities/discount.entity';
import { ResponseType } from 'src/type/type.interface';
import { StockStatus } from 'src/type/type.interface';
import { DeviationInput } from 'src/type/type.interface';


@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Product) private readonly ProductRepository:Repository<Product>,
    @InjectRepository(WholeSales) private readonly WholesalesRepository:Repository<WholeSales>,
    @InjectRepository(RetailSales) private readonly RetailsalesRepository:Repository<RetailSales>,
    @InjectRepository(Stock) private readonly Stockrepo:Repository<Stock>,
    @InjectRepository(Product_discount) private  readonly ProductDiscrepo:Repository<Product_discount>

  ){}

   StockCheck = async(id:number,productAmount:number):Promise<ResponseType<any>>=>{
    const FindStock = await this.Stockrepo.createQueryBuilder('s')
    .leftJoin('s.product', 'p')
    .select('s.Total_stock', 'totalstock')
    .where('p.id = :id', {id})
    .getRawOne()
      if(!FindStock){
        return{
          message:"No such product",
          success:false
        }
      }
      if(FindStock.totalstock < productAmount){
       const product_status  = StockStatus.NotEnough
        return{
          message:"Not enough product",
          success:true,
          data:{...FindStock, product_status}
          
        }
      }
    const product_status = StockStatus.Enough
     return{
      message:"sucessfuly  return",
      success:true,
      data:{...FindStock, product_status }
     }
  }
  CheckDiscountCalculate = async (productId:number,productAmount:number):Promise<ResponseType<any>> =>{
    const checkDisc =  await this.ProductDiscrepo.createQueryBuilder('d')
    .leftJoin('d.product', 'p')
    .select('d.percentageDiscaunt', 'percentageDiscaunt')
    .addSelect('d.CashDiscount','CashDiscount')
    .addSelect('d.Product_start_from', 'start_from') 
    .where('p.id = :productId', {productId})
    .groupBy('p.id')
    .addGroupBy('d.percentageDiscaunt')
    .addGroupBy('d.Product_start_from') 
    .addGroupBy('d.CashDiscount')
    .addGroupBy('d.id')
    .getRawMany()

    if(!checkDisc){
      return{
        message:"Failed to check  check discount info",
        success:true
      }
    }
    let matchDiscount = null
    if(checkDisc.length === 0){
      return{
        message:"Product has no  discount",
        success:true,
        data:matchDiscount
      }
    }
    
    let discountAmount:any
    const SortDisc = checkDisc.sort((a,b)=> a.start_from - b.start_from)
    for(let i = 0; i < SortDisc.length; i++){
      let currentDisc = SortDisc[i].start_from
      
      let nextDIsc = SortDisc[i +1]?SortDisc[i + 1].start_from: null
      
      if(productAmount >= currentDisc  && (!nextDIsc ||productAmount < nextDIsc )){
        matchDiscount = currentDisc;
        const filter_discont  = SortDisc.filter((item)=> item.start_from === matchDiscount)
     return{
        message:"Successfuly find discount ",
        success:true,
        data:{filter_discont}
      }
      }
    }
    
    return{
      message:"Successfuly",
      success:true,
      data:SortDisc
      
    }
  }

 
  CalculateDeviation = async( input: DeviationInput):Promise<ResponseType<any>> =>{
     const id = input.id
     const findSale_price = await this.ProductRepository.createQueryBuilder('p')
     .select('p.wholesales_price', 'wholesales_price')
     .addSelect('p.retailsales_price', 'retailsales_price')
     .addSelect('p,rpurchase_price', 'rpurchase_price')
     .addSelect('p.wpurchase_price', 'wpurchase_price')
     .where('p.id = :id',{id})
     .getRawOne()

     if(!findSale_price){
      return{
        message:"No such product",
        success:false
      }
     }

    const actualseling_price =  Number(findSale_price.wholesales_price) ?? Number(findSale_price.retailsales_price)
    const bought_price = findSale_price.wpurchase_price ?? findSale_price.rpurchase_price
    if(input.percentageDisc == null){
    const Exp_profit_pereach = actualseling_price - bought_price
    const Exp_Net_profit = Exp_profit_pereach * input.pnum
    const Net_profit = (input.sales - bought_price)*input.pnum;
    const Profit_deviation = Exp_Net_profit -Net_profit
    const Expect_profit = input.pnum * Exp_profit_pereach
    const Expect_revenue = actualseling_price * input.pnum
    const actual_revenue = input.sales * input.pnum
    const pereach_actual_profit = input.sales - bought_price
    const per_profitdeviation  = Exp_profit_pereach - pereach_actual_profit
    const total_profit = pereach_actual_profit * input.pnum
    const  total_productdeviation = Expect_profit - total_profit
    const  revenue_product =  input.sales * input.pnum 
     const percentageDviation = 100 -((revenue_product * 100  )/Expect_revenue)
    return{
      message:"y",
      success:true,
      data:{per_profitdeviation, total_productdeviation , revenue_product, percentageDviation ,Expect_revenue, Exp_profit_pereach, Exp_Net_profit, Net_profit, Profit_deviation}
    }
    }else{
  const discount = Number(input.percentageDisc);
  const Exp_profit_pereach = (actualseling_price - bought_price) / discount;
  const Expect_profit = input.pnum * Exp_profit_pereach;
  const Expect_revenue = (actualseling_price * input.pnum) / discount;
  const actual_revenue = (input.sales * input.pnum) / discount;

  const pereach_actual_profit = (input.sales - bought_price) / discount;
  const total_profit = pereach_actual_profit * input.pnum;
  const per_profitdeviation = Exp_profit_pereach - pereach_actual_profit;
  const total_productdeviation = Expect_profit - total_profit;
  const revenue_product = Expect_revenue - actual_revenue;

  // ✅ Corrected percentage deviation:
  const percentageDviation =
    ((actual_revenue - Expect_revenue) / Expect_revenue) * 100;
    return{
      message:"",
      success:true,
      data:{per_profitdeviation, total_productdeviation , revenue_product, percentageDviation, actual_revenue}
    }
    } 
 }

 async SaleResponse (dto:SalesResponseDto):Promise<ResponseType<any>>{
  const stock_check =  await this.StockCheck(dto.ProductId,dto.Total_product)
  // if(!stock_check.data.success){
  //   return{
  //     message:"stock fail",
  //     success:false
  //   }
  // }
  const DiscontResult = await this.CheckDiscountCalculate(dto.ProductId, dto.Total_product, )
  // if(!DiscontResult.data.success){
  //   return{
  //     message:"Discount fail",
  //     success:false
  //   }
  // }

const CalculateDeviation = await this.CalculateDeviation({  
  percentageDisc: DiscontResult.data.filter_discont?.[0]?.percentageDiscaunt ?? null,
  id: dto.ProductId,
  sales: dto.Selling_price,
  pnum: dto.Total_product})
  // if(!CalculateDeviation.data.success){
  //   return{
  //     message:"Deviation fail",
  //     success:false
  //   }
  // }
    return{
    message:"successfuly",
    success:true,
    data:{stock_check, DiscontResult, CalculateDeviation}
  }
  
 }

  }
  
