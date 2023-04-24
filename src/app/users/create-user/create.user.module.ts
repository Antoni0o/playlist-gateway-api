import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CreateUserService } from './create.user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [CreateUserService],
})
export class CreateUserModule {}
