import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Address } from './address.entity';
import { ApiKey } from './api-key.entity';
import { Transaction } from './transaction.entity';
import { User } from './user.entity';

@Entity({
  name: 'merchants',
})
export class Merchant extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk_merchant_id',
  })
  id: string;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: true, name: 'webhook_url' })
  webhookUrl: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  address: string;

  @Column({
    type: 'jsonb',
    nullable: false,
  })
  keys: {
    publicKey: string;
    secretKey: string;
    mnemonic: string[];
    walletId: string;
  };

  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId!: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt!: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
  })
  deletedAt!: Date;

  @ManyToOne(() => User, (user) => user.merchants)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => ApiKey, (apiKey) => apiKey.merchant)
  apiKeys: ApiKey[];

  @OneToMany(() => Transaction, (transaction) => transaction.merchant)
  transactions: Transaction[];

  @OneToMany(() => Address, (address) => address.merchant)
  addresses: Address[];
}
