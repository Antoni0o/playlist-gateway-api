import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserService } from './create-user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { SendGridServiceMock } from './mocks/sendgrid.service.mock';
import { ConfigService } from '@nestjs/config';
import { HttpStatus } from '@nestjs/common';
import { AppError } from '../../../common/errors/app.error';
import { UserCode } from '../entities/user-code.entity';

jest.mock('../entities/user-code.entity', () => {
  return {
    UserCode: jest.fn().mockImplementation(() => {
      return {
        code: '',
        createCode: jest.fn(),
      };
    }),
  };
});

describe('Create User Service', () => {
  let service: CreateUserService;
  let usersRepository: Repository<User>;
  let userCodesRepository: Repository<UserCode>;
  let mail: SendGridService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let config: ConfigService;
  let user: User;
  let userCode: UserCode;

  beforeAll(() => {
    user = new User({
      id: 'id',
      name: 'name',
      email: 'email',
      avatarUrl: 'avatarUrl',
      password: 'XXXXXXXX',
      isMailValidated: false,
      createdAt: new Date('01-01-2023'),
      updatedAt: new Date('01-01-2023'),
    });

    userCode = new UserCode();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        ConfigService,
        {
          provide: getRepositoryToken(UserCode),
          useValue: {
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: SendGridService,
          useClass: SendGridServiceMock,
        },
      ],
    }).compile();

    service = module.get<CreateUserService>(CreateUserService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userCodesRepository = module.get<Repository<UserCode>>(
      getRepositoryToken(UserCode),
    );
    mail = module.get<SendGridService>(SendGridService);
    config = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersRepository).toBeDefined();
    expect(userCodesRepository).toBeDefined();
  });

  /**
   * should receive user data from request && negation DONE
   * should validate received data && negation DONE
   * should create a code for mail validation DONE
   * should send a mail with the code for validation && negation DONE
   * should verify received code with created code and save the
   * user with {mailValidate: false} && negation DONE
   * should create user && negation DONE
   */

  describe('validateReceivedData()', () => {
    const createUserDto: CreateUserDto = {
      name: 'name1',
      email: 'email',
      password: 'password1',
    };

    it('should receive user data from request', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.validateReceivedData(createUserDto);

      expect(result).toEqual(createUserDto);
    });

    it('should throw an error if receive invalid params', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);

      await expect(
        service.validateReceivedData(createUserDto),
      ).rejects.toThrow();
    });
  });

  describe('sendMailValidationCode()', () => {
    it('should send a mail with the code for validation', async () => {
      const email = 'mail@mail.com';

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(userCodesRepository, 'save').mockResolvedValue(userCode);
      jest.spyOn(mail, 'send').getMockImplementation();

      const result = await service.sendMailValidationCode(email);

      expect(mail.send).toHaveBeenCalledTimes(1);
      expect(result).toContain('Mail sent');
    });

    it('should throw an error if mail not sent', async () => {
      const email = 'mail@mail.com';

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(userCodesRepository, 'save').mockResolvedValue(userCode);
      jest.spyOn(mail, 'send').mockRejectedValue(new Error());

      await expect(service.sendMailValidationCode(email)).rejects.toThrow();
    });

    it('should throw an error if user with received e-mail was not found', async () => {
      const email = 'mail@mail.com';

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.sendMailValidationCode(email)).rejects.toThrow();
    });
  });

  describe('createUser()', () => {
    it('should create user', async () => {
      const code = '123456';
      const createUserData: CreateUserDto = {
        name: 'name',
        email: 'email',
        password: 'XXXXXXXX',
      };

      jest
        .spyOn(service, 'sendMailValidationCode')
        .mockResolvedValue(`Mail sent to: ${user.email}, with code: ${code}`);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(user);

      const result = await service.createUser(createUserData);

      expect(result).toEqual(user);
    });

    it('should throw an error if usersRepository cannot create user', async () => {
      const code = '123456';
      const createUserData: CreateUserDto = {
        name: 'name',
        email: 'email',
        password: 'XXXXXXXX',
      };

      jest
        .spyOn(service, 'sendMailValidationCode')
        .mockResolvedValue(`Mail sent to: ${user.email}, with code: ${code}`);
      jest
        .spyOn(usersRepository, 'save')
        .mockRejectedValueOnce(new QueryFailedError('query', [], 'message'));

      await expect(service.createUser(createUserData)).rejects.toThrow();
    });

    it('should throw an error if user already exists or data is invalid', async () => {
      const createUserData: CreateUserDto = {
        name: '',
        email: '',
        password: '',
      };

      jest
        .spyOn(service, 'validateReceivedData')
        .mockRejectedValue(new AppError('', HttpStatus.BAD_REQUEST));

      await expect(service.createUser(createUserData)).rejects.toThrow();
    });
  });

  describe('validateMail()', () => {
    const validatedUser = new User({
      id: 'id',
      name: 'name',
      email: 'email',
      avatarUrl: 'avatarUrl',
      password: 'XXXXXXXX',
      isMailValidated: true,
      createdAt: new Date('01-01-2023'),
      updatedAt: new Date('01-01-2023'),
    });

    it('should verify received code with created code', async () => {
      const code = userCode.code;

      jest.spyOn(usersRepository, 'find').mockResolvedValue(Array.of(user));
      jest.spyOn(userCodesRepository, 'save').mockResolvedValue(userCode);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(validatedUser);
      jest.spyOn(userCode, 'createCode').mockReturnValue(code);

      const result = await service.validateMail(code, validatedUser.id);

      expect(result).toEqual(validatedUser);
    });

    it('should throw an error if user not found', async () => {
      const code = userCode.code;
      jest.spyOn(usersRepository, 'find').mockResolvedValue(null);

      await expect(
        service.validateMail(code, validatedUser.id),
      ).rejects.toThrow();
    });

    it('should throw an error if code is invalid', async () => {
      const code = '123456';
      jest.spyOn(usersRepository, 'find').mockResolvedValue(Array.of(user));
      jest.spyOn(userCodesRepository, 'save').mockResolvedValue(null);

      await expect(
        service.validateMail(code, validatedUser.id),
      ).rejects.toThrow();
    });
  });
});
