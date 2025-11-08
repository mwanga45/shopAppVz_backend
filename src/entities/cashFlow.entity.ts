import { baseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class CashFlow extends baseEntity {
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  Total_Capital: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  Bank_Capital: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  OnHand_Capital: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  bankDebt: number;

  @Column({type:"decimal", precision:15, scale:1})
  Withdraw:number;

}

