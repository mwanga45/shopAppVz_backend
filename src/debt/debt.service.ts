import { Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { ResponseType } from 'src/type/type.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Debt } from './entities/debt.entity';
import { Debt_track } from './entities/debt.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DebtService {
  constructor(
   @InjectRepository(Debt) private readonly DebtRepo:Repository<Debt>,
   @InjectRepository(Debt_track) private readonly DebtTrackRepo:Repository<Debt_track>

  ){}

async CreateDept ():Promise<ResponseType<any>>{
  
  return{
    message:"succ",
    success:true

  }
}
}
