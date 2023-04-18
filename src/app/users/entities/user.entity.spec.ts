import { User } from './user.entity';
import { hashSync } from 'bcrypt';
import { v4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  hashSync: jest.fn(),
}));

describe('User Entity', () => {
  const user = new User({
    id: 'id',
    avatarUrl: 'avatarUrl',
    name: 'name',
    email: 'email',
    password: 'password',
    createdAt: new Date('01-01-2023'),
    updatedAt: new Date('01-01-2023'),
  });

  it('should have an id property', () => {
    expect(user).toHaveProperty('id');
  });

  it('should have a name property', () => {
    expect(user).toHaveProperty('name');
  });

  it('should have an avatarUrl propery', () => {
    expect(user).toHaveProperty('avatarUrl');
  });

  it('should have an email property', () => {
    expect(user).toHaveProperty('email');
  });

  it('should have a password property', () => {
    expect(user).toHaveProperty('password');
  });

  it('should have an createdAt property', () => {
    expect(user).toHaveProperty('createdAt');
  });

  it('should have an updatedAt property', () => {
    expect(user).toHaveProperty('updatedAt');
  });

  describe('hashPasswordBeforeUpdate', () => {
    it('should hash the password with bcrypt', async () => {
      const user = new User();
      user.password = 'myPassword';

      (hashSync as jest.Mock).mockReturnValue('hashedPassword');

      user.hashPasswordBeforeUpdate();

      expect(user.password).toBe('hashedPassword');
      expect(hashSync).toHaveBeenCalledWith('myPassword', 8);
    });
  });

  describe('hashPasswordBeforeInsert', () => {
    it('should hash the password with bcrypt', async () => {
      const user = new User();
      user.password = 'myPassword';

      (hashSync as jest.Mock).mockReturnValue('hashedPassword');

      user.hashPasswordBeforeInsert();

      expect(user.password).toBe('hashedPassword');
      expect(hashSync).toHaveBeenCalledWith('myPassword', 8);
    });
  });

  describe('createUuid', () => {
    it('should create a UUID', () => {
      const user = new User();

      (v4 as jest.Mock).mockReturnValue('myUUID');

      user.createUuid();

      expect(user.id).toBe('myUUID');
      expect(v4).toHaveBeenCalled();
    });
  });
});
