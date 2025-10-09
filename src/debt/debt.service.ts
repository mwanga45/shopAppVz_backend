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

@Injectable()
export class DebtService {
  constructor(
   @InjectRepository(Debt) private readonly DebtRepo:Repository<Debt>,
   @InjectRepository(Debt_track) private readonly DebtTrackRepo:Repository<Debt_track>,
   @InjectRepository(Product) private readonly ProductRepo:Repository<Product>,
   private readonly dialservecheck:dialValidate
  ){}

async CreateDept (dto:CreateDebtDto):Promise<ResponseType<any>>{
  const findproduct  = await this.ProductRepo.findOne({
    where:{id:dto.ProductId}
  })
  const isValidPh_number = this.dialservecheck.CheckDialformat(dto.Phone_number)
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
