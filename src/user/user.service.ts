import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { Logger } from 'winston';
import { RegisterUser, UserResponse, LoginUser } from './model/user.model';
import { userValidation } from './model/user.validation';
import * as bcrypt from 'bcrypt';
import { JwtTokenService } from 'src/auth/jwt/jwtToken.service';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    private validation: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private log: Logger,
    private db: PrismaService,
    private jwt: JwtTokenService,
  ) {}

  async register(request: RegisterUser): Promise<UserResponse> {
    this.log.info('user registration process');

    const registerUser: RegisterUser = this.validation.validate(
      userValidation.registerValidation,
      request,
    );

    // check username
    const exists: number = await this.db.user.count({
      where: {
        username: registerUser.username,
      },
    });

    if (exists !== 0) {
      this.log.warn(
        `failed: username '${registerUser.username}' already exists`,
      );
      throw new HttpException('Username already exists', 400);
    }

    // hash
    const hashedPassword = await bcrypt.hash(registerUser.password, 12);

    try {
      const user = await this.db.user.create({
        data: {
          username: registerUser.username,
          password: hashedPassword,
        },
      });

      return {
        username: user.username,
      };
    } catch (error) {
      this.log.error('Failed to create user in database', error);
      throw new HttpException('Failed to register user', 500);
    }
  }

  async login(request: LoginUser): Promise<UserResponse> {
    this.log.info('user login process');

    const loginUser: LoginUser = this.validation.validate(
      userValidation.loginValidation,
      request,
    );

    // check user
    const user = await this.db.user.findFirst({
      where: {
        username: loginUser.username,
      },
    });

    if (!user) {
      this.log.warn(`user with username ${loginUser.username} didnt exists`);
      throw new HttpException(
        'invalid credentials, check your username or password',
        400,
      );
    }

    const isValid = await bcrypt.compare(loginUser.password, user.password);

    if (!isValid) {
      throw new HttpException(
        'invalid credentials, check your username or password',
        400,
      );
    }

    try {
      const payload: JwtPayload = {
        sub: user.id.toString(),
        username: user.username,
      };

      const token = this.jwt.generateToken(payload);

      return {
        access_token: token,
      };
    } catch (error) {
      this.log.error('Failed to generate user token', error);
      throw new HttpException('Failed to login user', 500);
    }
  }

  async getProfile(userID: number): Promise<UserResponse> {
    const user = await this.db.user.findUnique({
      where: {
        id: userID,
      },
      select: {
        username: true,
      },
    });

    if (!user) {
      throw new HttpException('user not found', 404);
    }

    return {
      username: user.username,
    };
  }
}
