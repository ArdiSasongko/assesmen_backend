import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseApi } from 'src/model/response';
import { LoginUser, RegisterUser, UserResponse } from './model/user.model';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('/api/users')
export class UserController {
  constructor(
    private service: UserService,

    @Inject(WINSTON_MODULE_PROVIDER) private log: Logger,
  ) {}

  @Post()
  @HttpCode(201)
  async registerUser(
    @Body() request: RegisterUser,
  ): Promise<ResponseApi<UserResponse>> {
    const result = await this.service.register(request);

    this.log.info(`register user (${result.username}) success`);
    return {
      status_code: 201,
      message: 'register user success',
      data: result,
    };
  }

  @Post('/login')
  @HttpCode(201)
  async loginUser(
    @Body() request: LoginUser,
  ): Promise<ResponseApi<UserResponse>> {
    const result = await this.service.login(request);

    this.log.info(`login user success`);
    return {
      status_code: 200,
      message: 'login user success',
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async getProfile(@Request() req): Promise<ResponseApi<UserResponse>> {
    const userIdStr: string = req.user.sub;
    const userIdInt: number = parseInt(userIdStr, 10);

    const result = await this.service.getProfile(userIdInt);
    this.log.info(`get profile from ${result.username}`);
    return {
      status_code: 200,
      message: 'get profile successfully',
      data: result,
    };
  }
}
