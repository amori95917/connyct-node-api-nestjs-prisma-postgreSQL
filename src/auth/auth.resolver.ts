import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { LoginInput, SignupInput } from '../graphql';
import { AuthService } from './auth.service';

@Resolver('auth')
export class AuthResolver {
  public constructor(private readonly authService: AuthService) {}

  @Mutation('login')
  loginUser(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  @Mutation('signup')
  signupUser(@Args('input') input: SignupInput) {
    return this.authService.register(input);
  }
}
