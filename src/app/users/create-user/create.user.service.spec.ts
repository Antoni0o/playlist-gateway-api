import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserService } from './create.user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { SendGridServiceMock } from './mocks/sendgrid.service.mock';
import { ConfigService } from '@nestjs/config';
import { HttpStatus } from '@nestjs/common';
import { AppError } from '../../../common/errors/AppError';

const user = new User({
  id: 'id',
  name: 'name',
  email: 'email',
  avatarUrl: 'avatarUrl',
  password: 'XXXXXXXX',
  isMailValidated: false,
  createdAt: new Date('01-01-2023'),
  updatedAt: new Date('01-01-2023'),
});

describe('Create User Service', () => {
  let service: CreateUserService;
  let repository: Repository<User>;
  let mail: SendGridService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: SendGridService,
          useClass: SendGridServiceMock,
        },
      ],
    }).compile();

    service = module.get<CreateUserService>(CreateUserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    mail = module.get<SendGridService>(SendGridService);
    config = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  /**
   * should receive user data from request && negation DONE
   * should validate received data && negation DONE
   * should create a code for mail validation DONE
   * should send a mail with the code for validation && negation DONE
   * should verify received code with created code and create an
   * user with mailValidate == false && negation
   * should create user && negation
   */

  describe('validateReceivedData()', () => {
    const createUserDto: CreateUserDto = {
      name: 'name1',
      email: 'email',
      password: 'password1',
    };

    it('should receive user data from request', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      service.validateReceivedData(createUserDto).then((result) => {
        expect(result).toEqual(createUserDto);
      });
    });

    it('should throw an error if receive invalid params', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);

      await expect(
        service.validateReceivedData(createUserDto),
      ).rejects.toThrow();
    });
  });

  describe('createCodeForMailValidation()', () => {
    it('should create a code for mail validation', () => {
      const code = service.createCodeForMailValidation();

      expect(code).toHaveLength(6);
    });
  });

  describe('sendMailValidationCode()', () => {
    it('should send a mail with the code for validation', async () => {
      const code = '123456';
      const email = 'mail@mail.com';

      jest.spyOn(service, 'createCodeForMailValidation').mockReturnValue(code);
      jest.spyOn(mail, 'send').getMockImplementation();

      const result = await service.sendMailValidationCode(email);

      expect(mail.send).toHaveBeenCalledTimes(1);
      expect(result).toEqual(`Mail sent to: ${email}, with code: ${code}`);
    });

    it('should throw an error if mail not sent', async () => {
      const code = '123456';
      const email = 'mail@mail.com';

      jest.spyOn(service, 'createCodeForMailValidation').mockReturnValue(code);
      jest.spyOn(mail, 'send').mockRejectedValue(new Error());

      await expect(service.sendMailValidationCode(email)).rejects.toThrow();
    });
  });

  describe('createUser()', () => {
    it('should create user', async () => {
      const createUserData: CreateUserDto = {
        name: 'name',
        email: 'email',
        password: 'XXXXXXXX',
      };

      jest.spyOn(repository, 'save').mockResolvedValue(user);

      const result = await service.createUser(createUserData);

      expect(result).toEqual(user);
    });

    it('should throw an error if repository cannot create user', async () => {
      const createUserData: CreateUserDto = {
        name: 'name',
        email: 'email',
        password: 'XXXXXXXX',
      };

      jest
        .spyOn(repository, 'save')
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

  // describe('verifyMailValidationCode()', () => {
  //   it('should verify received code with created code', async () => {
  //     const code = '123456';
  //   });
  // });
});
