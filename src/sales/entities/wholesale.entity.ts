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
  TotalGenerated:string

  @Column()
  @IsString()
  TotalProfit:string

  @Column({ nullable: true })
  productId: string;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

      @ManyToOne(()=> User,{eager:true})
    @JoinColumn({name:'user_id'})
    user:User;

}
