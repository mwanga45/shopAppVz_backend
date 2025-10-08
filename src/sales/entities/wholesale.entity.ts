import { Entity ,Column} from "typeorm";
import { baseEntity } from "src/common/base.entity";
import { IsNumber, IsString } from "class-validator";
import { Product } from "src/product/entities/product.entity";
import { ManyToOne, JoinColumn } from "typeorm";
import { User } from "src/entities/user.entity";
import { paymentstatus } from "src/type/type.interface";

@Entity()
export class WholeSales extends baseEntity{
  @Column()
  @IsNumber()
  Total_pc_pkg_litre:number

  @Column()
  @IsString()
  Revenue:number

  @Column()
  @IsString()
  Net_profit:number

  @Column()
  Expected_Profit:number

  @Column('decimal', {precision:10, scale:4})
  profit_deviation:number

  @Column()
  percentage_deviation:number

  @Column('decimal', {precision:10, scale:4 , default:0})
  percentage_discount:number

  @Column({default:paymentstatus.Paid})
  paymentstatus:paymentstatus

  @ManyToOne(()=> User,(user)=>user.wholesales)
  @JoinColumn({name:'userId'})
  user:User;

  @ManyToOne(() => Product, (product)=> product.wholesales)
  @JoinColumn({ name: 'productId' })
  product: Product;

}
