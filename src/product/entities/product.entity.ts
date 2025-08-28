import { baseEntity } from "src/common/base.entity";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Product extends baseEntity{
     @Column()
     product_name:string
     
     @Column()
     product_category:"both" | "wholesales"|"retailsales"|"none"

     @Column()
     product_type:"liquid"|"solid"

     @Column()
     purchase_price:string

     @Column()
     wholesales_price:string

     @Column()
     retailsales_price:string
    
}

