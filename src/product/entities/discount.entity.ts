import { baseEntity } from "src/common/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Product_discount extends baseEntity{
   @Column()
   percentageDiscaunt:number

   @Column()
   CashDiscount:number

   @Column()
   Product_start_from:number

   @ManyToOne(()=> Product,product =>product.disc )
   @JoinColumn({name:'product_id'})
   product:Product
}