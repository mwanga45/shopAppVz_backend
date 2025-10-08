import { Entity, Column } from 'typeorm';
import { baseEntity } from 'src/common/base.entity';
import { IsString } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';
import { ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { paymentstatus } from 'src/type/type.interface';
@Entity()
export class RetailSales extends baseEntity {
  @Column()
  @IsString()
  Total_pc_pkg_litre: string;

  @Column()
  @IsString()
  Revenue: number;

  @Column()
  @IsString()
  Net_profit: number;

  @Column()
  Expected_Profit: number;

  @Column('decimal', { precision: 10, scale: 4 })
  profit_deviation: number;

  @Column()
  percentage_deviation: number;

  @Column('decimal', { precision: 10, scale: 4, default: 0 })
  percentage_discount: number;

  @Column({ default: paymentstatus.Paid })
  paymentstatus: paymentstatus;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
