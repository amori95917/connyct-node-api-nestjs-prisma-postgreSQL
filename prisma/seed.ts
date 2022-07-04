import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

// import { Role } from 'src/modules/auth/enum/role.enum';

const prisma = new PrismaClient();

enum Role {
  Admin = 'ADMIN',
  User = 'USER',
  Owner = 'OWNER',
  Manager = 'MANAGER',
  Editor = 'EDITOR',
}

// TODO: typing needed when graphql work starts
const user = {
  firstName: 'Connyct',
  lastName: 'Admin',
  username: 'connyct',
  email: 'admin@gmail.com',
  password: 'Connyct@123',
  isActive: true,
  isValid: true,
  isSuperuser: true, // when using role this we might discard
  confirm: true,
};

const roles = [
  { name: 'ADMIN' },
  { name: 'OWNER' },
  { name: 'MANAGER' },
  { name: 'EDITOR' },
  { name: 'STAFF' },
  { name: 'USER' },
];

async function main() {
  console.log(`Start seeding ...`);
  const createAllRoles = await prisma.role.createMany({
    data: roles,
    skipDuplicates: true,
  });
  console.log('createAllRoles', createAllRoles);
  console.log(`Role Seeding finished.`);
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const adminRole = await prisma.role.findUnique({
    where: { name: Role.Admin },
  });
  const userInstance = await prisma.user.create({
    data: {
      ...user,
      password: hashedPassword,
      userRoles: { create: { roleId: adminRole.id } },
    },
  });
  console.log(`Created user with id: ${userInstance.id}`);
  console.log(`User Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
