import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { PrismaService } from 'src/modules/prisma/prisma.service';

import { ROLES_KEY } from '../decorators/role.decorator';
import { Role } from '../enum/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  // private readonly lock = new Semaphore();
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context): Promise<boolean> {
    // acquire the lock before accessing shared resources
    // await this.lock.acquire();
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('###########################', requiredRoles);

    // check the context type and retrieve the user information
    let user;
    if (context.contextType === 'http') {
      const contextHTTP = context.switchToHttp().getRequest();
      user = contextHTTP.user;
    } else if (context.contextType === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      if (ctx.getContext().req.headers['authorization']) {
        user = ctx.getContext().req?.user;
      } else {
        const info = ctx.getContext().req.body;
        // Need better way to handle such bypass
        if (info.operationName === 'signup' || info.operationName === 'login') {
          // allow access to signup and login mutations
          return true;
        } else {
          throw new UnauthorizedException('Access token is required');
        }
      }
    } else {
      throw new Error('Invalid context type');
    }
    // check if the user has the required roles
    if (!requiredRoles) return true;
    if (!user) return false;
    const _user = await this.prisma.user.findFirst({
      where: { id: user.id },
      include: { userRoles: { include: { role: true } } },
    });
    console.log(_user, 'user role');
    return _user.userRoles.some((role) =>
      requiredRoles.includes(role.role.name as any),
    );
  }
}
