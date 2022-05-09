import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ValidationError } from 'joi';

import { transformValidationError } from '../common/helpers/ValidationErrorTransformer';
import { UserService } from '../user/user.service';
import { LoginInput, Login, SignupInput, SignupPayload } from '../graphql';
import { signupInputValidationSchema } from './validation/signup.input.validation';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
  ) {}

  private static async validate(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public async login(input: LoginInput) {
    const validationErrorPayload: Login = {
      errors: [
        {
          field: 'emailAddress',
          message: 'Wrong email or password',
        },
        {
          field: 'password',
          message: 'Wrong email or password',
        },
      ],
      isLoginSuccessful: false,
    };

    const user = await this.userService.findUserByEmail(input.email);
    if (!user) {
      return validationErrorPayload;
    }

    const isPasswordCorrect = await AuthService.validate(
      input.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      return validationErrorPayload;
    }

    return {
      isLoginSuccessful: true,
      jwtToken: this.signToken(user.id),
    };
  }

  public async register(input: SignupInput): Promise<SignupPayload> {
    const validationPayload = await this.signupValidation(input);
    if (validationPayload !== null) {
      return validationPayload;
    }

    const hashPassword = await bcrypt.hash(input.password, 10);
    await this.userService.createUser({
      ...input,
      password: hashPassword,
    });
  }

  public async validateUser(userId: string) {
    return this.userService.findUserById(userId);
  }

  private async signupValidation(
    input: SignupInput,
  ): Promise<SignupPayload | null> {
    const user = await this.userService.findUserByEmail(input.email);

    if (user) {
      return {
        errors: [
          {
            field: 'emailAddress',
            message: 'User with same email is already exist',
          },
        ],
        user,
      };
    }
    try {
      await signupInputValidationSchema.validateAsync(input, {
        abortEarly: false,
      });
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        const errors = transformValidationError(error);
        return {
          errors,
          user,
        };
      }
      throw error;
    }
    return null;
  }

  private signToken(id: string): string {
    const payload = { userId: id };
    return this.jwt.sign(payload);
  }
}
