import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { hashSync } from 'bcrypt';
import { v4 as uuid } from 'uuid';

export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  avatarUrl: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  constructor(user?: Partial<User>) {
    this.id = user?.id;
    this.avatarUrl = user?.avatarUrl;
    this.name = user?.id;
    this.email = user?.email;
    this.password = user?.password;
    this.updatedAt = user?.updatedAt;
    this.createdAt = user?.createdAt;
  }

  @BeforeUpdate()
  hashPasswordBeforeUpdate() {
    this.password = hashSync(this.password, 8);
  }

  @BeforeInsert()
  hashPasswordBeforeInsert() {
    this.password = hashSync(this.password, 8);
  }
  createUuid() {
    this.id = uuid();
  }
}
