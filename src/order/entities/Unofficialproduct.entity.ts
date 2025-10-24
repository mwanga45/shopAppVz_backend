import { baseEntity } from "src/common/base.entity";
import { User } from "src/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class UnofficialProduct extends baseEntity{
    @Column()
    Uproduct_name:string

    @Column()
    Uproduct_price:number

    @ManyToOne(()=> User, (user)=> user.unofficialproduct)
    @JoinColumn({name:'userId'})
    user:User

}