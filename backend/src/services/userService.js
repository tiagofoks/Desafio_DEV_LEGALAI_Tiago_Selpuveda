const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

async function createUser(userData) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return prisma.user.create({
    data: { ...userData, password: hashedPassword },
  });
}

async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

async function updateUser(id, userData) {
  return prisma.user.update({
    where: { id },
    data: userData,
  });
}

async function deleteUser(id) {
  return prisma.user.delete({
    where: { id },
  });
}

async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  deleteUser,
  comparePassword,
  generateToken,
};