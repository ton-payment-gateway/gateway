import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Merchant } from './merchant.entity';

@Entity({
  name: 'api_keys',
})
export class ApiKey extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk_api_key_id',
  })
  id: string;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: false })
  @Index('uq_api_key_key', { unique: true })
  key: string;

  @Column({
    name: 'merchant_id',
    type: 'uuid',
  })
  merchantId!: string;

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

  @ManyToOne(() => Merchant, (merchant) => merchant.apiKeys)
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;
}
