import { Entity, Column } from 'typeorm';
import { baseEntity } from 'src/common/base.entity';

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

  @Column({default:"user"})
  role: "user" | "admin";

  @Column({ default: true })
  isActive: boolean;

}
