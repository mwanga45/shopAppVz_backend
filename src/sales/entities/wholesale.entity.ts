import { Entity, Column } from 'typeorm';
import { baseEntity } from 'src/common/base.entity';
import { IsNumber, IsString } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';
import { ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { paymentstatus, paymentvia } from 'src/type/type.interface';

@Entity()
export class WholeSales extends baseEntity {
  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  Total_pc_pkg_litre: number | null;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  Revenue: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  Net_profit: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  Expected_Profit: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  profit_deviation: number;

  @Column('decimal', { precision: 12, scale: 2 })
  percentage_deviation: number;

  @Column()
  percentage_discount: string;

  @Column({ default: paymentstatus.Paid })
  paymentstatus: paymentstatus;

  @Column({ default: paymentvia.Cash })
  payment_via: paymentvia;

  @Column({ default: 'direct' })
  sale_origin: 'direct' | 'debt_payment';


  @ManyToOne(() => User, (user) => user.wholesales)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Product, (product) => product.wholesales)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
