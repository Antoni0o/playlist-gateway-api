import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserService } from './create.user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { SendGridServiceMock } from './mocks/sendgrid.service.mock';
import { ConfigService } from '@nestjs/config';

const user = new User({
  id: 'id',
  avatarUrl: 'avatarUrl',
  name: 'name',
  email: 'email',
  password: 'password',
  createdAt: new Date('01-01-2023'),
  updatedAt: new Date('01-01-2023'),
});

describe('Create User Service', () => {
  let service: CreateUserService;
  let repository: Repository<User>;
  let mail: SendGridService;
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
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
   * should send a mail with the code for validation && negation
   * should verify received code with created code && negation
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
});
