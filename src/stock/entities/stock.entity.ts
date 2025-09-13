import { baseEntity } from "src/common/base.entity";
import { User } from "src/entities/user.entity";
import { Product } from "src/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
export enum StockType {
    IN = "IN",
    OUT = "OUT"
}
export enum ChangeType {
    ADD = "add",
    REMOVE = "Removed",
    DELETE = "Delete"
}
@Entity()
export class Stock extends baseEntity {
    @Column({nullable:true})
    product_Id:number
    
    @Column()
    product_category:String

    @Column()
    Total_stock:number

  @ManyToOne(()=> Product , (product)=>product.stock)
  @JoinColumn({name:"product_id"})
  product:Product

  @ManyToOne(()=> User,(user) => user.stock)
  @JoinColumn({name:"user_id"})
  user:User
}
@Entity()
export class Stock_transaction extends baseEntity{
    @Column({nullable:true})
    Product_Id:number

    @Column()
    product_category:String

    @Column({type:"enum", enum:ChangeType , default:ChangeType.ADD})
    Change_type:ChangeType
    
    @Column()
    type:"enum"
    type_Enum:StockType

    @Column()
    prev_stock:String

    @Column()
    new_stock:String

    @Column()
    Quantity:string

    @Column()
    Reasons:string
    
    @ManyToOne(()=> Product, (product)=>product.stocktrans)
    @JoinColumn({name:"product_id"})
    product:Product
    @ManyToOne(()=> User, (user)=>user.stocktrans)
    @JoinColumn({name:"user_id"})
    user:User
}