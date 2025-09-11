import { baseEntity } from "src/common/base.entity";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
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

     @Column()
     wpurchase_price:string
     
     @Column()
     rpurchase_price:string

     @Column()
     wholesales_price:string

     @Column()
     retailsales_price:string
    
}

