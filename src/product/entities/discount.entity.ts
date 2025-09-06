import { baseEntity } from "src/common/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class product_discount extends baseEntity{
   @Column()
   product_id:number

   @Column()
   percentageCutoff:number

   @Column()
   Product_startfrom:number

   @ManyToOne(()=> Product,{eager:true})
   @JoinColumn({name:'productId'})
   Product:Product
}