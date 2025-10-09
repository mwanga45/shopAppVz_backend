import { Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { ResponseType } from 'src/type/type.interface';
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

async CreateDept (dto:CreateDebtDto):Promise<ResponseType<any>>{
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
  }
  if(!findproduct){
    return{
      message:"Product is not exist",
      success:false
    }
  }
  return{
    message:"succ",
    success:true

  }
}
}
