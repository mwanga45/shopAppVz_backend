import { baseEntity } from "src/common/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class CashFlow extends baseEntity{
  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  bankCash: number;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  onHandCash: number;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  bankDebt: number;

  @Column({type:'decimal', precision:10, scale:2, default:0})
  Electricity:number

  @Column({type:"decimal", precision:10, scale:2})
  Food:number
}