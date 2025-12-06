import { BusinessService } from "src/entities/businessService.entity";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()

export class ServiceSeeder implements OnModuleInit{
 constructor(
   @InjectRepository(BusinessService)
   private readonly BusinesservRepo:Repository<BusinessService>
 ){}

 async onModuleInit() {
     const check_bank = await  this.BusinesservRepo.exists({where:{service_name:'Bank'}})
     if(!check_bank){
        const create_bank =  this.BusinesservRepo.create({
            service_name:"Bank",
            service_origin:"original",
            icon_name:"FaUniversity"
        })
      await this.BusinesservRepo.save(create_bank)
     }
     const check_withdraw =  await this.BusinesservRepo.exists({where:{service_name:'withdraw'}})
     if(!check_withdraw){
        const create_withdraw = this.BusinesservRepo.create({
            service_name:"withdraw",
            service_origin:"original",
            icon_name:"FaHandHoldingUsd"
        })
        await this.BusinesservRepo.save(create_withdraw)
     }
     return
 }

}