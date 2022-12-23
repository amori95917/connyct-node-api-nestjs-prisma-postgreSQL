import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';

import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ValidationService } from 'src/modules/user/services/validation.service';

import * as jwt from 'jsonwebtoken';

interface JWT {
  userId: string;
  email: string;
  exp: number;
}

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    if (req.headers.authorization?.includes('Bearer')) {
      const token: string = String(req.headers.authorization).split(/ /g)[1];

      if (!token) throw new ForbiddenException('Invalid authorization');
      jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err) => {
        if (err) throw new ForbiddenException('Invalid authorization');
      });
      const { userId } = jwt.decode(token) as JWT;
      const user = await this.prismaService.user.findFirst({
        where: { id: userId },
        include: { userRoles: true, activeRole: true },
      });

      if (user && !user.confirm) {
        throw new ForbiddenException('User not confirmed');
      }

      if (user) {
        delete user.password;
        req.user = user;
        req.user.isAdmin = await this.validationService.isAdmin(userId);
        // should we attach role to req.user?
      }
    }
    next();
  }
}
