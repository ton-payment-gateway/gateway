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

import { ETransactionStatus } from '../../src/transaction/types';
import { Merchant } from './merchant.entity';

@Entity({
  name: 'transactions',
})
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk_transaction_id',
  })
  id: string;

  @Column({
    default: 0,
    type: 'numeric',
    precision: 78,
    scale: 9,
  })
  amount: string;

  @Column({
    default: 0,
    type: 'numeric',
    precision: 78,
    scale: 9,
    name: 'service_fee',
  })
  serviceFee: string;

  @Column('varchar', { nullable: false })
  @Index('uq_transaction_hash', { unique: true })
  hash: string;

  @Column('varchar', { nullable: false, default: '' })
  metadata: string;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_direct_deposit',
  })
  isDirectDeposit: boolean;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'status',
    default: ETransactionStatus.COMPLETED,
  })
  status: ETransactionStatus;

  @Column({
    type: 'integer',
    nullable: false,
    name: 'confirmation_time',
    default: 100,
  })
  confirmationTime!: number;

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

  @ManyToOne(() => Merchant, (merchant) => merchant.transactions)
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;
}
