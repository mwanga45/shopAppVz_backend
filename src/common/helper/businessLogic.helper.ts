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
    private readonly CapitalRepo: Repository<Capital>,
    @InjectRepository(CashFlow)
    private readonly CashflowRepo: Repository<CashFlow>,
    private readonly Datasource: DataSource,
  ) {}
  RateCalculation(firstData: number, secondData: number): ResponseType<any> {
    let rate_status: string;
    let rate: number;

    if (firstData > secondData) {
      rate_status = 'up';
      rate = ((firstData - secondData) / (secondData || 1)) * 100; // avoid divide by zero
    } else if (firstData < secondData) {
      // <-- FIXED CONDITION
      rate_status = 'down';
      rate = ((secondData - firstData) / (firstData || 1)) * 100;
    } else {
      rate_status = 'equal';
      rate = 0;
    }

    return {
      message: 'successfully returned',
      success: true,
      data: { rate, rate_status },
    };
  }
  async UpdateCapital(
    manager: EntityManager,
    paymentVia: paymentvia,
    Revenue: number,
  ): Promise<ResponseType<any>> {
    let Total_Capital: number;
    let BankCapital: number;
    let OnhandCapital: number;
    let Withdraw:number
    const CashFlow = manager.getRepository(this.CashflowRepo.target);
    const Capital = manager.getRepository(this.CapitalRepo.target);
    try {
      const Capital_Result = await Capital.findOne({
        where:{},
        order: { id: 'DESC' },
        
      });
const pre_TotalCapital = Number(Capital_Result?.Total_Capital ?? 0);
const pre_BankCapital = Number(Capital_Result?.BankCapital ?? 0);
const pre_OnhandCapital = Number(Capital_Result?.OnhandCapital ?? 0);

      
      Total_Capital = pre_TotalCapital + Revenue;
      BankCapital =
        paymentVia === paymentvia.Bank
          ? pre_BankCapital + Revenue
          : pre_BankCapital;
      OnhandCapital =
        paymentVia === paymentvia.Cash
          ? pre_OnhandCapital + Revenue
          : pre_OnhandCapital;

      const UpdateCapital = await Capital.save({
        id: 1,
        Total_Capital: Total_Capital,
        Bank_Capital: BankCapital,
        OnHand_Capital: OnhandCapital,
      });

      const Cashflow_Result = await CashFlow.findOne({
        where: {},
        order: { id: 'DESC' },
      });
        Withdraw = Cashflow_Result?.Withdraw ? Cashflow_Result.Withdraw : 0
        const InsertCashflow =  CashFlow.create({
        Total_Capital:Total_Capital,
        Bank_Capital:BankCapital,
        OnHand_Capital:OnhandCapital,
        servicename:'none',
        Withdraw:Withdraw
      })
      await manager.save(InsertCashflow)
      return {
        message: 'successfuly',
        success: true,
      };
    } catch (err) {
      return {
        message: `failed to update capital ${err}`,
        success: false,
      };
    }
  }
}
