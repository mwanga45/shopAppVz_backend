import { Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { paymentstatus, ResponseType } from 'src/type/type.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Debt } from './entities/debt.entity';
import { Debt_track } from './entities/debt.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { dialValidate } from 'src/common/helper/phone.helper';
import { Customer } from 'src/entities/customer.entity';

@Injectable()
export class DebtService {
  constructor(
   @InjectRepository(Debt) private readonly DebtRepo:Repository<Debt>,
   @InjectRepository(Debt_track) private readonly DebtTrackRepo:Repository<Debt_track>,
   @InjectRepository(Product) private readonly ProductRepo:Repository<Product>,
   @InjectRepository(Customer) private readonly CustomerRepo:Repository<Customer>,
   private readonly dialservecheck:dialValidate
  ){}

async CreateDept (dto:CreateDebtDto,userId:any):Promise<ResponseType<any>>{
  const findproduct  = await this.ProductRepo.findOne({
    where:{id:dto.ProductId}
  })
  const isValidPh_number = this.dialservecheck.CheckDialformat(dto.Phone_number)
  if(!isValidPh_number.success){
    return{
      message:isValidPh_number.message,
      success:false
    }
  }
  const checkUserphone_exist =  await this.CustomerRepo.findOne({
    where:{phone_number:isValidPh_number.data}
  })

  if(!checkUserphone_exist){
    const addCustomer = this.CustomerRepo.create({
      customer_name:dto.Debtor_name,
      phone_number:isValidPh_number.data,
      Location:dto.location || "none"
    })
    await this.CustomerRepo.save(addCustomer)
  }
  const AddDebt  = this.DebtRepo.create({
    product:{id:dto.ProductId},
    paidmoney:dto.Paid,
    debtname:dto.Debtor_name,
    Net_profit:dto.Net_profit,
    Expected_Profit:dto.Expecte_profit,
    phone_number:dto.Phone_number,
    Revenue:dto.Revenue,
    percentage_deviation:dto.Percentage_deviation,
    profit_deviation:dto.profit_deviation,
    Total_pc_pkg_litre:dto.Total_pc_pkg_litre,
    percentage_discount:dto.Discount_percentage,
    paymentstatus:dto.paymentstatus,
    user:{id:userId}
  })
 const saveDebt = await this.DebtRepo.save(AddDebt)
  if(!saveDebt || !saveDebt.id){
    return{
      message:"FailED to add record please try again",
      success:false
    }
  }
  const Addtrack  =  this.DebtTrackRepo.create({
    paidmoney:dto.Paid,
    debt:{id:saveDebt.id},
    user:{id:userId}
  })

  const savedTrack = await this.DebtTrackRepo.save(Addtrack)
  if(!savedTrack || !savedTrack.id){
    return{
      message:"failed to add debt track",
      success:false

    }
  }
  if(!findproduct){
    return{
      message:"Product is not exist",
      success:false
    }
  }
  return{
    message:"successfuly Add and make followup data",
    success:true

  }
}
async UpdateDebt(dto:UpdateDebtDto, userId:any, id:any):Promise<ResponseType<any>>{
  const findDebt = await this.DebtRepo.findOne({
    where:{id:dto.DebtId}
  })
  if (!findDebt){
    return{
      message:"The Debt is not exist",
      success:false
    }
  }

  if(findDebt.paidmoney === findDebt.Revenue || findDebt.paymentstatus === paymentstatus.Paid){
     if(findDebt.paymentstatus !== paymentstatus.Paid){
       const checkpayementstatus = await this.DebtRepo.update({id:id}, {paymentstatus:paymentstatus.Paid})
       if(!checkpayementstatus.affected || checkpayementstatus.affected === 0){
           return{
            message:"failed to update  paymentstatus",
            success:false
           }
       }
     }
   
    return{
      message:"The debt is already  been completed paid",
      success:false
    }
  }


  return{
    message:'successfuly  update debt',
    success:false

  }
}
}

