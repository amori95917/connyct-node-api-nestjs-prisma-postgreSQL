import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// TODO: typing needed when graphql work starts
const user = {
  firstName: 'Connyct',
  lastName: 'Admin',
  username: 'connyct',
  email: 'admin@gmail.com',
  password: 'Connyct@123',
  isActive: true,
  isSuperuser: true,
};

const roles = [
  { name: 'OWNER' },
  { name: 'MANAGER' },
  { name: 'EDITOR' },
  { name: 'STAFF' },
];

async function main() {
  console.log(`Start seeding ...`);
  const userInstance = await prisma.user.create({
    data: user,
  });
  console.log(`Created user with id: ${userInstance.id}`);
  console.log(`User Seeding finished.`);
  for (const role of roles) {
    const roleInstance = await prisma.role.create({
      data: role,
    });
    console.log(`Created role with name: ${roleInstance.name}`);
  }
  console.log(`Role Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
