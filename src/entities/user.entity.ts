import { Entity, Column, OneToMany } from 'typeorm';
import { baseEntity } from 'src/common/base.entity';
import { Product } from 'src/product/entities/product.entity';
export enum UserType {
  Admin ="admin",
  User="user" 
}
@Entity('users')
export class User extends baseEntity {
  @Column()
  fullname: string;
  
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  phone_number:string

  @Column()
  nida:string

  @Column({ type: 'enum', enum: UserType, default: UserType.User })
  role: UserType;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Product,(product)=>product.user)
  product:Product[]

}
