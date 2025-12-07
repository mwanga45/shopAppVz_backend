import { baseEntity } from "src/common/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { serviceRecord } from "./servicer_record.entity";

@Entity()
export class BusinessService extends baseEntity{
    @Column()
    service_name:string
    
    @Column()
    icon_name:string

    @Column({default:"created"})
    service_origin:string

   @OneToMany(() => serviceRecord, (record) => record.service)
   records: serviceRecord[];

    
}