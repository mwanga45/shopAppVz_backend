import { IsNumber, IsString } from 'class-validator';
import { User } from 'src/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { paymentstatus } from 'src/type/type.interface';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class Debt {
  @Column()
  @IsNumber()
  Total_pc_pkg_litre: number;

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

  @Column()
  percentage_discount: string;

  @Column({ default: paymentstatus.Paid })
  paymentstatus: paymentstatus;

  @ManyToOne(() => User, (user) => user.debts)
  @JoinColumn({ name: 'userId' })
  user: User;
}
