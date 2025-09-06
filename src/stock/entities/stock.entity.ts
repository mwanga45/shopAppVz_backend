import { baseEntity } from "src/common/base.entity";
import { Product } from "src/product/entities/product.entity";
import { Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
export enum StockType {
    IN = "IN",
    OUT = "OUT"
}
export class Stock extends baseEntity {
    @Column({nullable:true})
    product_Id:number
    
    @Column()
    product_category:String

    @Column()
    Total_stock:number

  @ManyToOne(() => Product, {eager:true})
  @JoinColumn({name:"productId"})
  Product:Product
 
}
export class Stock_transaction extends baseEntity{
    @Column({nullable:true})
    Product_Id:number

    @Column()
    product_category:String

    @Column()
    type:"enum"
    type_Enum:StockType

    @Column()
    Quantity:string

    @Column()
    Reasons:string
    
    @ManyToOne(()=> Product, {eager:true})
    @JoinColumn({name:"ProductId"})
    Product:Product
}