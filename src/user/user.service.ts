import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserInput: Prisma.UserCreateInput) {
    // const password: string = await bcrypt.hash(createUserInput.password, 10);
    this.prisma.user.create({
      data: createUserInput,
    });
  }

  // async createEmployee(
  //   createUserInput: Prisma.UserCreateInput,
  //   companyId: string,
  // ) {
  //   return await this.prisma.user.create({
  //     data: { ...createUserInput, employees: { create: { companyId } } },
  //   });
  // }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findUsersByIds(authorIds: readonly string[]) {
    return this.prisma.user.findMany({
      where: {
        id: {
          in: [...authorIds],
        },
      },
    });
  }

  // update(id: string, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: string) {
  //   return `This action removes a #${id} user`;
  // }
}
