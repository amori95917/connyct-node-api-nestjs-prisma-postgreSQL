import { InvitedEmployee } from './../entities/invitedEmployee.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { User } from 'src/modules/user/entities/user.entity';
import { InvitedEmployeeInput } from '../dto/invite-employee.input';
import { MailerService } from '@nestjs-modules/mailer';
import { UserEmployeeInput } from '../dto/user-employee.input';
import { PasswordService } from 'src/modules/user/services/password.service';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private mailService: MailerService,
    private passwordService: PasswordService,
  ) {}

  async invite(
    invitedEmployee: InvitedEmployeeInput,
    user: User,
  ): Promise<InvitedEmployee> {
    try {
      const role = await this.prisma.role.findFirst({
        where: { name: invitedEmployee.role },
      });
      if (!role) throw new Error('Role does not exist');
      const { id } = user;
      const findUser = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });
      if (!findUser) throw new Error('User not found');

      const invitedEmployeeData = await this.prisma.invitedEmployee.create({
        data: {
          invitedEmail: invitedEmployee.invitedEmail,
          invitedId: id,
          invitedRoleId: role.id,
        },
      });
      const userCompany = await this.prisma.user.findUnique({
        where: { id: id },
        select: {
          Company: {
            select: { contactEmail: true },
          },
        },
      });
      let contactEmail;
      userCompany.Company.forEach((company) => (contactEmail = company));
      await this.mailService.sendMail({
        to: invitedEmployee.invitedEmail,
        from: 'forzen247437@gmail.com',
        subject: 'Company Invitation',
        text: 'Hello',
        html: '<b>Accept</b><b></Decline>',
      });
      return invitedEmployeeData;
    } catch (e) {
      throw new Error(e);
    }
  }

  async createEmployee(employee: UserEmployeeInput): Promise<User> {
    try {
      if (!employee.isInviteAccepted)
        throw new Error('Invitation not accepted');
      const { isInviteAccepted, role, ...userInput } = employee;
      const invitedEmployee = await this.prisma.invitedEmployee.findFirst({
        where: {
          invitedEmail: employee.email,
        },
      });
      if (!invitedEmployee) throw new Error('Email doesnot exist');
      await this.prisma.invitedEmployee.update({
        where: { invitedEmail: employee.email },
        data: { isInviteAccepted: isInviteAccepted },
      });
      const checkUser = await this.prisma.user.findFirst({
        where: { email: employee.email },
      });
      if (checkUser) throw new Error('Email already exist');
      // check invited employee role
      const userRole = await this.prisma.role.findFirst({
        where: { name: role },
      });
      if (!userRole) throw new Error('Role not found');
      const checkRole = await this.prisma.invitedEmployee.findFirst({
        where: { invitedRoleId: userRole.id },
      });
      if (!checkRole) throw new Error('Role did not matched');
      // create user
      const hashedPassword = await this.passwordService.hashPassword(
        employee.password,
      );
      const user = await this.prisma.user.create({
        data: { ...userInput, password: hashedPassword },
      });
      // adding role in userRole table
      const assignRole = await this.prisma.userRole.create({
        data: { userId: user.id, roleId: userRole.id },
      });
      return user;
    } catch (e) {
      throw new Error(e);
    }
  }
}
