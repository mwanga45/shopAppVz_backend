import { baseEntity } from "src/common/base.entity";
import { Product } from "src/product/entities/product.entity";
import { Column } from "typeorm";

export class Stock extends baseEntity {
    @Column({nullable:true})
    product_Id:String
    
    @Column()
    Total_stock:string
 
}
export class Stock_record extends baseEntity{
    @Column({nullable:true})
    Product_Id:string

    @Column()
    Addition_kg_litre_Pc:string
}