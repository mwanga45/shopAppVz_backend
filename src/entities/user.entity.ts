import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { baseEntity } from 'src/common/base.entity';
import { Product } from 'src/product/entities/product.entity';
import { Stock, Stock_transaction } from 'src/stock/entities/stock.entity';
import { WholeSales } from 'src/sales/entities/wholesale.entity';
import { Product_discount } from 'src/product/entities/discount.entity';
import { Debt, Debt_track } from 'src/debt/entities/debt.entity';

export enum UserType {
  Admin = 'admin',
  User = 'user',
}
@Entity('users')
export class User extends baseEntity {
  @Column()
  fullname: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  phone_number: string;

  @Column()
  nida: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.User })
  role: UserType;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Product, (product) => product.user)
  product: Product[];

  @OneToMany(() => Stock, (stock) => stock.user)
  stock: Stock[];

  @ManyToOne(() => Stock_transaction, (stocktrans) => stocktrans.user)
  stocktrans: Stock_transaction[];

  @OneToMany(() => WholeSales, (wholesales) => wholesales.user)
  wholesales: WholeSales[];

  @OneToMany(() => Product_discount, (disc) => disc.product)
  @JoinColumn({ name: 'user_id' })
  disc: Product_discount[];

  @OneToMany(() => Debt, (debt) => debt.user)
  debt: Debt[];
  @OneToMany(()=> Debt_track, (track)=> track.user)
  track:Debt_track
}
