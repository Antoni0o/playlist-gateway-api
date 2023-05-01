import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { AppError } from '../../../common/errors/AppError';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CreateUserService {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  @InjectRepository(User)
  private readonly repository: Repository<User>;

  private readonly logger = new Logger(CreateUserService.name);

  constructor(private readonly mail: SendGridService) {}

  async execute() {
    //to-do
  }

  async validateReceivedData(
    createUserData: CreateUserDto,
  ): Promise<CreateUserDto> {
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

  createCodeForMailValidation(): string {
    this.logger.log(`[Create Code] - Starting to create mail validation code`);
    let code = '';

    for (let i = 0; i < 6; i++) {
      code = `${code}${Math.floor(Math.random() * 10)}`;
    }

    this.logger.log(`[Create Code] - Mail validation code created`);
    return code;
  }

  async sendMailValidationCode(email: string): Promise<string> {
    this.logger.log(`[Send Mail] - Starting to send mail validation code`);

    const code = this.createCodeForMailValidation();

    try {
      await this.mail.send({
        to: email,
        from: this.config.get<string>('EMAIL_SENDER'),
        subject: 'Validation Code - Playlist Gateway',
        text: `Your validation code is: ${code}`,
      });
    } catch (e) {
      this.logger.error(`[Send Mail] - Error while sending mail`);
      throw new AppError(
        'Error while sending mail, try again later',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.logger.log(
      `[Send Mail] - Mail validation code sent to ${email} with code: ${code}`,
    );
    return `Mail sent to: ${email}, with code: ${code}`;
  }

  // async saveUser(createUserData: CreateUserDto) {
  //   this.logger.log(`[Save] - Saving user`);

  //   const user = this.repository.create(createUserData);
  //   await this.repository.save(user);

  //   this.logger.log(`[Save] - User saved`);
  //   return user;
  // }
}
