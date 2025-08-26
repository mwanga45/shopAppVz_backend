import { Entity, Column } from 'typeorm';
import { baseEntity } from 'src/common/base.entity';

@Entity('users')
export class User extends baseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ select: false })
  password: string;

  @Column({default:"user"})
  role: "user" | "admin";

  @Column({ default: true })
  isActive: boolean;

}
