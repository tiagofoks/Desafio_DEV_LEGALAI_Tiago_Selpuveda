const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seed() {
  const password = await bcrypt.hash('senha123', 10);
  await prisma.user.createMany({
    data: [
      { name: 'João da Silva', email: 'joao@email.com', password, age: 30, interestArea: 'Tecnologia', location: 'São Paulo' },
      { name: 'Maria Souza', email: 'maria@email.com', password, age: 25, interestArea: 'Gastronomia', location: 'Rio de Janeiro' },
      { name: 'Pedro Alves', email: 'pedro@email.com', password, age: 40, interestArea: 'Música', location: 'Belo Horizonte' },
      { name: 'Ana Clara', email: 'ana@email.com', password, age: 28, interestArea: 'Tecnologia', location: 'Curitiba' },
      { name: 'Lucas Santos', email: 'lucas@email.com', password, age: 35, interestArea: 'Esportes', location: 'Porto Alegre' },
    ],
  });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });