import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { company } from './seed-data/company-seed';
import { user } from './seed-data/user-seed';
import { post } from './seed-data/post-seed';
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
const companyUser = {
  firstName: 'Kiran',
  lastName: 'Budhathoki',
  username: 'kiran247437',
  email: 'owner@gmail.com',
  password: 'company@123',
};

const roles = [
  { name: 'ADMIN' },
  { name: 'OWNER' },
  { name: 'MANAGER' },
  { name: 'EDITOR' },
  { name: 'STAFF' },
  { name: 'USER' },
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
    },
  });
  console.log('company user', companyUserData);
  const newCompany = company.map((data) =>
    Object.assign(data, { ownerId: companyUserData.id }),
  );
  const companyData = await prisma.company.createMany({
    data: newCompany,
    skipDuplicates: true,
  });
  console.log('createAllCompanies', companyData);
  console.log('Company seeding finished');

  const normalUser = await prisma.user.createMany({
    data: user,
    skipDuplicates: true,
  });
  console.log('Normal user seeding', normalUser);
  console.log('Normal user seeding finished');

  const getCompany = await prisma.company.findMany();
  const newPost = post.map((posts) =>
    Object.assign(
      posts,
      { creatorId: companyUserData.id },
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
}
main()
  .catch((e) => {
    console.error('seeding error', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
