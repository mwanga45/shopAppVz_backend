import { baseEntity } from "src/common/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class CashFlow extends baseEntity{
  @Column()
  Bankcash:string
  
  @Column()
  onhandCash:string

  @Column()
  Bankdebt:string
}