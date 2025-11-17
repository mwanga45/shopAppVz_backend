import { baseEntity } from "src/common/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { serviceRecord } from "./servicer_record.entity";

@Entity()
export class BusinessService extends baseEntity{
    @Column()
    service_name:string
    
    @Column()
    icon_name:string

    @OneToMany(()=> serviceRecord,sr => sr.sr)
    sr:serviceRecord[]
    
}