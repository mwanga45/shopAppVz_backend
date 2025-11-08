import { baseEntity } from "src/common/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class BusinessService extends baseEntity{
    @Column()
    service_name:string
    
    @Column()
    icon_name:string
    
}