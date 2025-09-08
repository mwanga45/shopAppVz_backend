import { Entity ,Column} from "typeorm";
import { baseEntity } from "src/common/base.entity";
import { IsString } from "class-validator";
import { Product } from "src/product/entities/product.entity";
import { ManyToOne, JoinColumn } from "typeorm";
import { User } from "src/entities/user.entity";

@Entity()
export class RetailSales extends baseEntity{
    @Column()
    @IsString()
    Total_litre_kg:string

    @Column()
    @IsString()
    TotalGenereted:number
    
    @Column()
    TotalProfit:number;

    @Column()
    productId: number;
    
    @Column()
    userId:number;

    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @ManyToOne(()=> User,{eager:true})
    @JoinColumn({name:'userId'})
    user:User;

}