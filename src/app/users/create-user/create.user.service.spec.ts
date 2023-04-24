import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserService } from './create.user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreateUserService>(CreateUserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  /**
   * should receive user data from request && negation
   * should validate received data && negation
   * should create a code for mail validation && negation
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
});
