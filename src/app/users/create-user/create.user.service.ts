import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { AppError } from '../../../common/errors/AppError';

@Injectable()
export class CreateUserService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  private readonly logger = new Logger(CreateUserService.name);

  async execute() {
    //to-do
  }

  async validateReceivedData(createUserData: CreateUserDto) {
    this.logger.log(`[Validate] - Received UserData: {${createUserData}}`);

    const findUserByEmail = await this.repository.findOneBy({
      email: createUserData.email,
    });

    if (findUserByEmail) {
      this.logger.error(`[Validate] - Error while validating e-mail`);
      throw new AppError(
        'This e-mail is already in use',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.logger.log(`[Validate] - User validated`);
    return createUserData;
  }
}
