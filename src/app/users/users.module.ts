import { Module } from '@nestjs/common';
import { CreateUserModule } from './create-user/create.user.module';

@Module({
  imports: [CreateUserModule],
  controllers: [],
  providers: [],
})
export class UsersModule {}
