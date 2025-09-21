import { baseEntity } from "src/common/base.entity";
import { User } from "src/entities/user.entity";
import { WholeSales } from "src/sales/entities/wholesale.entity";
import { Stock, Stock_transaction } from "src/stock/entities/stock.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Product_discount } from "./discount.entity";
export enum product_type{
    Liquid= "Liquid",
    Solid = "Solid"
}
export enum  category {
  wholesales ="wholesales",
  retailsales= "retailsales"

}
@Entity()
export class Product extends baseEntity{
     @Column()
     product_name:string

     
     @Column({type:'enum', enum:category})
     product_category: category

     @Column({type:"enum", enum:product_type})
     product_type:product_type

     @Column({nullable:true, type: 'varchar'})
     wpurchase_price:string |null
     
     @Column({nullable:true, type: 'varchar'})
     rpurchase_price:string | null

     @Column({nullable:true, type: 'varchar'})
     wholesales_price:string|null

     @Column({nullable:true, type: 'varchar'})
     retailsales_price:string|null
      
     @ManyToOne(()=> User,user =>user.product)
     @JoinColumn({name:"userId"})
     user:User

     @OneToMany (()=> Stock_transaction, (stocktrans)=> stocktrans.product)
     stocktrans:Stock_transaction[]
    
     @OneToOne(()=> Stock, (stock)=>stock.product)
     stock:Stock[]
     
     @OneToMany(()=> WholeSales, (wholesales)=> wholesales.product)
     @JoinColumn({name:"product_id"})
     wholesales:WholeSales[]

     @OneToMany(()=> Product_discount, disc => disc.product)
     @JoinColumn({name:'product_id'})
     disc:Product_discount[]
}

