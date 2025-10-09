import { IsString } from "class-validator";
import { baseEntity } from "src/common/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Customer extends baseEntity{
  @Column()
  @IsString()
  customer_name: string

  @Column()
  @IsString()
  phone_number:string
  
  @Column()
  @IsString()
  Location:string 

}