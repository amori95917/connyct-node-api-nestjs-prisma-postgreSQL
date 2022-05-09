import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { EnvironmentVariables } from '../../config/env.type';
import { AuthService } from '../auth.service';

export class JwtDto {
  public userId!: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: EnvironmentVariables.jwtSecret,
    });
  }

  public async validate(payload: JwtDto) {
    const user = await this.authService.validateUser(payload.userId);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
