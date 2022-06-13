import { PrismaModule } from './../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { EmployeeService } from './services/employee.service';
import { EmployeeResolver } from './resolvers/employee.resolver';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PrismaModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: `smtp://${process.env.MAILDOMAIN}:${process.env.PASSWORD}@smtp.gmail.com`,
        defaults: {
          from: `"nest-modules" <modules@nestjs.com>`,
        },
      }),
    }),
    UserModule,
  ],
  providers: [EmployeeService, EmployeeResolver],
})
export class EmployeeModule {}
