import { User } from '../entities/user.entity';

describe('User Entity', () => {
  it('should be able to create a user', () => {
    const user = User.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });

    expect(user).toBeInstanceOf(User);
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john.doe@example.com');
    expect(user.password).toBe('password123');
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('should return a JSON representation without password', () => {
    const user = User.create({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'securepassword',
    });

    const userJson = user.toJSON();

    expect(userJson).toEqual({
      id: user.id,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    expect(userJson).not.toHaveProperty('password');
  });
});
