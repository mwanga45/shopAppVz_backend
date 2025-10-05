import { Entity ,Column} from "typeorm";
import { baseEntity } from "src/common/base.entity";
import { IsString } from "class-validator";
import { Product } from "src/product/entities/product.entity";
import { ManyToOne, JoinColumn } from "typeorm";
import { User } from "src/entities/user.entity";

@Entity()
export class WholeSales extends baseEntity{
  @Column()
  @IsString()
  Total_pc_pkg_litre:string

  @Column()
  @IsString()
  Revenue:number

  @Column()
  @IsString()
  Net_profit:number

  @Column()
  Expected_Profit:number

  @Column()
  profit_deviation:number

  @Column()
  percentage_deviation:number

  @Column({default:0})
  percentage_discount:number

  @Column()
  paymentstatus:

  @ManyToOne(()=> User,(user)=>user.wholesales)
  @JoinColumn({name:'userId'})
  user:User;

  @ManyToOne(() => Product, (product)=> product.wholesales)
  @JoinColumn({ name: 'productId' })
  product: Product;

}
