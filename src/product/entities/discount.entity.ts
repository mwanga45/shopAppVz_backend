import { baseEntity } from "src/common/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Product } from "./product.entity";
import { User } from "src/entities/user.entity";

@Entity()
export class Product_discount extends baseEntity{
   @Column('decimal', {precision:10, scale:4})
   percentageDiscaunt:number

   @Column()
   CashDiscount:number

   @Column()
   Product_start_from:number

   @ManyToOne(()=> Product,product =>product.disc )
   @JoinColumn({name:'product_id'})
   product:Product

   @ManyToOne(()=> User, user => user.disc)
   @JoinColumn({name:"user_id"})
   user:User

}