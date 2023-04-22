import { SendGridModule } from '@anchan828/nest-sendgrid';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './common/services/typeorm.service';
import { UsersModule } from './app/users/users.module';

@Module({
  imports: [
    SendGridModule.forRoot({
      apikey: process.env.SENDGRID_API_KEY,
    }),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}
