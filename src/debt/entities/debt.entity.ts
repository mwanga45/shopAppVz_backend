import { IsDate, IsNumber, IsString } from 'class-validator';
import { baseEntity } from 'src/common/base.entity';
import { User } from 'src/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { paymentstatus } from 'src/type/type.interface';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Debt extends baseEntity {
  @Column('decimal', { precision: 10, scale: 4 })
  Total_pc_pkg_litre: number;

  @Column('decimal', { precision: 10, scale: 4 })
  Revenue: number;

  @Column('decimal', { precision: 10, scale: 4 })
  Net_profit: number;

  @Column('decimal', { precision: 10, scale: 4 })
  Expected_profit: number;

  @Column('decimal', { precision: 10, scale: 4 })
  profit_deviation: number;

  @Column('decimal', { precision: 10, scale: 4 })
  Percentage_deviation: number;
  
  @Column()
  Discount_percentage: string;

  @Column({ default: paymentstatus.Paid })
  paymentstatus: paymentstatus;

  @Column()
  paidmoney: number;

  @Column()
  Debtor_name: string;

  @Column()
  Phone_number: string;

  @Column({type:'varchar', default:"none"})
  location:string 

  @Column({type:'timestamp'})
  PaymentDateAt: Date;

  @ManyToOne(() => Product, (product) => product.debt)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => User, (user) => user.debt)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Debt_track, (track) => track.debt)
  track: Debt_track[];
}

@Entity()
export class Debt_track extends baseEntity {
  @Column()
  paidmoney: number;

  @ManyToOne(() => Debt, (debt) => debt.track)
  @JoinColumn({ name: 'debt_id' })
  debt: Debt;

  @ManyToOne(() => User, (user) => user.track)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
