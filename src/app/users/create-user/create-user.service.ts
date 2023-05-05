import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { AppError } from '../../../common/errors/app.error';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { ConfigService } from '@nestjs/config';
import { UserCode } from '../entities/user-code.entity';

@Injectable()
export class CreateUserService {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  @InjectRepository(User)
  private readonly usersRepository: Repository<User>;

  @InjectRepository(UserCode)
  private readonly userCodesRepository: Repository<UserCode>;

  private readonly logger = new Logger(CreateUserService.name);

  constructor(private readonly mail: SendGridService) {}

  async validateReceivedData(
    createUserData: CreateUserDto,
  ): Promise<CreateUserDto> {
    this.logger.log(`[Validate] - Received UserData: {${createUserData}}`);

    const findUserByEmail = await this.usersRepository.findOneBy({
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

  async sendMailValidationCode(email: string): Promise<string> {
    this.logger.log(`[Send Mail] - Starting to send mail validation code`);
    const user = await this.usersRepository.findOneBy({ email: email });

    if (!user) {
      this.logger.error(`[Send Mail] - User with this e-mail was not found`);
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }

    const userCode: UserCode = new UserCode();

    user.userCode = userCode;

    await this.userCodesRepository.save(userCode);
    await this.usersRepository.save(user);

    try {
      await this.mail.send({
        to: email,
        from: this.config.get<string>('EMAIL_SENDER'),
        subject: 'Validation Code - Playlist Gateway',
        text: `Your validation code is: ${userCode.code}`,
      });
    } catch (e) {
      this.logger.error(`[Send Mail] - Error while sending mail`);
      throw new AppError(
        'Error while sending mail, try again later',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.logger.log(
      `[Send Mail] - Mail validation code sent to ${email} with code: ${userCode.code}`,
    );
    return `Mail sent to: ${email}, with code: ${userCode.code}`;
  }

  async createUser(createUserData: CreateUserDto): Promise<User> {
    this.logger.log(`[Create User] - Starting to create user`);

    const userData = await this.validateReceivedData(createUserData);

    const user = new User();

    Object.assign(user, userData);

    this.sendMailValidationCode(createUserData.email);

    this.logger.log(`[Create User] - User created`);
    return await this.usersRepository.save(user);
  }

  async validateMail(receivedCode: string, userId: string): Promise<User> {
    this.logger.log(
      `[Validate Mail] - Starting to validate mail with code: ${receivedCode}`,
    );
    const user: User[] = await this.usersRepository.find({
      where: { id: userId },
      relations: { userCode: true },
    });

    if (!user) {
      this.logger.error(`[Validate Mail] - User not found`);
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(user, { mailValidate: true });

    if (user[0].userCode.code === receivedCode) {
      this.logger.log(
        `[Validate Mail] - Mail validated, user with id: ${userId}`,
      );
      await this.userCodesRepository.delete(user[0].userCode.code);
      return await this.usersRepository.save(user[0]);
    }

    this.logger.error(
      `[Validate Mail] - Error while validating mail, expected code: [${user[0].userCode.code}] received code: [${receivedCode}]`,
    );
    throw new AppError(
      'Error while validating mail, wrong code!',
      HttpStatus.BAD_REQUEST,
    );
  }
}
