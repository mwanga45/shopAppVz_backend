import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paymentvia, ResponseType } from 'src/type/type.interface';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Capital } from 'src/entities/capital.entity';
import { CashFlow } from 'src/entities/cashFlow.entity';


@Injectable()
export class BusinessGrowthLogic {
  constructor(
    @InjectRepository(Capital)
    private readonly CapitalRepo:Repository<CashFlow>,
    @InjectRepository(CashFlow)
    private readonly Cashflow:Repository<Capital>,
    private readonly Datasource:DataSource,

  ){}
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
   async UpdateCapital(manager:EntityManager,paymentVia:paymentvia, Revenue:number ):Promise<ResponseType<any>>{

    const CashFlow = manager.getRepository(
      this.CapitalRepo.target
    )
  const Capital = manager.getRepository(
    this.CapitalRepo.target
  )
    try{
      const Capital_Result = await Capital.findOne({
        where:{},
        order:{id:'DESC'}
      })
      const UpdateCapital = await Capital.update({id:1}, {
        
      })
      const Cashflow_Result = await CashFlow.findOne({
        where:{},
        order:{id:'DESC'}
      })
      return{
        message:"successfuly",
        success:true
      }
    }catch(err){
      return{
        message:`failed to update capital ${err}`,
        success:false


      }
    }
   

  }
}
