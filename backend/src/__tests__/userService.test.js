const userService = require('../../services/userService');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 
const mockPrisma = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashedPassword')),
  compare: jest.fn((plain, hashed) => Promise.resolve(plain === 'password')),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mockedToken'),
}));

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user with hashed password', async () => {
    const userData = {
      name: 'Teste Unitário',
      email: 'testeunitario@email.com',
      password: 'password',
      age: 25,
      interestArea: 'Unit Tests',
      location: 'Test Location',
    };
    mockPrisma.user.create.mockResolvedValue(userData);

    const result = await userService.createUser(userData);

    expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: { ...userData, password: 'hashedPassword' },
    });
    expect(result).toEqual(userData);
  });

  it('should get a user by email', async () => {
    const user = { id: 1, email: 'testeunitario@email.com' };
    mockPrisma.user.findUnique.mockResolvedValue(user);

    const result = await userService.getUserByEmail('testeunitario@email.com');

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'testeunitario@email.com' } });
    expect(result).toEqual(user);
  });

  it('should get a user by id', async () => {
    const user = { id: 1, name: 'Teste Unitário' };
    mockPrisma.user.findUnique.mockResolvedValue(user);

    const result = await userService.getUserById(1);

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(user);
  });

  it('should update a user', async () => {
    const userData = { name: 'Nome Atualizado' };
    const updatedUser = { id: 1, ...userData };
    mockPrisma.user.update.mockResolvedValue(updatedUser);

    const result = await userService.updateUser(1, userData);

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: userData,
    });
    expect(result).toEqual(updatedUser);
  });

  it('should update user password if provided', async () => {
    const userData = { password: 'novaSenha' };
    const updatedUser = { id: 1, password: 'hashedPassword' };
    mockPrisma.user.update.mockResolvedValue(updatedUser);

    const result = await userService.updateUser(1, userData);

    expect(bcrypt.hash).toHaveBeenCalledWith('novaSenha', 10);
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { password: 'hashedPassword' },
    });
    expect(result).toEqual(updatedUser);
  });

  it('should delete a user', async () => {
    mockPrisma.user.delete.mockResolvedValue({ id: 1 });

    const result = await userService.deleteUser(1);

    expect(mockPrisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual({ id: 1 });
  });

  it('should compare plain password with hashed password', async () => {
    const isMatch = await userService.comparePassword('password', 'hashedPassword');
    expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
    expect(isMatch).toBe(true);

    const isNotMatch = await userService.comparePassword('wrong', 'hashedPassword');
    bcrypt.compare.mockResolvedValueOnce(false);
    expect(isNotMatch).toBe(false);
  });

  it('should generate a JWT token for a user id', () => {
    const token = userService.generateToken(1);
    expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
    expect(token).toBe('mockedToken');
  });
});