import { Injectable } from '@nestjs/common';

import { Role } from 'src/modules/auth/enum/role.enum';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ValidationService {
  constructor(private readonly prisma: PrismaService) {}

  async isAdmin(userId: string): Promise<boolean> {
    const u = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { userRoles: { include: { role: true } } },
    });
    return u.userRoles.some((role) => {
      if (role.role.name === Role.Admin) {
        return true;
      }
    });
  }
}
