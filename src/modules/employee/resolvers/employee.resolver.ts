import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/modules/auth/decorators/role.decorator';
import { Role } from 'src/modules/auth/enum/role.enum';
import { UserDecorator } from 'src/modules/user/decorators/user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { InvitedEmployeeInput } from '../dto/invite-employee.input';
import { UserEmployeeInput } from '../dto/user-employee.input';
import { InvitedEmployee } from '../entities/invitedEmployee.entity';
import { EmployeeService } from '../services/employee.service';

@Resolver()
export class EmployeeResolver {
  constructor(private readonly employeeService: EmployeeService) {}

  @Roles(Role.Owner, Role.Manager)
  @Mutation(() => InvitedEmployee)
  async inviteEmployee(
    @Args('data') invitedEmployee: InvitedEmployeeInput,
    @UserDecorator() user: User,
  ): Promise<any> {
    return this.employeeService.invite(invitedEmployee, user);
  }

  @Mutation(() => User)
  async createEmployee(
    @Args('data') employee: UserEmployeeInput,
  ): Promise<User> {
    return this.employeeService.createEmployee(employee);
  }
}
