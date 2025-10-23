import { baseEntity } from "src/common/base.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";
import { paymentstatus } from "src/type/type.interface";
import { User } from "src/entities/user.entity";

@Entity()
export class Order extends baseEntity {
    @Column()
    product_name:string

    @Column()
    client_name:string

    @Column()
    Order_Description:string

    @Column()
    Payamount:string

    @Column()
    Paidamount:string
    
    @Column()
    client_phone:string

    @Column({type:"date"})
    OrderDate:string

    @Column()
    OrderStatus:paymentstatus

    @ManyToOne(()=> User , (user)=> user.order)
    @JoinColumn({name:"userId"})
    user:User

}
