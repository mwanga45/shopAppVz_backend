import { IsNumber, IsString } from "class-validator";
import { baseEntity } from "src/common/base.entity";
import { paymentstatus } from "src/type/type.interface";
import { Column, Entity } from "typeorm";

@Entity()
export class Debt extends baseEntity {
      @Column()
      @IsNumber()
      Total_pc_pkg_litre:number
    
      @Column()
      @IsString()
      Revenue:number
    
      @Column()
      @IsString()
      Net_profit:number
    
      @Column()
      Expected_Profit:number
    
      @Column('decimal', {precision:10, scale:4})
      profit_deviation:number
    
      @Column()
      percentage_deviation:number
    
      @Column()
      percentage_discount:string
    
      @Column({default:paymentstatus.Paid})
      paymentstatus:paymentstatus

      @Column()
      paidmoney:number

      @Column()
      debtname:string

      @Column()
      phone_number:string
}
