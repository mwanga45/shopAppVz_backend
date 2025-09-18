import { baseEntity } from "src/common/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Product_discount extends baseEntity{
   @Column()
   product_id:number

   @Column()
   percentageDiscaunt:number

   @Column()
   CashDiscount:number

   @Column()
   Product_start_from:number

   @ManyToOne(()=> Product,{eager:true})
   @JoinColumn({name:'productId'})
   Product:Product
}