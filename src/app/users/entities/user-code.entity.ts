import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserCode {
  @PrimaryGeneratedColumn()
  code: string;

  constructor() {
    this.code = this.createCode();
  }

  createCode(): string {
    let code = '';

    for (let i = 0; i < 6; i++) {
      code = `${code}${Math.floor(Math.random() * 10)}`;
    }

    return code;
  }
}
