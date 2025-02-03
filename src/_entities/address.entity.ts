import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Merchant } from './merchant.entity';

@Entity({
  name: 'addresses',
})
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk_address_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  address: string;

  @Column({
    type: 'jsonb',
    default: null,
    nullable: false,
  })
  keys: {
    publicKey: string;
    secretKey: string;
    mnemonic: string[];
    walletId: string;
  };

  @Column('varchar', { nullable: false, default: '' })
  metadata: string;

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

  @ManyToOne(() => Merchant, (merchant) => merchant.addresses)
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;
}
