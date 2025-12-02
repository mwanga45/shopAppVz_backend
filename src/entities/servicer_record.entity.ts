import { baseEntity } from "src/common/base.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";
import { BusinessService } from "./businessService.entity";
import { User } from "./user.entity";

@Entity()
export class serviceRecord extends baseEntity{
@Column({type:'decimal', precision:15, scale:2})
price:number



@ManyToOne(() => BusinessService, (bs) => bs.sr)
@JoinColumn({ name: "bs_id" })
sr: BusinessService;

@ManyToOne(()=> User,(user) => user.services )
@JoinColumn({name:'userId'})
user:User


}