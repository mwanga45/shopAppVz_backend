import { IsNumber, IsString } from "class-validator";
import { baseEntity } from "src/common/base.entity";
import { User } from "src/entities/user.entity";
import { Product } from "src/product/entities/product.entity";
import { paymentstatus } from "src/type/type.interface";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Debt extends baseEntity {
      @Column()
      @IsNumber()
      Total_pc_pkg_litre:number
    
      @Column()
      @IsNumber()
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

      @ManyToOne(()=> Product, (product)=> product.debt)
      @JoinColumn({name:'product_id'})
      product:Product

      @ManyToOne(()=> User, (user) => user.debt)
      @JoinColumn({name:"userId"})
      user:User
}

export class Debt_track extends baseEntity {

}