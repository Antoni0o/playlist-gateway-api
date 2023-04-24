import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  it('should validate name field', async () => {
    const createUserDto = new CreateUserDto();
    createUserDto.name = '';

    const errors = await validate(createUserDto);

    expect(errors).toHaveLength(3);
    expect(errors[0].property).toBe('name');
  });

  it('should validate email field', async () => {
    const createUserDto = new CreateUserDto();
    createUserDto.email = 'invalid-email-address';

    const errors = await validate(createUserDto);

    expect(errors).toHaveLength(3);
    expect(errors[1].property).toBe('email');
  });

  it('should validate password field', async () => {
    const createUserDto = new CreateUserDto();
    createUserDto.password = '';

    const errors = await validate(createUserDto);

    expect(errors).toHaveLength(3);
    expect(errors[2].property).toBe('password');
  });

  it('should pass validation with valid fields', async () => {
    const createUserDto = new CreateUserDto();
    createUserDto.name = 'John Doe';
    createUserDto.email = 'johndoe@example.com';
    createUserDto.password = 'my-secret-password';

    const errors = await validate(createUserDto);

    expect(errors).toHaveLength(0);
  });
});
