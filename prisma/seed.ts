import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { company } from './seed-data/company-seed';
import { post } from './seed-data/post-seed';
import { user } from './seed-data/user-seed';
import { products } from './seed-data/product-seed';
import { readdirSync } from 'fs';
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
// Todo=> error occurs while logging with companyUser
const companyUser = {
  firstName: 'Kiran',
  lastName: 'Budhathoki',
  username: 'kiran247437',
  email: 'owner@gmail.com',
  password: 'company@123',
  isActive: true,
  isValid: true,
  confirm: true,
};
const manager = {
  firstName: 'Bishes',
  lastName: 'Manager',
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

  const companyUserData = await prisma.user.create({
    data: {
      ...companyUser,
      password: await hashedPassword(companyUser.password),
      userRoles: { create: { roleId: (await role(Role.Owner)).id } },
      Company: {
        createMany: {
          data: company,
          skipDuplicates: true,
        },
      },
    },
  });
  const createManager = await prisma.user.create({
    data: {
      ...manager,
      password: await hashedPassword(manager.password),
      userRoles: { create: { roleId: (await role(Role.Manager)).id } },
    },
  });
  console.log('createAllCompanies seeding', companyUser);
  console.log('Company seeding finished');
  const normalUserData = await Promise.all(
    user.map(async (user) => {
      return {
        ...user,
        password: await hashedPassword(user.password),
      };
    }),
  );

  const normalUser = await prisma.user.createMany({
    data: normalUserData,
    skipDuplicates: true,
  });
  const userRole = await prisma.user.findMany({ where: { isActive: false } });
  const newRole = await Promise.all(
    userRole.map(async (user) => {
      return { userId: user.id, roleId: (await role(Role.User)).id };
    }),
  );
  const createUserRole = await prisma.userRole.createMany({ data: newRole });
  console.log('Normal user seeding', normalUser);
  console.log('Normal user seeding finished');

  const getCompany = await prisma.company.findMany();
  const newPost = post.map((posts) =>
    Object.assign(
      posts,
      { creatorId: createManager.id },
      { companyId: getCompany[Math.floor(Math.random() * 50)].id },
    ),
  );
  const companyPost = await prisma.post.createMany({
    data: newPost,
    skipDuplicates: true,
  });
  console.log('Post seeding', companyPost);
  console.log('Post seeding finished');

  // const fileName: string[] = [];
  const files = readdirSync('./src/modules/post/uploads/feeds');
  const fileNames = files.map((images) => images);
  const getPost = await prisma.post.findMany();
  const newProducts = products.map((product) =>
    Object.assign(
      product,
      {
        image: fileNames[Math.floor(Math.random() * 350)],
      },
      { postId: getPost[Math.floor(Math.random() * 500)].id },
    ),
  );
  const createProducts = await prisma.product.createMany({
    data: newProducts,
    skipDuplicates: true,
  });
  console.log('Products seeding', createProducts);
  console.log('Products seeding finished');

  const createReactions = await prisma.reactions.createMany({
    data: reactions,
  });
  console.log('Reactions seeding', createReactions);
  console.log('Reactions seeding finished');
}
main()
  .catch((e) => {
    console.error('seeding error', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
