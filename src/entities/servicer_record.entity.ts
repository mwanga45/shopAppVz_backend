import { baseEntity } from "src/common/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class serviceRecord extends baseEntity{
@Column()
service_name:string

@Column()
icon_name:string

@Column({type:'decimal', precision:15, scale:2})
price:number

}