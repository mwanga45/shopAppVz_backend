import { baseEntity } from "src/common/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Capital extends baseEntity{ 
@Column({type:'decimal', precision:15, scale:2})
Total_Capital:number

@Column({type:"decimal", precision:15, scale:2})
BankCapital:number

@Column({type:'decimal', precision:15, scale:2})
OnhandCapital:number
}