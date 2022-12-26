import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { company } from './seed-data/company-seed';
import { user } from './seed-data/user-seed';
import { User } from 'src/modules/user/entities/user.entity';
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
const admin = {
  fullName: 'Connyct Admin',
  username: 'connyct',
  email: 'admin@gmail.com',
  password: 'Connyct@123',
  isActive: true,
  isValid: true,
  isSuperuser: true, // when using role this we might discard
  confirm: true,
};
// Todo=> error occurs while logging with companyUser
const companyUser = {
  fullName: 'Kiran Budhathoki',
  username: 'kiran247437',
  email: 'owner@gmail.com',
  password: 'company@123',
  isActive: true,
  isValid: true,
  confirm: true,
};
const manager = {
  fullName: 'Bishes',
  username: 'manager247437',
  email: 'manager@gmail.com',
  password: 'manager@123',
  isActive: true,
  isValid: true,
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
const reactions = [
  { reactionType: 'LIKE' },
  { reactionType: 'USEFUL' },
  { reactionType: 'PRAISE' },
  { reactionType: 'APPRECIATION' },
  { reactionType: 'INSIGHTFUL' },
  { reactionType: 'CURIOUS' },
  { reactionType: 'DISGUSTING' },
];
const hashedPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};
const role = async (role: string) =>
  await prisma.role.findUnique({
    where: { name: role },
  });
const userName = (name: string) => {
  const result = Date.now().toString(36);
  return (name + result).toLowerCase();
};
async function main() {
  console.log(`Start seeding ...`);
  const createAllRoles = await prisma.role.createMany({
    data: roles,
    skipDuplicates: true,
  });
  console.log('createAllRoles', createAllRoles);
  console.log(`Role Seeding finished.`);

  const userInstance = await prisma.user.create({
    data: {
      ...admin,
      password: await hashedPassword(admin.password),
      userRoles: { create: { roleId: (await role(Role.Admin)).id } },
    },
  });
  console.log(`Created admin with id: ${userInstance.id}`);
  console.log(`Admin Seeding finished.`);

  const userPass = await Promise.all(
    user.map(async (user) => {
      return {
        ...user,
        password: await hashedPassword(user.password),
      };
    }),
  );

  const userData = await Promise.all(
    userPass.map(async (data) => {
      return await prisma.user.create({
        data: data,
      });
    }),
  );
  const userProfile = await Promise.all(
    userData.map(
      async (us) =>
        await prisma.userProfile.create({
          data: {
            userId: us.id,
          },
        }),
    ),
  );
  console.log(userProfile, 'seeding user profile');

  const newRole = await Promise.all(
    userData.map(async (user) => {
      return { userId: user.id, roleId: (await role(Role.Owner)).id };
    }),
  );
  const createUserRole = await prisma.userRole.createMany({ data: newRole });
  console.log(createUserRole, 'seeding user roles');

  const data = company.map((com, i) => ({
    ...com,
    slug: userName(com.legalName.split(' ')[0]),
    ownerId: userData[i].id,
  }));

  const companyData = await prisma.company.createMany({
    data: data,
    skipDuplicates: true,
  });
  console.log(companyData, 'seeding company data');

  await prisma.reactions.createMany({
    data: reactions,
  });
}
main()
  .catch((e) => {
    console.error('seeding error', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
