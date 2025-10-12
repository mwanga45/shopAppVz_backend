import { baseEntity } from "src/common/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Order extends baseEntity {
    @Column()
    userId:string

    @Column()
    product_name:string

    @Column()
    client_name:string

    @Column()
    Order_Description:string
    
    @Column()
    client_phone:string

    @Column({type:"date"})
    OrderDate:string

    @Column({default:"pending"})
    OrderStatus:string


}
