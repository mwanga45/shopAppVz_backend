import { Entity ,Column} from "typeorm";
import { baseEntity } from "src/common/base.entity";
import { IsString } from "class-validator";
import { Product } from "src/product/entities/product.entity";
import { ManyToOne, JoinColumn } from "typeorm";

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

}
export class RetailSales extends baseEntity{
    @Column()
    @IsString()
    Total_litre_kg:string

    @Column()
    @IsString()
    TotalGenereted:string
    TotalProfit:string

    @Column({ nullable: true })
    productId: string;

    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: 'productId' })
    product: Product;

}

