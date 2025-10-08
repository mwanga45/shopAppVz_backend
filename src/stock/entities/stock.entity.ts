import { baseEntity } from "src/common/base.entity";
import { User } from "src/entities/user.entity";
import { Product } from "src/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { ChangeType, StockType } from "src/type/type.interface";
@Entity()
export class Stock extends baseEntity {
    @Column()
    product_category:String

    @Column()
    Total_stock:number

  @OneToOne(()=> Product , (product)=>product.stock)
  @JoinColumn({name:"product_id"})
  product:Product

  @ManyToOne(()=> User,(user) => user.stock)
  @JoinColumn({name:"user_id"})
  user:User
}
@Entity()
export class Stock_transaction extends baseEntity{
    @Column()
    product_category:string

    @Column({type:"enum", enum:ChangeType , default:ChangeType.ADD})
    Change_type:ChangeType
    
    @Column({type:"enum" ,enum:StockType, default:StockType.IN})
    type:"enum"
    type_Enum:StockType

    @Column({default:0})
    prev_stock:number

    @Column()
    new_stock:number

    @Column()
    Quantity:number

    @Column()
    Reasons:string
    
    @ManyToOne(()=> Product, (product)=>product.stocktrans)
    @JoinColumn({name:"product_id"})
    product:Product
    @ManyToOne(()=> User, (user)=>user.stocktrans)
    @JoinColumn({name:"user_id"})
    user:User
}