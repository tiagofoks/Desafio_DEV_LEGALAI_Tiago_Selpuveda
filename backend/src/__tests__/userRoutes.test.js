const request = require('supertest');
const app = require('../server');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

describe('User Routes', () => {
  let newUser;
  let authToken;

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('testepassword', 10);
    newUser = await prisma.user.create({
      data: {
        name: 'Teste User',
        email: 'testuser@email.com',
        password: hashedPassword,
        age: 30,
        interestArea: 'Testes',
        location: 'Local de Teste',
      },
    });

    authToken = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await prisma.user.delete({
      where: { id: newUser.id },
    });
    await prisma.$disconnect();
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/users/register')
      .send({
        name: 'Novo Teste',
        email: 'novoteste@email.com',
        password: 'senhaforte',
        age: 25,
        interestArea: 'Outros Testes',
        location: 'Outro Local',
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('novoteste@email.com');
    registeredUserId = response.body.id;
  });

  it('should login an existing user with correct credentials', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'testuser@email.com',
        password: 'testepassword',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
  });

  it('should not login with incorrect password', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'testuser@email.com',
        password: 'senhaerrada',
      });
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Credenciais inválidas');
  });

  it('should not login with non-existent email', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'naoexiste@email.com',
        password: 'qualquersenha',
      });
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Credenciais inválidas');
  });

  it('should update an existing user', async () => {
    const updatedData = {
      name: 'Nome Atualizado',
      age: 31,
      interestArea: 'Testes Atualizados',
      location: 'Local Atualizado',
    };

    const response = await request(app)
      .put(`/users/${newUser.id}`)
      .send(updatedData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', newUser.id);
    expect(response.body.name).toBe(updatedData.name);
    expect(response.body.age).toBe(updatedData.age);
    expect(response.body.interestArea).toBe(updatedData.interestArea);
    expect(response.body.location).toBe(updatedData.location);

    const updatedUserInDb = await prisma.user.findUnique({ where: { id: newUser.id } });
    expect(updatedUserInDb).toBeDefined();
    expect(updatedUserInDb?.name).toBe(updatedData.name);
    expect(updatedUserInDb?.age).toBe(updatedData.age);
    expect(updatedUserInDb?.interestArea).toBe(updatedData.interestArea);
    expect(updatedUserInDb?.location).toBe(updatedData.location);
  });

  it('should not update a non-existent user', async () => {
    const nonExistentId = 9999;
    const updatedData = { name: 'Tentativa de Atualização' };

    const response = await request(app)
      .put(`/users/${nonExistentId}`)
      .send(updatedData);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Usuário não encontrado');
  });

  it('should delete an existing user', async () => {
    const response = await request(app)
      .delete(`/users/${newUser.id}`);

    expect(response.statusCode).toBe(204);
    expect(response.body).toEqual({}); 

    const deletedUserInDb = await prisma.user.findUnique({ where: { id: newUser.id } });
    expect(deletedUserInDb).toBeNull();
  });

  it('should not delete a non-existent user', async () => {
    const nonExistentId = 9999;

    const response = await request(app)
      .delete(`/users/${nonExistentId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Usuário não encontrado');
  });
});