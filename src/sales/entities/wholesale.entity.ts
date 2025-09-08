import { Entity ,Column} from "typeorm";
import { baseEntity } from "src/common/base.entity";
import { IsString } from "class-validator";
import { Product } from "src/product/entities/product.entity";
import { ManyToOne, JoinColumn } from "typeorm";
import { User } from "src/entities/user.entity";

@Entity()
export class WholeSales extends baseEntity{
  @Column()
  userId :number

  @Column()
  @IsString()
  Total_pc_pkg_litre:string

  @Column()
  @IsString()
  TotalGenerated:number

  @Column()
  @IsString()
  TotalProfit:number

  @Column()
  productId: number;
  
  @Column()
  Epected_Profit:number

  @Column()
  profit_deviation:number

  @Column()
  percentage_deviation:number

  @Column({default:0})
  percentage_cutoff:number

  @ManyToOne(()=> User,{eager:true})
  @JoinColumn({name:'userId'})
  user:User;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'productId' })
  product: Product;
  
 

}
