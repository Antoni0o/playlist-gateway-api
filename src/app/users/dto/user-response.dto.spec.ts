/* eslint-disable @typescript-eslint/no-empty-function */
import { User } from '../entities/user.entity';
import { UserResponseDto } from './user-response.dto';

describe('UserResponseDto', () => {
  it('should create a new instance without password, hashPasswordBeforeInsert and hashPasswordBeforeUpdate fields', () => {
    const user: User = new User({
      name: 'name',
      email: 'email',
      avatarUrl: 'avatarUrl',
      password: 'password',
      createdAt: new Date('01-01-2023'),
      updatedAt: new Date('01-01-2023'),
    });
    const userResponseDto = new UserResponseDto(user);
    expect(userResponseDto).not.toEqual(user);
  });
});
