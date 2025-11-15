import { Injectable } from '@nestjs/common';
import { CreateManagementDto } from './dto/create-management.dto';
import { UpdateManagementDto } from './dto/update-management.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Capital } from 'src/entities/capital.entity';
import { CashFlow } from 'src/entities/cashFlow.entity';
import { Repository } from 'typeorm';
import { ResponseType } from 'src/type/type.interface';
import { DataSource } from 'typeorm';
import { capitalTimes } from 'src/type/type.interface';
import { hash } from 'bcryptjs';
import bcrypt from 'node_modules/bcryptjs/umd/types';

@Injectable()
export class ManagementService {
  constructor(
    @InjectRepository(Capital)
    private readonly Capitalrepo: Repository<Capital>,
    @InjectRepository(CashFlow)
    private readonly CashflowRepo: Repository<CashFlow>,
    private readonly Datasource:DataSource
  ) {}
  async CapitalRegistration (dto:CreateManagementDto):Promise<ResponseType<any>>{
   return await this.Datasource.transaction(async (manager)=>{
      try{
      if(dto.registerTime === capitalTimes.Firsttimes){
        const hashedcode = await bcrypt.hash(dto.code, 10) 
        const registeCapital =  manager.create(Capital,{
          Total_Capital:dto.total_capital,
          OnhandCapital:dto.cash_capital,
          BankCapital:dto.Bank_capital,
          code:hashedcode
        })
        await manager.save(registeCapital)
        return{
          message:"successuly register capital",
          success:true
        }
      }
      const findCode = await manager.findOne(Capital,{
        where:{id:1}
      })
      if(!findCode){
       return{
        message:"no data available",
        success:true
       }
      }
      const compare_code = await bcrypt.compare(dto.code, findCode.code)
      if(!compare_code){
        return{
          message:"failed the code not match",
          success:false
        }
      }
       return{
        message:"successfuly",
        success:true
       }
      }catch(err){
        return{
          message:`failed to Register the Capital`,
          success:false
        }
      }
    })
  }
  create(createManagementDto: CreateManagementDto) {
    return 'This action adds a new management';
  }

  findAll() {
    return `This action returns all management`;
  }

  findOne(id: number) {
    return `This action returns a #${id} management`;
  }

  update(id: number, updateManagementDto: UpdateManagementDto) {
    return `This action updates a #${id} management`;
  }

  remove(id: number) {
    return `This action removes a #${id} management`;
  }
}
