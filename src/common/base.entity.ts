import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class baseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  CreatedAt: Date;
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  UpdateAt: Date;

  update<T>(data: T): this & T {
    return Object.assign(this as any, data);
  }
  toDTO<T>(): this & T {
    return this as any;
  }
}
