import { baseEntity } from "src/common/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class DailyProfitsummary extends baseEntity{
   @Column()
   total_profit:string

   @Column({default:"0"})
   total_revenue:string
   
}